'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';

export async function saveTransactionVoucher(data: any) {
  try {
    const session = await getSession();
    const perms = session?.user?.permissions;
    if (data.id && !hasPermission(perms, 'accounting', 'edit')) {
      throw new Error('غير مصرح لك بتعديل السندات');
    } else if (!data.id && !hasPermission(perms, 'accounting', 'create')) {
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
        const existing = await tx.transactionVoucher.findUnique({ where: { id: data.id } });
        if (!existing) throw new Error('Voucher not found');
        voucherNumber = existing.voucherNumber;

        // Cleanup linked JV entries if exist
        if (existing.journalVoucherId) {
          await tx.journalEntry.deleteMany({ where: { journalVoucherId: existing.journalVoucherId } });
          // Update the existing JV instead of deleting it to avoid cascade issues if any
          await tx.journalVoucher.update({
            where: { id: existing.journalVoucherId },
            data: {
              date: new Date(data.date),
              description: data.description
            }
          });
          jvId = existing.journalVoucherId;
        }

        voucher = await tx.transactionVoucher.update({
          where: { id: data.id },
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
        
        // Find max number for this type/year
        const lastVoucher = await tx.transactionVoucher.findFirst({
           where: { type: data.type, voucherNumber: { contains: `${prefix}-${year}` } },
           orderBy: { voucherNumber: 'desc' }
        });

        let nextNum = 1;
        if (lastVoucher) {
           const parts = lastVoucher.voucherNumber.split('-');
           const lastNum = parseInt(parts[parts.length - 1]);
           if (!isNaN(lastNum)) nextNum = lastNum + 1;
        }

        voucherNumber = `${prefix}-${year}-${nextNum.toString().padStart(3, '0')}`;

        voucher = await tx.transactionVoucher.create({
          data: {
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
        const newJv = await tx.journalVoucher.create({
          data: {
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
        where: { id: voucher.id },
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
    const session = await getSession();
    if (!hasPermission(session?.user?.permissions, 'accounting', 'delete')) {
      throw new Error('غير مصرح لك بحذف السندات');
    }

    await prisma.$transaction(async (tx: any) => {
      const existing = await tx.transactionVoucher.findUnique({ where: { id } });
      if (!existing) throw new Error('Voucher not found');

      if (existing.journalVoucherId) {
        await tx.journalEntry.deleteMany({ where: { journalVoucherId: existing.journalVoucherId } });
        await tx.journalVoucher.delete({ where: { id: existing.journalVoucherId } });
      }
      
      await tx.transactionVoucher.delete({ where: { id } });
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
    const session = await getSession();
    if (!hasPermission(session?.user?.permissions, 'accounting', 'create')) {
      throw new Error('غير مصرح لك بإنشاء قيد يومية');
    }

    const result = await prisma.$transaction(async (tx: any) => {
      const entries: any[] = [];
      let totalDebit = 0;
      let totalCredit = 0;

      for (const row of data.rows) {
        if (!row.accountId || isNaN(row.balance)) continue;
        
        const account = await tx.account.findUnique({ where: { id: row.accountId } });
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

      // Generate OB Journal Voucher reference
      const count = await tx.journalVoucher.count();
      const reference = `OB-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

      const voucher = await tx.journalVoucher.create({
        data: {
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
