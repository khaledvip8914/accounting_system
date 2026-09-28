import { cookies } from "next/headers";
import { getDictionary } from "../../lib/i18n";
import FinancialClient from "./FinancialClient";
import { getJournalVouchers } from "../ledger/actions";
import { getAccounts } from "../accounts/actions";
import { getTrialBalance, getProfitLoss, getBalanceSheet } from "../reports/actions";
import { prisma } from "../../lib/db";
import { getCompanyProfile } from "../settings/actions";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getActiveBranch } from "@/lib/branch";

export default async function FinancialManagementPage() {
  const session = await getSession();
  if (!session || !session.user || !session.user.companyId) {
    redirect('/login');
  }
  const companyId = session.user.companyId;

  const cookieStore = await cookies();
  const lang = cookieStore.get('NX_LANG')?.value || 'ar';
  
  // Fetch all necessary data for the sub-modules
  const [vouchers, accountsTree, trialBalance, profitLoss, balanceSheet, companyProfile] = await Promise.all([
    getJournalVouchers(),
    getAccounts(),
    getTrialBalance(),
    getProfitLoss(),
    getBalanceSheet(),
    getCompanyProfile()
  ]);

  const branchId = await getActiveBranch();
  const whereClause: any = { companyId };
  if (branchId) {
    whereClause.branchId = branchId;
  }

  const [transactionVouchers, customers, suppliers, products, warehouses] = await Promise.all([
    prisma.transactionVoucher.findMany({
      where: whereClause,
      include: { primaryAccount: true, relatedAccount: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.customer.findMany({ where: { companyId }, orderBy: { name: 'asc' } }),
    prisma.supplier.findMany({ where: { companyId }, orderBy: { name: 'asc' } }),
    prisma.product.findMany({ where: { companyId }, orderBy: { name: 'asc' } }),
    prisma.warehouse.findMany({ where: whereClause, orderBy: { name: 'asc' } })
  ]);

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
      customers={customers}
      suppliers={suppliers}
      products={products}
      warehouses={warehouses}
    />
  );
}

