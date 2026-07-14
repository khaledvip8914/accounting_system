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

export async function createFixedAsset(data: {
  code: string;
  name: string;
  nameAr?: string;
  description?: string;
  purchaseDate: string;
  purchasePrice: number;
  salvageValue?: number;
  usefulLifeYears: number;
  depreciationMethod: string;
}) {
  try {
    const { companyId, permissions } = await getAuthContext();
    if (!hasPermission(permissions, 'accounting', 'edit')) {
      throw new Error('غير مصرح لك بإدارة الأصول');
    }

    const netBookValue = data.purchasePrice;

    const asset = await prisma.fixedAsset.create({
      data: {
        ...data,
        companyId,
        purchaseDate: new Date(data.purchaseDate),
        salvageValue: data.salvageValue || 0,
        netBookValue,
      }
    });

    revalidatePath('/financial/fixed-assets');
    revalidatePath('/financial');
    return { success: true, asset };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateFixedAsset(id: string, data: any) {
  try {
    const { companyId, permissions } = await getAuthContext();
    if (!hasPermission(permissions, 'accounting', 'edit')) {
      throw new Error('غير مصرح لك بإدارة الأصول');
    }

    const asset = await prisma.fixedAsset.update({
      where: { id, companyId },
      data: {
        ...data,
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
      }
    });

    revalidatePath('/financial/fixed-assets');
    return { success: true, asset };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteFixedAsset(id: string) {
  try {
    const { companyId, permissions } = await getAuthContext();
    if (!hasPermission(permissions, 'accounting', 'delete')) {
      throw new Error('غير مصرح لك بإدارة الأصول');
    }

    await prisma.fixedAsset.delete({
      where: { id, companyId }
    });

    revalidatePath('/financial/fixed-assets');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function runDepreciation(assetId: string, amount: number, date: string) {
  try {
    const { companyId, permissions } = await getAuthContext();
    if (!hasPermission(permissions, 'accounting', 'edit')) {
      throw new Error('غير مصرح لك بإدارة الأصول');
    }

    const result = await prisma.$transaction(async (tx) => {
      const asset = await tx.fixedAsset.findFirst({ where: { id: assetId, companyId } });
      if (!asset) throw new Error('Asset not found');

      const newAccumulated = asset.accumulatedDepreciation + amount;
      const newNetBook = asset.purchasePrice - newAccumulated;

      if (newNetBook < asset.salvageValue) {
        throw new Error('Depreciation exceeds salvage value');
      }

      // Record schedule
      const schedule = await tx.depreciationSchedule.create({
        data: {
          assetId,
          amount,
          date: new Date(date),
          accumulatedTotal: newAccumulated
        }
      });

      // Update asset
      await tx.fixedAsset.update({
        where: { id: assetId, companyId },
        data: {
          accumulatedDepreciation: newAccumulated,
          netBookValue: newNetBook
        }
      });

      // Generate Journal Entry
      // 1. Debit Depreciation Expense
      let expenseAccount = await tx.account.findFirst({ where: { code: '5100', companyId } });
      if (!expenseAccount) {
        expenseAccount = await tx.account.create({
          data: { companyId, code: '5100', name: 'Depreciation Expense', nameAr: 'مصروف الاستهلاك', type: 'Expense', nature: 'Debit' }
        });
      }

      // 2. Credit Accumulated Depreciation
      let accDepAccount = await tx.account.findFirst({ where: { code: '1510', companyId } });
      if (!accDepAccount) {
        accDepAccount = await tx.account.create({
          data: { companyId, code: '1510', name: 'Accumulated Depreciation', nameAr: 'مجمع الاستهلاك', type: 'Asset', nature: 'Credit' } // Contra asset
        });
      }

      const count = await tx.journalVoucher.count({ where: { companyId } });
      const ref = `DEP-${new Date().getFullYear()}-${(count + 1).toString().padStart(3, '0')}`;

      const jv = await tx.journalVoucher.create({
        data: {
          companyId,
          reference: ref,
          date: new Date(date),
          description: `Depreciation for asset ${asset.code} - ${asset.name}`,
          status: 'Posted',
          entries: {
            create: [
              {
                accountId: expenseAccount.id,
                date: new Date(date),
                description: `Depreciation Expense for ${asset.code}`,
                debit: amount,
                credit: 0
              },
              {
                accountId: accDepAccount.id,
                date: new Date(date),
                description: `Accumulated Depreciation for ${asset.code}`,
                debit: 0,
                credit: amount
              }
            ]
          }
        }
      });

      await tx.depreciationSchedule.update({
        where: { id: schedule.id },
        data: { journalVoucherId: jv.id }
      });

      return schedule;
    });

    revalidatePath('/financial/fixed-assets');
    revalidatePath('/ledger');
    return { success: true, schedule: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
