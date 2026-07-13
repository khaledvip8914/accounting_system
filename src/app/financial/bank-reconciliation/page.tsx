import { prisma } from '@/lib/db';
import BankReconciliationClient from './BankReconciliationClient';
import { Lang } from '@/lib/i18n';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { requireFeature } from '@/lib/subscription';

export default async function BankReconciliationPage(props: {
  params: Promise<any>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const session = await getSession();
  if (!session || !session.user || !session.user.companyId) {
    redirect('/login');
  }
  
  const companyId = session.user.companyId;
  await requireFeature(companyId, 'hasFinancialModule');

  const searchParams = await props.searchParams;
  const lang = (searchParams.lang as Lang) || 'ar';

  try {
    const reconciliations = await prisma.bankReconciliation.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' }
    });

    const bankAccounts = await prisma.bankAccount.findMany({
      where: { companyId },
      orderBy: { bankName: 'asc' }
    });

    return (
      <BankReconciliationClient 
        lang={lang} 
        initialReconciliations={reconciliations}
        bankAccounts={bankAccounts}
      />
    );
  } catch (err: any) {
    return (
      <div style={{ padding: '2rem', color: 'red' }}>
        <h1>Server Error (Bank Reconciliation)</h1>
        <pre>{err.message}</pre>
      </div>
    );
  }
}
