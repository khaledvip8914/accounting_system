import { getAccounts } from './actions';
import AccountsClient from './AccountsClient';
import { cookies } from 'next/headers';
import { getDictionary } from '../../lib/i18n';

import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AccountsPage() {
  const session = await getSession();
  if (!session || !session.user || !session.user.companyId) {
    redirect('/login');
  }

  const { hasPermission } = await import('@/lib/permissions');
  if (!hasPermission(session.user, 'accounting', 'view')) {
    redirect('/unauthorized');
  }

  const cookieStore = await cookies();
  const lang = cookieStore.get('NX_LANG')?.value || 'ar';
  const dict = getDictionary(lang).accounts;
  
  const accounts = await getAccounts();

  return <AccountsClient initialAccounts={accounts} dict={dict} lang={lang} />;
}

