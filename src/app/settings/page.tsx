import { cookies } from 'next/headers';
import { getDictionary, Lang } from '@/lib/i18n';
import SettingsClient from './SettingsClient';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const cookieStore = await cookies();
  const lang = (cookieStore.get('NX_LANG')?.value as Lang) || 'ar';
  
  const dict = getDictionary(lang);

  let profile = null;
  if (session?.user?.companyId) {
    profile = await prisma.companyProfile.findFirst({
      where: { companyId: session.user.companyId }
    });
  }

  return (
    <SettingsClient 
      lang={lang} 
      dict={dict} 
      companyId={session?.user?.companyId || ''}
      zatcaStatus={profile?.zatcaComplianceStatus || 'Not Onboarded'}
    />
  );
}
