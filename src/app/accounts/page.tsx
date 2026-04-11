import { getAccounts } from './actions';
import AccountsClient from './AccountsClient';
import { cookies } from 'next/headers';
import { getDictionary } from '../../lib/i18n';

export const dynamic = 'force-dynamic';

export default async function AccountsPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('NX_LANG')?.value || 'en';
  const dict = getDictionary(lang).accounts;
  
  const accounts = await getAccounts();

  return <AccountsClient initialAccounts={accounts} dict={dict} lang={lang} />;
}
