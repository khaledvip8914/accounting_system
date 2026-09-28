import { prisma } from '../lib/db';
import { cookies } from 'next/headers';
import { getDictionary } from '../lib/i18n';
import { getSession } from '../lib/auth';
import { redirect } from 'next/navigation';
import { getActiveBranch } from '../lib/branch';
import DashboardClient from '../components/DashboardClient';
import { getPerformanceComparison } from './reports/actions';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: { welcome?: string } }) {
  const session = await getSession();
  if (!session || !session.user || !session.user.companyId) {
    redirect('/login');
  }

  const companyId = session.user.companyId;
  const cookieStore = await cookies();
  const lang = cookieStore.get('NX_LANG')?.value || 'ar';
  const dict = getDictionary(lang).dashboard;

  const branchId = await getActiveBranch();
  const whereClause: any = { companyId };
  if (branchId) {
    whereClause.branchId = branchId;
  }

  const invoices = await prisma.salesInvoice.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  const accountsWhere: any = { companyId };
  const entriesWhere: any = branchId ? { journalVoucher: { branchId } } : {};

  const accounts = await prisma.account.findMany({
    where: accountsWhere,
    include: {
      entries: {
        where: entriesWhere
      }
    }
  });

  let totalRevenue = 0;
  let totalExpenses = 0;
  let cashBalance = 0;
  let receivables = 0;
  let payables = 0;
  const expensesList: { name: string, nameAr: string, amount: number }[] = [];

  // For 6-month historical chart
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthNamesEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthNamesAr = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  
  const monthlyData: { [key: string]: { revenue: number, expense: number } } = {};
  
  // Initialize current fiscal year (Jan to Dec)
  for (let m = 0; m < 12; m++) {
    const key = `${currentYear}-${m}`;
    monthlyData[key] = { revenue: 0, expense: 0 };
  }

  accounts.forEach((acc: any) => {
    const isCash = acc.code?.startsWith('111') || acc.code?.startsWith('112') || acc.name?.toLowerCase().includes('cash') || acc.name?.toLowerCase().includes('bank');
    const isReceivable = acc.code?.startsWith('113');
    const isPayable = acc.code?.startsWith('200') || acc.code?.startsWith('210');

    let accTotalDebit = 0;
    let accTotalCredit = 0;

    acc.entries.forEach((e: any) => {
      accTotalDebit += e.debit;
      accTotalCredit += e.credit;

      const d = new Date(e.date);
      const mKey = `${d.getFullYear()}-${d.getMonth()}`;
      if (monthlyData[mKey]) {
        if (acc.type === 'Revenue') {
          monthlyData[mKey].revenue += (e.credit - e.debit);
        } else if (acc.type === 'Expense') {
          monthlyData[mKey].expense += (e.debit - e.credit);
        }
      }
    });

    if (acc.type === 'Revenue') {
      totalRevenue += (accTotalCredit - accTotalDebit);
    } else if (acc.type === 'Expense') {
      const accAmount = (accTotalDebit - accTotalCredit);
      totalExpenses += accAmount;
      if (accAmount > 0) {
        expensesList.push({ name: acc.name, nameAr: acc.nameAr || acc.name, amount: accAmount });
      }
    }

    if (isCash) cashBalance += (accTotalDebit - accTotalCredit);
    if (isReceivable) receivables += (accTotalDebit - accTotalCredit);
    if (isPayable) payables += (accTotalCredit - accTotalDebit);
  });

  const chartData = Object.keys(monthlyData).map(key => {
    const [y, m] = key.split('-');
    const mIndex = parseInt(m);
    return {
      name: lang === 'ar' ? monthNamesAr[mIndex] : monthNamesEn[mIndex],
      revenue: Math.max(0, monthlyData[key].revenue),
      expense: Math.max(0, monthlyData[key].expense)
    };
  });

  const pendingAmount = invoices
    .filter((inv: any) => inv.status === 'Pending' || inv.status === 'معلق')
    .reduce((sum: number, inv: any) => sum + inv.netAmount, 0);

  const pendingCount = invoices.filter((inv: any) => inv.status === 'Pending' || inv.status === 'معلق').length;

  const netProfit = totalRevenue - totalExpenses;

  const topExpenses = expensesList.sort((a, b) => b.amount - a.amount).slice(0, 5);

  const recentJV = await prisma.journalVoucher.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { entries: { include: { account: true } } }
  });

  const recentSalesInvoices = await prisma.salesInvoice.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { customer: true }
  });

  const recentPurchaseInvoices = await prisma.purchaseInvoice.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { supplier: true }
  });

  const [monthlyPerfRes, yearlyPerfRes] = await Promise.all([
    getPerformanceComparison('month'),
    getPerformanceComparison('year')
  ]);

  const monthlyPerformance = monthlyPerfRes.success ? monthlyPerfRes.data : null;
  const yearlyPerformance = yearlyPerfRes.success ? yearlyPerfRes.data : null;

  return (
    <DashboardClient 
      dict={dict}
      lang={lang}
      stats={{ totalRevenue, totalExpenses, netProfit, cashBalance, receivables, payables }}
      recentTransactions={recentJV}
      recentSalesInvoices={recentSalesInvoices}
      recentPurchaseInvoices={recentPurchaseInvoices}
      topExpenses={topExpenses}
      pendingInvoicesCount={pendingCount}
      pendingInvoicesAmount={pendingAmount}
      chartData={chartData}
      monthlyPerformance={monthlyPerformance}
      yearlyPerformance={yearlyPerformance}
    />
  );
}

