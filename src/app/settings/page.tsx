import { cookies } from 'next/headers';
import { getDictionary, Lang } from '@/lib/i18n';
import SettingsClient from './SettingsClient';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';

export default async function SettingsPage() {
  const session = await getSession();
  if (!session || !session.user || !session.user.companyId) {
    redirect('/login');
  }

  const { hasPermission } = await import('@/lib/permissions');
  const user = session.user;
  const canAccessSettings = hasPermission(user, 'settings', 'view') || 
                            hasPermission(user, 'settings_general', 'view') || 
                            hasPermission(user, 'settings_payroll', 'view') || 
                            hasPermission(user, 'settings_users', 'view') || 
                            hasPermission(user, 'settings_financial', 'view');
  
  if (!canAccessSettings) {
    redirect('/unauthorized');
  }

  const cookieStore = await cookies();
  const lang = (cookieStore.get('NX_LANG')?.value as Lang) || 'ar';
  
  const dict = getDictionary(lang);

  let profile = null;
  let hasZatcaPhase2 = false;
  
  if (session?.user?.companyId) {
    profile = await prisma.companyProfile.findFirst({
      where: { companyId: session.user.companyId }
    });

    const company = await prisma.company.findUnique({
      where: { id: session.user.companyId },
      include: { subscriptionPlan: true }
    });

    if (company?.subscriptionPlan?.hasZatcaPhase2 || session.user.role === 'SuperAdmin') {
      hasZatcaPhase2 = true;
    }
  }

  return (
    <SettingsClient 
      lang={lang} 
      dict={dict} 
      companyId={session?.user?.companyId || ''}
      zatcaStatus={profile?.zatcaComplianceStatus || 'Not Onboarded'}
      hasZatcaPhase2={hasZatcaPhase2}
    />
  );
}
