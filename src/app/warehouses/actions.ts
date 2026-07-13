'use server';

import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { revalidatePath } from 'next/cache';

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

export async function createWarehouse(data: any) {
  try {
    const { companyId, permissions: user } = await getAuthContext();
    if (!hasPermission(user, 'inventory', 'create')) {
      throw new Error('غير مصرح لك بإضافة مستودع');
    }

    // Check branch limit
    const companyInfo = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        subscriptionPlan: true,
        _count: {
          select: { warehouses: true }
        }
      }
    });

    if (companyInfo?.subscriptionPlan) {
      if (companyInfo._count.warehouses >= companyInfo.subscriptionPlan.maxBranches) {
        throw new Error(`عذراً، لقد وصلت للحد الأقصى المسموح به للفروع/المستودعات (${companyInfo.subscriptionPlan.maxBranches}) في باقتك الحالية.`);
      }
    }

    // Auto-generate code if empty
    let code = data.code;
    if (!code) {
      const count = await prisma.warehouse.count({ where: { companyId } });
      code = `WH-${(count + 1).toString().padStart(3, '0')}`;
    }

    const w = await prisma.warehouse.create({
      data: {
        companyId,
        code,
        name: data.name,
        nameAr: data.nameAr || null,
        location: data.location || null
      }
    });
    revalidatePath('/warehouses');
    revalidatePath('/inventory');
    revalidatePath('/sales');
    return { success: true, warehouse: w };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateWarehouse(id: string, data: any) {
  try {
    const { companyId, permissions: user } = await getAuthContext();
    if (!hasPermission(user, 'inventory', 'edit')) {
      throw new Error('غير مصرح لك بتعديل المستودع');
    }

    const w = await prisma.warehouse.update({
      where: { id, companyId },
      data: {
        name: data.name,
        nameAr: data.nameAr || null,
        location: data.location || null
      }
    });
    revalidatePath('/warehouses');
    return { success: true, warehouse: w };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteWarehouse(id: string) {
  try {
    const { companyId, permissions: user } = await getAuthContext();
    if (!hasPermission(user, 'inventory', 'delete')) {
      throw new Error('غير مصرح لك بحذف المستودع');
    }

    await prisma.warehouse.delete({ where: { id, companyId } });
    revalidatePath('/warehouses');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
