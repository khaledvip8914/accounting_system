import { cookies } from "next/headers";
import { getDictionary } from "../../lib/i18n";
import FinancialClient from "./FinancialClient";
import { getJournalVouchers } from "../ledger/actions";
import { getAccounts } from "../accounts/actions";
import { getTrialBalance, getProfitLoss, getBalanceSheet } from "../reports/actions";
import { prisma } from "../../lib/db";
import { getCompanyProfile } from "../settings/actions";

export default async function FinancialManagementPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('NX_LANG')?.value || 'en';
  
  // Fetch all necessary data for the sub-modules
  const [vouchers, accountsTree, trialBalance, profitLoss, balanceSheet, companyProfile] = await Promise.all([
    getJournalVouchers(),
    getAccounts(),
    getTrialBalance(),
    getProfitLoss(),
    getBalanceSheet(),
    getCompanyProfile()
  ]);

  const flatAccounts = await prisma.account.findMany({
    orderBy: { code: 'asc' }
  });

  const transactionVouchers = await prisma.transactionVoucher.findMany({
    include: { primaryAccount: true, relatedAccount: true },
    orderBy: { createdAt: 'desc' }
  });

  const reportsData = {
    trialBalance,
    profitLoss,
    balanceSheet
  };

  return (
    <FinancialClient 
      lang={lang}
      initialLedgerData={vouchers}
      initialAccountsData={accountsTree}
      initialReportsData={reportsData}
      accountsForLedger={trialBalance}
      initialTransactionVouchers={transactionVouchers}
      companyProfile={companyProfile}
    />
  );
}
