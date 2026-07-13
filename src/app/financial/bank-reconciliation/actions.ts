'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';

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

export async function createBankReconciliation(data: {
  bankAccountId: string;
  statementDate: string;
  statementBalance: number;
}) {
  try {
    const { companyId, permissions } = await getAuthContext();
    if (!hasPermission(permissions, 'financials', 'edit')) {
      throw new Error('غير مصرح لك');
    }

    const bankAccount = await prisma.bankAccount.findFirst({
      where: { id: data.bankAccountId, companyId }
    });

    if (!bankAccount) {
      throw new Error('Bank account not found');
    }

    const systemBalance = bankAccount.currentBalance;
    const difference = data.statementBalance - systemBalance;

    const rec = await prisma.bankReconciliation.create({
      data: {
        companyId,
        bankAccountId: data.bankAccountId,
        statementDate: new Date(data.statementDate),
        statementBalance: data.statementBalance,
        systemBalance,
        difference,
        status: 'Draft'
      }
    });

    revalidatePath('/financial/bank-reconciliation');
    return { success: true, reconciliation: rec };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addReconciliationItem(data: {
  reconciliationId: string;
  bankStatementId?: string;
  systemVoucherId?: string;
  status: string; // 'Matched', 'Missing in System', 'Missing in Bank'
  notes?: string;
}) {
  try {
    const { companyId, permissions } = await getAuthContext();
    if (!hasPermission(permissions, 'financials', 'edit')) {
      throw new Error('غير مصرح لك');
    }

    const item = await prisma.bankReconciliationItem.create({
      data: {
        reconciliationId: data.reconciliationId,
        bankStatementId: data.bankStatementId || null,
        systemVoucherId: data.systemVoucherId || null,
        status: data.status,
        notes: data.notes
      }
    });

    // If it's a bank statement item that is matched, we could mark the statement as reconciled
    if (data.status === 'Matched' && data.bankStatementId) {
      await prisma.bankStatement.update({
        where: { id: data.bankStatementId },
        data: { isReconciled: true }
      });
    }

    revalidatePath(`/financial/bank-reconciliation/${data.reconciliationId}`);
    return { success: true, item };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function completeReconciliation(id: string) {
  try {
    const { companyId, permissions } = await getAuthContext();
    if (!hasPermission(permissions, 'financials', 'edit')) {
      throw new Error('غير مصرح لك');
    }

    const rec = await prisma.bankReconciliation.update({
      where: { id, companyId },
      data: { status: 'Completed' }
    });

    revalidatePath('/financial/bank-reconciliation');
    return { success: true, reconciliation: rec };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
