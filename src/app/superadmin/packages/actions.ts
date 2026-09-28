'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'

async function checkSuperAdmin() {
  const session = await getSession();
  if (!session || !session.user || session.user.companyId !== 'default') {
    throw new Error('Unauthorized: SuperAdmin access required');
  }
  return session.user;
}

export async function getPackages() {
  await checkSuperAdmin();
  return await prisma.subscriptionPlan.findMany({
    orderBy: { maxUsers: 'asc' }
  })
}

export async function createPackage(data: any) {
  try {
    await checkSuperAdmin();
    const pkg = await prisma.subscriptionPlan.create({
      data: {
        name: data.name,
        nameAr: data.nameAr || null,
        price: Number(data.price) || 0,
        maxBranches: Number(data.maxBranches) || 1,
        maxUsers: Number(data.maxUsers) || 1,
        hasZatcaPhase2: Boolean(data.hasZatcaPhase2),
        hasSalesAndPurchases: Boolean(data.hasSalesAndPurchases),
        hasBankReconciliation: Boolean(data.hasBankReconciliation),
        hasUserPermissions: Boolean(data.hasUserPermissions),
        hasFixedAssets: Boolean(data.hasFixedAssets),
        hasMultiCurrency: Boolean(data.hasMultiCurrency),
        hasAdvancedReports: Boolean(data.hasAdvancedReports),
        hasWhatsApp: Boolean(data.hasWhatsApp),
        hasHumanResources: Boolean(data.hasHumanResources),
        hasApiIntegration: Boolean(data.hasApiIntegration),
        hasAnalysisDimensions: Boolean(data.hasAnalysisDimensions),
      }
    })

    revalidatePath('/superadmin/packages')
    return { success: true, package: pkg }
  } catch (error: any) {
    console.error('Create package error:', error)
    return { success: false, error: error.message }
  }
}

export async function updatePackage(id: string, data: any) {
  try {
    await checkSuperAdmin();
    const pkg = await prisma.subscriptionPlan.update({
      where: { id },
      data: {
        name: data.name,
        nameAr: data.nameAr || null,
        price: Number(data.price) || 0,
        maxBranches: Number(data.maxBranches) || 1,
        maxUsers: Number(data.maxUsers) || 1,
        hasZatcaPhase2: Boolean(data.hasZatcaPhase2),
        hasSalesAndPurchases: Boolean(data.hasSalesAndPurchases),
        hasBankReconciliation: Boolean(data.hasBankReconciliation),
        hasUserPermissions: Boolean(data.hasUserPermissions),
        hasFixedAssets: Boolean(data.hasFixedAssets),
        hasMultiCurrency: Boolean(data.hasMultiCurrency),
        hasAdvancedReports: Boolean(data.hasAdvancedReports),
        hasWhatsApp: Boolean(data.hasWhatsApp),
        hasHumanResources: Boolean(data.hasHumanResources),
        hasApiIntegration: Boolean(data.hasApiIntegration),
        hasAnalysisDimensions: Boolean(data.hasAnalysisDimensions),
      }
    })

    revalidatePath('/superadmin/packages')
    revalidatePath('/superadmin/companies')
    return { success: true, package: pkg }
  } catch (error: any) {
    console.error('Update package error:', error)
    return { success: false, error: error.message }
  }
}

export async function deletePackage(id: string) {
  try {
    await checkSuperAdmin();
    
    // Check if any company is using this package
    const companiesCount = await prisma.company.count({
      where: { subscriptionPlanId: id }
    });
    
    if (companiesCount > 0) {
      return { success: false, error: 'لا يمكن حذف الباقة لارتباطها بشركات حالية. يرجى نقل الشركات إلى باقات أخرى أولاً.' };
    }

    await prisma.subscriptionPlan.delete({
      where: { id }
    })

    revalidatePath('/superadmin/packages')
    return { success: true }
  } catch (error: any) {
    console.error('Delete package error:', error)
    return { success: false, error: error.message }
  }
}
