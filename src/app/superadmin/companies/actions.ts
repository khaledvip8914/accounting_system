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
      },
      subscriptionPlan: true
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
        subscriptionPlanId: data.subscriptionPlanId || null,
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
        email: data.email || data.companyEmail || null,
        subscriptionStatus: data.subscriptionStatus,
        subscriptionEndsAt: data.subscriptionEndsAt ? new Date(data.subscriptionEndsAt) : null,
        subscriptionPlanId: data.subscriptionPlanId || null,
      }
    })

    // Update admin user if email or password or username provided
    if (data.email || data.password || data.username) {
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
      } else if (data.email && data.password) {
        // Create the admin user if it doesn't exist
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
            companyId: id
          }
        });
      }
    }

    if (data.sendEmail) {
      try {
        const passToSend = data.password || '*** (المحفوظة مسبقاً) ***';
        const emailToSend = data.email || data.companyEmail;
        const usernameToSend = data.username || (data.email ? data.email.split('@')[0] : 'admin');
        const trialDays = data.subscriptionEndsAt 
          ? Math.ceil((new Date(data.subscriptionEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          : 30;

        await sendWelcomeEmail(
          emailToSend, 
          data.name, 
          id, 
          usernameToSend, 
          passToSend, 
          trialDays > 0 ? trialDays : 0
        );
      } catch (e) {
        console.error("Failed to send welcome email on update", e);
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

export async function deleteCompany(id: string) {
  try {
    await checkSuperAdmin();
    if (id === 'default') {
      return { success: false, error: 'لا يمكن حذف الشركة الافتراضية للنظام' };
    }
    
    await prisma.$transaction(async (tx) => {
      // 1. Delete deeply nested transactions and logs
      await tx.bankReconciliation.deleteMany({ where: { companyId: id } });
      await tx.transactionVoucher.deleteMany({ where: { companyId: id } });
      
      await tx.salesInvoice.deleteMany({ where: { companyId: id } });
      await tx.purchaseInvoice.deleteMany({ where: { companyId: id } });
      await tx.salesQuotation.deleteMany({ where: { companyId: id } });
      await tx.stockTransfer.deleteMany({ where: { companyId: id } });
      await tx.productionOrder.deleteMany({ where: { companyId: id } });
      await tx.purchaseOrder.deleteMany({ where: { companyId: id } });
      await tx.disposalVoucher.deleteMany({ where: { companyId: id } });
      
      await tx.salaryPayment.deleteMany({ where: { companyId: id } });
      await tx.employeeFinancialMove.deleteMany({ where: { companyId: id } });
      
      // JournalVouchers can now be deleted safely
      await tx.journalVoucher.deleteMany({ where: { companyId: id } });
      
      // 2. Delete inventory and asset dependencies
      await tx.inventoryLog.deleteMany({ where: { companyId: id } });
      await tx.warehouseStock.deleteMany({ where: { companyId: id } });
      
      // 3. Delete employee dependencies
      await tx.employeeLoan.deleteMany({ where: { companyId: id } });
      // EmployeeLeave doesn't have companyId natively but has employeeId. Let's delete via Employee if needed, 
      // but schema says companyId is there: companyId String @default("default")
      await tx.employeeLeave.deleteMany({ where: { companyId: id } });
      await tx.employeeContract.deleteMany({ where: { companyId: id } });
      
      await tx.fixedAsset.deleteMany({ where: { companyId: id } });
      
      // 4. Delete master records (Products, Customers, etc.)
      await tx.product.deleteMany({ where: { companyId: id } });
      await tx.customer.deleteMany({ where: { companyId: id } });
      await tx.supplier.deleteMany({ where: { companyId: id } });
      await tx.warehouse.deleteMany({ where: { companyId: id } });
      await tx.employee.deleteMany({ where: { companyId: id } });
      
      await tx.bankAccount.deleteMany({ where: { companyId: id } });
      
      // Raw SQL for self-referencing tables to avoid dependency ordering issues
      await tx.$executeRawUnsafe(`DELETE FROM "Account" WHERE "companyId" = $1`, id);
      await tx.$executeRawUnsafe(`DELETE FROM "UnitOfMeasure" WHERE "companyId" = $1`, id);
      
      await tx.costCenter.deleteMany({ where: { companyId: id } });
      await tx.category.deleteMany({ where: { companyId: id } });
      
      // 5. Delete settings and configuration
      await tx.currency.deleteMany({ where: { companyId: id } });
      await tx.taxRate.deleteMany({ where: { companyId: id } });
      await tx.financialYear.deleteMany({ where: { companyId: id } });
      await tx.paymentTerm.deleteMany({ where: { companyId: id } });
      await tx.productCharacteristic.deleteMany({ where: { companyId: id } });
      
      await tx.payrollSettings.deleteMany({ where: { companyId: id } });
      await tx.payrollAllowanceType.deleteMany({ where: { companyId: id } });
      await tx.payrollDeductionType.deleteMany({ where: { companyId: id } });
      
      await tx.user.deleteMany({ where: { companyId: id } });
      await tx.role.deleteMany({ where: { companyId: id } });
      await tx.companyProfile.deleteMany({ where: { companyId: id } });
      
      // Finally, delete branch and company
      await tx.branch.deleteMany({ where: { companyId: id } });
      await tx.company.delete({ where: { id } });
    }, {
      timeout: 30000 // Allow up to 30s for this massive delete
    });
    
    revalidatePath('/superadmin/companies');
    return { success: true };
  } catch (error: any) {
    console.error('Delete company error:', error);
    return { success: false, error: 'فشل الحذف الجذري: ' + error.message };
  }
}

