'use server';

import { prisma } from '../../lib/db';
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
    permissions: session.user,
    role: session.user.role
  };
}

export async function getAccounts() {
  const { companyId } = await getAuthContext();
  return await prisma.account.findMany({ 
    where: { companyId },
    orderBy: { code: 'asc' } 
  });
}

export async function getJournalVouchers() {
  const { companyId } = await getAuthContext();
  const branchId = await getActiveBranch();
  const whereClause: any = { companyId };
  if (branchId) {
    whereClause.branchId = branchId;
  }
  return await prisma.journalVoucher.findMany({
    where: whereClause,
    include: {
      entries: {
        include: { account: true }
      }
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getJournalEntries() {
  const { companyId } = await getAuthContext();
  const branchId = await getActiveBranch();
  
  const whereClause: any = { account: { companyId } };
  if (branchId) {
    whereClause.journalVoucher = { branchId };
  }
  
  return await prisma.journalEntry.findMany({
    where: whereClause,
    include: { 
      account: true,
      journalVoucher: true
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function saveJournalVoucher(data: {
  date: string;
  description: string;
  lines: { accountId: string; debit: number; credit: number; description?: string }[];
}) {
  try {
    const { companyId, permissions, role } = await getAuthContext();
    if (role !== 'Admin' && !hasPermission(permissions, 'accounting', 'create')) {
      throw new Error('غير مصرح لك بإنشاء قيد يومية');
    }

    const totalDebit = data.lines.reduce((sum, l) => sum + l.debit, 0);
    const totalCredit = data.lines.reduce((sum, l) => sum + l.credit, 0);

    if (Math.abs(totalDebit - totalCredit) > 0.001) {
      throw new Error('Voucher does not balance');
    }

    const date = new Date(data.date + 'T12:00:00Z');
    
    // Generate simple reference: JV-Year-Count (scoped to company)
    const count = await prisma.journalVoucher.count({ where: { companyId } });
    const reference = `JV-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

    await prisma.journalVoucher.create({
      data: {
        companyId,
        reference,
        date,
        description: data.description,
        status: 'Posted',
        entries: {
          create: data.lines.map(line => ({
            date,
            description: line.description || data.description,
            accountId: line.accountId,
            debit: line.debit,
            credit: line.credit,
          }))
        }
      }
    });

    revalidatePath('/ledger');
    revalidatePath('/reports');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to save journal voucher:', error);
    return { success: false, error: error.message || 'Failed' };
  }
}

export async function deleteJournalVoucher(voucherId: string) {
  try {
    const { companyId, permissions, role } = await getAuthContext();
    if (role !== 'Admin' && !hasPermission(permissions, 'accounting', 'delete')) {
      throw new Error('غير مصرح لك بحذف قيود اليومية');
    }

    // Verify ownership
    const existing = await prisma.journalVoucher.findUnique({
      where: { id: voucherId },
      select: { companyId: true }
    });
    if (!existing || existing.companyId !== companyId) throw new Error('Not found');

    await prisma.$transaction(async (tx: any) => {
      // Unlink from any invoices first
      await tx.salesInvoice.updateMany({
        where: { companyId, journalVoucherId: voucherId },
        data: { journalVoucherId: null }
      });
      await tx.purchaseInvoice.updateMany({
        where: { companyId, journalVoucherId: voucherId },
        data: { journalVoucherId: null }
      });
      // Delete entries then voucher
      await tx.journalEntry.deleteMany({ where: { journalVoucherId: voucherId } });
      await tx.journalVoucher.delete({ where: { id: voucherId } });
    });
    revalidatePath('/ledger');
    revalidatePath('/financial');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateJournalVoucher(
  voucherId: string,
  data: {
    date: string;
    description: string;
    lines: { accountId: string; debit: number; credit: number }[];
  }
) {
  try {
    const { companyId, permissions, role } = await getAuthContext();
    if (role !== 'Admin' && !hasPermission(permissions, 'accounting', 'edit')) {
      throw new Error('غير مصرح لك بتعديل قيود اليومية');
    }

    // Verify ownership
    const existing = await prisma.journalVoucher.findUnique({
      where: { id: voucherId },
      select: { companyId: true }
    });
    if (!existing || existing.companyId !== companyId) throw new Error('Not found');

    const totalDebit = data.lines.reduce((sum, l) => sum + l.debit, 0);
    const totalCredit = data.lines.reduce((sum, l) => sum + l.credit, 0);
    if (Math.abs(totalDebit - totalCredit) > 0.001) {
      throw new Error('Voucher does not balance');
    }
    const date = new Date(data.date + 'T12:00:00Z');

    await prisma.$transaction(async (tx: any) => {
      // Replace all entries
      await tx.journalEntry.deleteMany({ where: { journalVoucherId: voucherId } });
      await tx.journalVoucher.update({
        where: { id: voucherId },
        data: {
          date,
          description: data.description,
          entries: {
            create: data.lines.map(line => ({
              date,
              description: data.description,
              accountId: line.accountId,
              debit: line.debit,
              credit: line.credit,
            }))
          }
        }
      });
    });

    revalidatePath('/ledger');
    revalidatePath('/financial');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function setupDefaultAccounts() {
  const { companyId } = await getAuthContext();
  const count = await prisma.account.count({ where: { companyId } });
  if (count === 0) {
    await prisma.account.createMany({
      data: [
        { companyId, code: '1000', name: 'Cash', type: 'Asset' },
        { companyId, code: '1200', name: 'Accounts Receivable', type: 'Asset' },
        { companyId, code: '2000', name: 'Accounts Payable', type: 'Liability' },
        { companyId, code: '3000', name: 'Owner Equity', type: 'Equity' },
        { companyId, code: '4000', name: 'Sales Revenue', type: 'Revenue' },
        { companyId, code: '5000', name: 'Operating Expense', type: 'Expense' },
      ]
    });
    revalidatePath('/ledger');
  }
}

