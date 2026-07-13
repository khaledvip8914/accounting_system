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
    permissions: session.user
  };
}

export async function getCategories() {
  try {
    const { companyId } = await getAuthContext();
    return await prisma.category.findMany({
      where: { companyId },
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.error('getCategories error:', error);
    return [];
  }
}

export async function saveCategory(data: { id?: string, name: string, nameAr?: string }) {
  try {
    const { companyId, permissions } = await getAuthContext();
    const { getActiveBranch } = await import('@/lib/branch');
    const branchId = await getActiveBranch();
    
    if (!hasPermission(permissions, 'inventory', 'edit')) {
      throw new Error('غير مصرح لك بإدارة الأقسام');
    }

    if (data.id) {
      const cat = await prisma.category.update({
        where: { id: data.id, companyId },
        data: { name: data.name, nameAr: data.nameAr }
      });
      revalidatePath('/inventory');
      return { success: true, category: cat };
    } else {
      const cat = await prisma.category.create({
        data: { 
            companyId,
            branchId: branchId || null,
            name: data.name, 
            nameAr: data.nameAr 
        }
      });
      revalidatePath('/inventory');
      return { success: true, category: cat };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCategory(id: string) {
  try {
    const { companyId, permissions } = await getAuthContext();
    
    if (!hasPermission(permissions, 'inventory', 'delete')) {
      throw new Error('غير مصرح لك بحذف الأقسام');
    }

    // Check if linked to products (Scoped to company)
    const linked = await prisma.product.count({ 
        where: { categoryId: id, companyId } 
    });
    if (linked > 0) {
      throw new Error('لا يمكن حذف قسم مرتبط بمنتجات');
    }

    await prisma.category.delete({ where: { id, companyId } });
    revalidatePath('/inventory');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
