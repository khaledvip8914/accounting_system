'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { getActiveBranch } from '@/lib/branch';

async function getAuthContext() {
  const session = await getSession();
  if (!session || !session.user || !session.user.companyId) {
    throw new Error('Unauthorized');
  }
  return {
    companyId: session.user.companyId,
    permissions: session.user
  };
}

export async function saveTransactionVoucher(data: any) {
  try {
    const { companyId, permissions } = await getAuthContext();
    if (data.id && !hasPermission(permissions, 'accounting', 'edit')) {
      throw new Error('غير مصرح لك بتعديل السندات');
    } else if (!data.id && !hasPermission(permissions, 'accounting', 'create')) {
      throw new Error('غير مصرح لك بإنشاء سندات');
    }

    const result = await prisma.$transaction(async (tx: any) => {
      let voucherNumber = '';
      let voucher;
      let jvId = null;
      let jv;

      const isReceipt = data.type === 'RECEIPT';
      const debitAccountId = isReceipt ? data.primaryAccountId : data.relatedAccountId;
      const creditAccountId = isReceipt ? data.relatedAccountId : data.primaryAccountId;

      if (data.id) {
        // Edit flow
        const existing = await tx.transactionVoucher.findFirst({ 
            where: { id: data.id, companyId } 
        });
        if (!existing) throw new Error('Voucher not found');
        voucherNumber = existing.voucherNumber;

        // Cleanup linked JV entries if exist
        if (existing.journalVoucherId) {
          await tx.journalEntry.deleteMany({ 
              where: { journalVoucher: { id: existing.journalVoucherId, companyId } } 
          });
          
          await tx.journalVoucher.update({
            where: { id: existing.journalVoucherId, companyId },
            data: {
              date: new Date(data.date),
              description: data.description
            }
          });
          jvId = existing.journalVoucherId;
        }

        voucher = await tx.transactionVoucher.update({
          where: { id: data.id, companyId },
          data: {
            date: new Date(data.date),
            amount: data.amount,
            description: data.description,
            primaryAccountId: data.primaryAccountId,
            relatedAccountId: data.relatedAccountId
          }
        });

      } else {
        // Create flow
        const prefix = data.type === 'RECEIPT' ? 'RV' : 'PV';
        const year = new Date().getFullYear();
        
        // Find max number for this type/year/company
        const lastVoucher = await tx.transactionVoucher.findFirst({
           where: { companyId, type: data.type, voucherNumber: { contains: `${prefix}-${year}` } },
           orderBy: { voucherNumber: 'desc' }
        });

        let nextNum = 1;
        if (lastVoucher) {
           const parts = lastVoucher.voucherNumber.split('-');
           const lastNum = parseInt(parts[parts.length - 1]);
           if (!isNaN(lastNum)) nextNum = lastNum + 1;
        }

        voucherNumber = `${prefix}-${year}-${nextNum.toString().padStart(3, '0')}`;

        const branchId = await getActiveBranch();

        voucher = await tx.transactionVoucher.create({
          data: {
            companyId,
            branchId,
            voucherNumber,
            type: data.type,
            date: new Date(data.date),
            amount: data.amount,
            description: data.description,
            primaryAccountId: data.primaryAccountId,
            relatedAccountId: data.relatedAccountId,
          }
        });
      }

      if (jvId) {
        // Reuse JV
        await tx.journalEntry.createMany({
          data: [
            { journalVoucherId: jvId, accountId: debitAccountId, debit: data.amount, credit: 0, description: data.description, date: new Date(data.date) },
            { journalVoucherId: jvId, accountId: creditAccountId, debit: 0, credit: data.amount, description: data.description, date: new Date(data.date) },
          ]
        });
      } else {
        const branchId = await getActiveBranch();

        const newJv = await tx.journalVoucher.create({
          data: {
            companyId,
            branchId,
            reference: voucherNumber,
            date: new Date(data.date),
            description: data.description,
            status: 'Posted',
            entries: {
              create: [
                { accountId: debitAccountId, debit: data.amount, credit: 0, description: data.description, date: new Date(data.date) },
                { accountId: creditAccountId, debit: 0, credit: data.amount, description: data.description, date: new Date(data.date) },
              ]
            }
          }
        });
        jvId = newJv.id;
      }

      // 3. Link JV to TransactionVoucher
      const finalVoucher = await tx.transactionVoucher.update({
        where: { id: voucher.id, companyId },
        data: { journalVoucherId: jvId },
        include: { primaryAccount: true, relatedAccount: true }
      });

      return finalVoucher;
    });

    revalidatePath('/financial');
    return { success: true, voucher: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteTransactionVoucher(id: string) {
  try {
    const { companyId, permissions } = await getAuthContext();
    if (!hasPermission(permissions, 'accounting', 'delete')) {
      throw new Error('غير مصرح لك بحذف السندات');
    }

    await prisma.$transaction(async (tx: any) => {
      const existing = await tx.transactionVoucher.findFirst({ 
          where: { id, companyId } 
      });
      if (!existing) throw new Error('Voucher not found');

      if (existing.journalVoucherId) {
        await tx.journalEntry.deleteMany({ 
            where: { journalVoucher: { id: existing.journalVoucherId, companyId } } 
        });
        await tx.journalVoucher.delete({ 
            where: { id: existing.journalVoucherId, companyId } 
        });
      }
      
      await tx.transactionVoucher.delete({ where: { id, companyId } });
    });

    revalidatePath('/financial');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function saveOpeningBalances(data: {
  date: string;
  description: string;
  primaryAccountId: string;
  rows: { accountId: string; balance: number }[];
}) {
  try {
    const { companyId, permissions } = await getAuthContext();
    if (!hasPermission(permissions, 'accounting', 'create')) {
      throw new Error('غير مصرح لك بإنشاء قيد يومية');
    }

    const result = await prisma.$transaction(async (tx: any) => {
      const entries: any[] = [];
      let totalDebit = 0;
      let totalCredit = 0;

      for (const row of data.rows) {
        if (!row.accountId || isNaN(row.balance)) continue;
        
        const account = await tx.account.findFirst({ 
            where: { id: row.accountId, companyId } 
        });
        if (!account) throw new Error('حساب غير موجود');

        let debit = 0;
        let credit = 0;

        if (['Asset', 'Expense'].includes(account.type)) {
          if (row.balance >= 0) debit = row.balance;
          else credit = Math.abs(row.balance);
        } else {
          if (row.balance >= 0) credit = row.balance;
          else debit = Math.abs(row.balance);
        }

        totalDebit += debit;
        totalCredit += credit;

        entries.push({
          accountId: row.accountId,
          debit,
          credit,
          description: data.description || 'رصيد افتتاحي',
          date: new Date(data.date)
        });
      }

      if (entries.length === 0) {
        throw new Error('يجب إدخال رصيد واحد على الأقل');
      }

      const offsetAmount = totalDebit - totalCredit;

      if (Math.abs(offsetAmount) > 0.001) {
        if (!data.primaryAccountId) {
          throw new Error('يجب اختيار حساب الرصيد الافتتاحي لموازنة القيد');
        }

        if (offsetAmount > 0) {
          // Debit is higher, add Credit to balance
          entries.push({
            accountId: data.primaryAccountId,
            debit: 0,
            credit: offsetAmount,
            description: data.description || 'تسوية رصيد افتتاحي',
            date: new Date(data.date)
          });
        } else {
          // Credit is higher, add Debit to balance
          entries.push({
            accountId: data.primaryAccountId,
            debit: Math.abs(offsetAmount),
            credit: 0,
            description: data.description || 'تسوية رصيد افتتاحي',
            date: new Date(data.date)
          });
        }
      }

      // Generate OB Journal Voucher reference (scoped to company)
      const count = await tx.journalVoucher.count({ where: { companyId } });
      const reference = `OB-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

      const branchId = await getActiveBranch();

      const voucher = await tx.journalVoucher.create({
        data: {
          companyId,
          branchId,
          reference,
          date: new Date(data.date),
          description: data.description || 'قيد أرصدة افتتاحية',
          status: 'Posted',
          entries: {
            create: entries
          }
        }
      });

      return voucher;
    });

    revalidatePath('/financial');
    revalidatePath('/ledger');
    revalidatePath('/accounts');
    
    return { success: true, voucher: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
