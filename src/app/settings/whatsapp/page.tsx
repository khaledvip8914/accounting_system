import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { hasPermission } from '@/lib/permissions';
import WhatsAppSettingsClient from './WhatsAppSettingsClient';
import { Lang } from '@/lib/i18n';

export default async function WhatsAppSettingsPage(props: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const session = await getSession();
  if (!session || !session.user || !session.user.companyId) {
    redirect('/login');
  }

  if (!hasPermission(session.user, 'settings', 'view')) {
    redirect('/unauthorized');
  }

  const searchParams = await props.searchParams;
  const lang = (searchParams.lang as Lang) || 'ar';

  return (
    <WhatsAppSettingsClient 
      lang={lang}
    />
  );
}
