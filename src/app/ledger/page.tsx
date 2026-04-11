import { getAccounts, getJournalVouchers } from './actions';
import LedgerClient from './LedgerClient';
import { cookies } from 'next/headers';
import { getDictionary } from '../../lib/i18n';

export const dynamic = 'force-dynamic';

export default async function LedgerPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('NX_LANG')?.value || 'en';
  const dictionary = getDictionary(lang);
  const dict = dictionary.ledger;
  const financialDict = dictionary.financial;

  const accounts = await getAccounts();
  const vouchers = await getJournalVouchers();

  return <LedgerClient accounts={accounts} vouchers={vouchers} dict={dict} financialDict={financialDict} lang={lang} />;
}
