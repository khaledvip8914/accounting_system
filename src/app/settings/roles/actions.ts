'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';

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

export async function getRoles() {
  try {
    const { companyId } = await getAuthContext();
    return await prisma.role.findMany({
      where: { companyId },
      orderBy: { name: 'asc' },
      include: { _count: { select: { users: true } } }
    });
  } catch (err) {
    console.error('getRoles error:', err);
    return [];
  }
}

export async function createRole(name: string, permissions: string) {
  try {
    const { companyId } = await getAuthContext();
    const role = await prisma.role.create({
      data: { 
        companyId,
        name, 
        permissions 
      }
    });
    revalidatePath('/settings/roles');
    return { success: true, role };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateRole(id: string, name: string, permissions: string) {
  try {
    const { companyId } = await getAuthContext();
    const role = await prisma.role.update({
      where: { id, companyId },
      data: { name, permissions }
    });
    revalidatePath('/settings/roles');
    return { success: true, role };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteRole(id: string) {
  try {
    const { companyId } = await getAuthContext();
    
    // Check if role has users (scoped to company)
    const userCount = await prisma.user.count({ 
        where: { roleId: id, companyId } 
    });
    if (userCount > 0) {
      return { success: false, error: 'Cannot delete role that has assigned users' };
    }
    
    await prisma.role.delete({ where: { id, companyId } });
    revalidatePath('/settings/roles');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
