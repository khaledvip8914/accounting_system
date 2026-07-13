'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'
import { sendWelcomeEmail } from '@/lib/mail'
import { getSession } from '@/lib/auth'

async function checkSuperAdmin() {
  const session = await getSession();
  if (!session || !session.user || session.user.companyId !== 'default') {
    throw new Error('Unauthorized: SuperAdmin access required');
  }
  return session.user;
}

export async function getCompanies() {
  await checkSuperAdmin();
  return await prisma.company.findMany({
    where: {
        NOT: { id: 'default' } // Hide system company from list if needed, or show all
    },
    include: {
      users: {
        orderBy: { createdAt: 'asc' },
        take: 1
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function createCompany(data: any) {
  try {
    await checkSuperAdmin();
    const companyId = data.customId ? data.customId.trim() : ('T-' + Math.random().toString(36).substring(2, 7).toUpperCase())
    
    if (data.customId) {
      const existing = await prisma.company.findUnique({ where: { id: companyId } });
      if (existing) {
        return { success: false, error: 'معرف النظام (كود الشركة) مستخدم بالفعل، يرجى اختيار كود آخر.' }
      }
    }
    
    const subscriptionEndsAt = data.subscriptionEndsAt 
      ? new Date(data.subscriptionEndsAt) 
      : data.subscriptionDays 
        ? new Date(Date.now() + data.subscriptionDays * 24 * 60 * 60 * 1000)
        : null;

    const company = await prisma.company.create({
      data: {
        id: companyId,
        name: data.name,
        phone: data.phone || null,
        email: data.companyEmail || data.email || null,
        subscriptionStatus: data.subscriptionStatus || 'Active',
        subscriptionEndsAt: subscriptionEndsAt,
      }
    })

    if (data.email && data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      let baseUsername = data.email.split('@')[0];
      
      let finalUsername = data.username || baseUsername;
      
      let userExists = await prisma.user.findUnique({ where: { username: finalUsername } });
      let counter = 1;
      while(userExists) {
          finalUsername = `${data.username || baseUsername}${counter}`;
          userExists = await prisma.user.findUnique({ where: { username: finalUsername } });
          counter++;
      }

      await prisma.user.create({
        data: {
          username: finalUsername,
          email: data.email,
          password: hashedPassword,
          name: 'مدير النظام',
          role: 'Admin',
          companyId: company.id
        }
      });

      if (data.sendEmail) {
        try {
           await sendWelcomeEmail(data.email, data.name, company.id, finalUsername, data.password, data.subscriptionDays || 30);
        } catch (e) {
           console.error("Failed to send welcome email", e);
        }
      }
    }

    revalidatePath('/superadmin/companies')
    return { success: true, company }
  } catch (error: any) {
    console.error('Create company error:', error)
    return { success: false, error: error.message }
  }
}

export async function updateCompany(id: string, data: any) {
  try {
    await checkSuperAdmin();
    const company = await prisma.company.update({
      where: { id },
      data: {
        name: data.name,
        phone: data.phone || null,
        email: data.companyEmail || null,
        subscriptionStatus: data.subscriptionStatus,
        subscriptionEndsAt: data.subscriptionEndsAt ? new Date(data.subscriptionEndsAt) : null,
      }
    })

    // Update admin user if email or password provided
    if (data.email || data.password) {
      const adminUser = await prisma.user.findFirst({
        where: { companyId: id, role: 'Admin' }
      })

      if (adminUser) {
        const updateData: any = {}
        if (data.email) updateData.email = data.email
        if (data.username) updateData.username = data.username
        if (data.password) updateData.password = await bcrypt.hash(data.password, 10)

        await prisma.user.update({
          where: { id: adminUser.id },
          data: updateData
        })
      }
    }

    revalidatePath('/superadmin/companies')
    return { success: true, company }
  } catch (error: any) {
    console.error('Update company error:', error)
    return { success: false, error: error.message }
  }
}

export async function resendWelcomeEmail(companyId: string) {
  try {
    await checkSuperAdmin();
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        users: {
          orderBy: { createdAt: 'asc' },
          take: 1
        }
      }
    });

    if (!company) {
      return { success: false, error: 'الشركة غير موجودة' };
    }

    const email = company.email || company.users?.[0]?.email;
    const username = company.users?.[0]?.username;
    
    if (!email || !username) {
      return { success: false, error: 'لا يوجد بريد إلكتروني أو مستخدم مرتبط بهذه الشركة' };
    }

    const trialDays = company.subscriptionEndsAt 
      ? Math.ceil((new Date(company.subscriptionEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : 30;

    // We don't have the plain password, so we send a placeholder
    const passPlaceholder = '*** (المحفوظة مسبقاً) ***';

    await sendWelcomeEmail(email, company.name, company.id, username, passPlaceholder, trialDays > 0 ? trialDays : 0);

    return { success: true };
  } catch (error: any) {
    console.error('Resend email error:', error);
    return { success: false, error: error.message };
  }
}

