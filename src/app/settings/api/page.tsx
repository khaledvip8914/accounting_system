import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { getDictionary } from '@/lib/i18n';
import ApiClient from './ApiClient';

export const metadata = {
  title: 'API Integration - QoyodX',
};

export default async function ApiSettingsPage() {
  const session = await getSession();
  if (!session || !session.user) {
    redirect('/login');
  }

  const { lang = 'ar', companyId } = session.user;
  const dict = await getDictionary(lang as any);

  const profile = await prisma.companyProfile.findFirst({
    where: { companyId }
  });

  if (!profile) {
    redirect('/settings');
  }

  return (
    <div className="page-container" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <ApiClient 
        lang={lang} 
        dict={dict} 
        initialToken={profile.apiToken}
      />
    </div>
  );
}
