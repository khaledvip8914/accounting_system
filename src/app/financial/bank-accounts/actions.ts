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

export async function createBankAccount(data: {
  bankName: string;
  bankNameAr?: string;
  accountNumber: string;
  currency: string;
  initialBalance: number;
  linkedAccountId?: string;
}) {
  try {
    const { companyId, permissions } = await getAuthContext();
    if (!hasPermission(permissions, 'financials', 'edit')) {
      throw new Error('غير مصرح لك');
    }

    const bankAccount = await prisma.bankAccount.create({
      data: {
        ...data,
        companyId,
        currentBalance: data.initialBalance,
        linkedAccountId: data.linkedAccountId || null,
      }
    });

    revalidatePath('/financial/bank-accounts');
    revalidatePath('/financial/bank-reconciliation');
    return { success: true, bankAccount };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateBankAccount(id: string, data: any) {
  try {
    const { companyId, permissions } = await getAuthContext();
    if (!hasPermission(permissions, 'financials', 'edit')) {
      throw new Error('غير مصرح لك');
    }

    const bankAccount = await prisma.bankAccount.update({
      where: { id, companyId },
      data: {
        bankName: data.bankName,
        bankNameAr: data.bankNameAr,
        accountNumber: data.accountNumber,
        currency: data.currency,
        linkedAccountId: data.linkedAccountId || null,
      }
    });

    revalidatePath('/financial/bank-accounts');
    revalidatePath('/financial/bank-reconciliation');
    return { success: true, bankAccount };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteBankAccount(id: string) {
  try {
    const { companyId, permissions } = await getAuthContext();
    if (!hasPermission(permissions, 'financials', 'delete')) {
      throw new Error('غير مصرح لك');
    }

    await prisma.bankAccount.delete({
      where: { id, companyId }
    });

    revalidatePath('/financial/bank-accounts');
    revalidatePath('/financial/bank-reconciliation');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
