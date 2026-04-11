import { getTrialBalance, getProfitLoss, getBalanceSheet } from './actions';
import ReportsClient from './ReportsClient';
import { cookies } from 'next/headers';
import { getDictionary } from '../../lib/i18n';

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('NX_LANG')?.value || 'en';
  const dict = getDictionary(lang).reports;

  const [balances, profitLoss, balanceSheet] = await Promise.all([
    getTrialBalance(),
    getProfitLoss(),
    getBalanceSheet()
  ]);

  return (
    <ReportsClient 
      balances={balances} 
      profitLoss={profitLoss} 
      balanceSheet={balanceSheet} 
      dict={dict} 
      lang={lang} 
    />
  );
}
