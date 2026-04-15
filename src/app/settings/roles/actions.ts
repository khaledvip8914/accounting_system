'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getRoles() {
  return await prisma.role.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { users: true } } }
  });
}

export async function createRole(name: string, permissions: string) {
  try {
    const role = await prisma.role.create({
      data: { name, permissions }
    });
    revalidatePath('/settings/roles');
    return { success: true, role };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateRole(id: string, name: string, permissions: string) {
  try {
    const role = await prisma.role.update({
      where: { id },
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
    // Check if role has users
    const userCount = await prisma.user.count({ where: { roleId: id } });
    if (userCount > 0) {
      return { success: false, error: 'Cannot delete role that has assigned users' };
    }
    
    await prisma.role.delete({ where: { id } });
    revalidatePath('/settings/roles');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
