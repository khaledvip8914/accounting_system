import { getTrialBalance, getProfitLoss, getBalanceSheet } from './actions';
import ReportsClient from './ReportsClient';
import { cookies } from 'next/headers';
import { getDictionary } from '../../lib/i18n';
import { getSession } from '@/lib/auth';
import { requireFeature } from '@/lib/subscription';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ReportsPage(props: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const searchParams = await props.searchParams;
  const tab = searchParams?.tab || 'trial';

  const cookieStore = await cookies();
  const lang = cookieStore.get('NX_LANG')?.value || 'ar';
  const dict = getDictionary(lang).reports;

  const session = await getSession();
  if (!session || !session.user || !session.user.companyId) {
    redirect('/login');
  }

  const { hasPermission } = await import('@/lib/permissions');
  if (!hasPermission(session.user, 'reports', 'view')) {
    redirect('/unauthorized');
  }
  await requireFeature(session.user.companyId, 'hasAdvancedReports');

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
      defaultTab={tab}
    />
  );
}

