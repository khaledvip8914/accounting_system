import { prisma } from '@/lib/db';
import BankAccountsClient from './BankAccountsClient';
import { Lang } from '@/lib/i18n';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { requireFeature } from '@/lib/subscription';

export default async function BankAccountsPage(props: {
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
    const bankAccounts = await prisma.bankAccount.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' }
    });

    const ledgerAccounts = await prisma.account.findMany({
      where: { companyId },
      orderBy: { code: 'asc' }
    });

    const currencies = await prisma.currency.findMany({
      where: { companyId },
      orderBy: { code: 'asc' }
    });

    return (
      <BankAccountsClient 
        lang={lang} 
        initialBankAccounts={bankAccounts}
        ledgerAccounts={ledgerAccounts}
        currencies={currencies}
      />
    );
  } catch (err: any) {
    return (
      <div style={{ padding: '2rem', color: 'red' }}>
        <h1>Server Error (Bank Accounts)</h1>
        <pre>{err.message}</pre>
      </div>
    );
  }
}
