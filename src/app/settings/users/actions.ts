'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { sendVerificationEmail } from '@/lib/mail';

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

export async function getUsers() {
  try {
    const { companyId } = await getAuthContext();
    return await prisma.user.findMany({
      where: { companyId },
      include: { roleRef: true },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Failed to get users:', error);
    return [];
  }
}

export async function saveUser(data: any) {
  try {
    const { companyId, permissions } = await getAuthContext();
    
    if (!hasPermission(permissions, 'users', 'edit')) {
      throw new Error('غير مصرح لك بإدارة المستخدمين');
    }

    const { id, password, ...rest } = data;

    let hashedPassword = undefined;
    if (password && password.trim() !== '') {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    if (id) {
      // Update: ensure user belongs to same company
      const existingUser = await prisma.user.findFirst({
        where: { id, companyId }
      });
      if (!existingUser) throw new Error('User not found or unauthorized');

      const updateData: any = { ...rest, companyId }; // Force current companyId
      if (hashedPassword) updateData.password = hashedPassword;
      
      const user = await prisma.user.update({
        where: { id, companyId },
        data: updateData
      });
      revalidatePath('/settings/users');
      return { success: true, user };
    } else {
      // Create
      if (!password) throw new Error('Password is required for new users');
      if (!rest.email) throw new Error('Email is required for verification');
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      const user = await prisma.user.create({
        data: {
          ...rest,
          companyId, // Force current companyId
          password: hashedPassword,
          verificationToken
        }
      });

      // Send verification email
      let emailSent = false;
      const smtpUser = process.env.EMAIL_SERVER_USER;
      const smtpPass = process.env.EMAIL_SERVER_PASSWORD;

      if (user.email && smtpUser && smtpPass) {
        try {
          const mailResult = await Promise.race([
            sendVerificationEmail(user.email, verificationToken, user.name || user.username),
            new Promise<{success: boolean, error: string}>((_, reject) => 
              setTimeout(() => reject(new Error('Email timeout')), 8000)
            )
          ]);
          emailSent = mailResult.success;
        } catch (mailError) {
          console.error('Non-blocking email error:', mailError);
          emailSent = false;
        }
      }

      revalidatePath('/settings/users');
      return { 
        success: true, 
        user, 
        message: emailSent 
          ? 'تم إنشاء المستخدم وإرسال بريد التحقق بنجاح' 
          : (smtpUser ? 'تم إنشاء المستخدم ولكن فشل إرسال بريد التحقق.' : 'تم إنشاء المستخدم بنجاح (بريد التحقق معطل حالياً).')
      };
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
    const { companyId, permissions } = await getAuthContext();

    if (!hasPermission(permissions, 'users', 'delete')) {
      throw new Error('Unauthorized');
    }

    // Prevent self-deletion and check companyId
    const user = await prisma.user.findFirst({ 
      where: { id, companyId } 
    });
    
    if (!user) throw new Error('User not found in your company');
    if (user.username === 'admin') {
      throw new Error('Cannot delete main administrator');
    }

    await prisma.user.delete({ where: { id, companyId } });
    revalidatePath('/settings/users');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
