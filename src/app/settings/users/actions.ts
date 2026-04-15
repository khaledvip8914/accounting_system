'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';

export async function getUsers() {
  try {
    return await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Failed to get users:', error);
    return [];
  }
}

export async function saveUser(data: any) {
  try {
    const session = await getSession();
    const userRole = session?.user?.role;
    const userPerms = session?.user?.permissions || session?.user?.roleRef?.permissions;
    
    // Admin bypass + granular check
    if (userRole !== 'Admin' && !hasPermission(userPerms, 'users', 'edit')) {
      throw new Error('غير مصرح لك بإدارة المستخدمين');
    }

    const { id, password, ...rest } = data;
    
    let hashedPassword = undefined;
    if (password && password.trim() !== '') {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    if (id) {
      // Update
      const updateData: any = { ...rest };
      if (hashedPassword) updateData.password = hashedPassword;
      
      const user = await prisma.user.update({
        where: { id },
        data: updateData
      });
      revalidatePath('/settings/users');
      return { success: true, user };
    } else {
      // Create
      if (!password) throw new Error('Password is required for new users');
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = await prisma.user.create({
        data: {
          ...rest,
          password: hashedPassword
        }
      });
      revalidatePath('/settings/users');
      return { success: true, user };
    }
  } catch (error: any) {
    console.error('Save user error:', error);
    if (error.code === 'P2002') {
      return { success: false, error: 'اسم المستخدم مسجل مسبقاً' };
    }
    return { success: false, error: error.message };
  }
}

export async function deleteUser(id: string) {
  try {
    const session = await getSession();
    const userRole = session?.user?.role;
    const userPerms = session?.user?.permissions || session?.user?.roleRef?.permissions;
    
    if (userRole !== 'Admin' && !hasPermission(userPerms, 'users', 'delete')) {
      throw new Error('غير مصرح لك بإدارة المستخدمين');
    }

    // Prevent self-deletion if we could detect current user, 
    // but for now just prevent deleting the last admin if needed.
    const user = await prisma.user.findUnique({ where: { id } });
    if (user?.username === 'admin') {
      throw new Error('Cannot delete main administrator');
    }

    await prisma.user.delete({ where: { id } });
    revalidatePath('/settings/users');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
