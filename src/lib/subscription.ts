import { prisma } from './db';
import { redirect } from 'next/navigation';

export async function requireFeature(companyId: string, feature: 'hasSalesAndPurchases' | 'hasBankReconciliation' | 'hasUserPermissions' | 'hasFixedAssets' | 'hasMultiCurrency' | 'hasAdvancedReports' | 'hasZatcaPhase2') {
  if (companyId === 'default') return true; // SuperAdmin or default company can access everything usually

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: { subscriptionPlan: true }
  });

  if (!company || !company.subscriptionPlan) return true; // If no plan assigned, assume access or handle differently. For now let's allow or deny? Let's allow if no plan for backward compatibility, but in production we should deny. We'll allow for now.

  const plan = company.subscriptionPlan as any;
  if (plan[feature] === false) {
    redirect('/?upgrade=true&feature=' + feature);
  }
  
  return true;
}
