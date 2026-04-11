'use server';

import { prisma } from '../../lib/db';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';

export async function getAccounts() {
  return await prisma.account.findMany({ orderBy: { code: 'asc' } });
}

export async function getJournalVouchers() {
  return await prisma.journalVoucher.findMany({
    include: {
      entries: {
        include: { account: true }
      }
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getJournalEntries() {
  return await prisma.journalEntry.findMany({
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
    const session = await getSession();
    if (!hasPermission(session?.user, 'CREATE_JOURNAL')) {
      throw new Error('غير مصرح لك بإنشاء قيد يومية');
    }

    const totalDebit = data.lines.reduce((sum, l) => sum + l.debit, 0);
    const totalCredit = data.lines.reduce((sum, l) => sum + l.credit, 0);

    if (Math.abs(totalDebit - totalCredit) > 0.001) {
      throw new Error('Voucher does not balance');
    }

    const date = new Date(data.date + 'T12:00:00Z');
    
    // Generate simple reference: JV-Year-Count
    const count = await prisma.journalVoucher.count();
    const reference = `JV-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

    await prisma.journalVoucher.create({
      data: {
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

// ─── DELETE JOURNAL VOUCHER ───────────────────────────────────────────────
export async function deleteJournalVoucher(voucherId: string) {
  try {
    const session = await getSession();
    if (!hasPermission(session?.user, 'DELETE_JOURNAL')) {
      throw new Error('غير مصرح لك بحذف قيود اليومية');
    }

    await prisma.$transaction(async (tx: any) => {
      // Unlink from any invoices first
      await tx.salesInvoice.updateMany({
        where: { journalVoucherId: voucherId },
        data: { journalVoucherId: null }
      });
      await tx.purchaseInvoice.updateMany({
        where: { journalVoucherId: voucherId },
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

// ─── UPDATE JOURNAL VOUCHER ───────────────────────────────────────────────
export async function updateJournalVoucher(
  voucherId: string,
  data: {
    date: string;
    description: string;
    lines: { accountId: string; debit: number; credit: number }[];
  }
) {
  try {
    const session = await getSession();
    if (!hasPermission(session?.user, 'EDIT_JOURNAL')) {
      throw new Error('غير مصرح لك بتعديل قيود اليومية');
    }

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
  const count = await prisma.account.count();
  if (count === 0) {
    await prisma.account.createMany({
      data: [
        { code: '1000', name: 'Cash', type: 'Asset' },
        { code: '1200', name: 'Accounts Receivable', type: 'Asset' },
        { code: '2000', name: 'Accounts Payable', type: 'Liability' },
        { code: '3000', name: 'Owner Equity', type: 'Equity' },
        { code: '4000', name: 'Sales Revenue', type: 'Revenue' },
        { code: '5000', name: 'Operating Expense', type: 'Expense' },
      ]
    });
    revalidatePath('/ledger');
  }
}
