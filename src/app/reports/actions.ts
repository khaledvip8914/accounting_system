'use server';

import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

async function getCompanyId() {
  const session = await getSession();
  if (!session || !session.user || !session.user.companyId) {
    throw new Error('Unauthorized');
  }
  return session.user.companyId;
}

export async function getTrialBalance() {
  try {
    const companyId = await getCompanyId();
    const accounts = await prisma.account.findMany({
      where: { companyId },
      include: {
        entries: {
          select: { debit: true, credit: true }
        }
      }
    });

    return accounts.map(acc => {
      const totalDebit = acc.entries.reduce((sum, e) => sum + e.debit, 0);
      const totalCredit = acc.entries.reduce((sum, e) => sum + e.credit, 0);
      return {
        ...acc,
        totalDebit,
        totalCredit,
        balance: totalDebit - totalCredit
      };
    });
  } catch (error) {
    console.error('Failed to get Trial Balance:', error);
    return [];
  }
}

export async function getProfitLoss() {
  try {
    const companyId = await getCompanyId();
    const accounts = await prisma.account.findMany({
      where: {
        companyId,
        OR: [
          { code: { startsWith: '4' } }, // Revenue
          { code: { startsWith: '5' } }, // Expenses
        ]
      },
      include: {
        entries: {
          select: { debit: true, credit: true }
        }
      }
    });

    const revenue: any[] = [];
    const expenses: any[] = [];
    let totalRevenue = 0;
    let totalExpenses = 0;

    accounts.forEach(acc => {
      const totalDebit = acc.entries.reduce((sum, e) => sum + e.debit, 0);
      const totalCredit = acc.entries.reduce((sum, e) => sum + e.credit, 0);
      const balance = Math.abs(totalDebit - totalCredit);

      const item = { name: acc.name, nameAr: acc.nameAr, balance };
      if (acc.code.startsWith('4')) {
        revenue.push(item);
        totalRevenue += balance;
      } else {
        expenses.push(item);
        totalExpenses += balance;
      }
    });

    return {
      revenue,
      expenses,
      totalRevenue,
      totalExpenses,
      netIncome: totalRevenue - totalExpenses
    };
  } catch (error) {
    console.error('Failed to get Profit & Loss:', error);
    return { revenue: [], expenses: [], totalRevenue: 0, totalExpenses: 0, netIncome: 0 };
  }
}

export async function getBalanceSheet() {
  try {
    const companyId = await getCompanyId();
    const accounts = await prisma.account.findMany({
      where: {
        companyId,
        OR: [
          { code: { startsWith: '1' } }, // Assets
          { code: { startsWith: '2' } }, // Liabilities
          { code: { startsWith: '3' } }, // Equity
        ]
      },
      include: {
        entries: {
          select: { debit: true, credit: true }
        }
      }
    });

    const assets: any[] = [];
    const liabilities: any[] = [];
    const equity: any[] = [];
    let totalAssets = 0;
    let totalLiabilities = 0;
    let totalEquity = 0;

    accounts.forEach(acc => {
      const totalDebit = acc.entries.reduce((sum, e) => sum + e.debit, 0);
      const totalCredit = acc.entries.reduce((sum, e) => sum + e.credit, 0);
      const balance = totalDebit - totalCredit;

      const item = { name: acc.name, nameAr: acc.nameAr, balance: Math.abs(balance) };
      if (acc.code.startsWith('1')) {
        assets.push(item);
        totalAssets += balance;
      } else if (acc.code.startsWith('2')) {
        liabilities.push(item);
        totalLiabilities += Math.abs(balance);
      } else {
        equity.push(item);
        totalEquity += Math.abs(balance);
      }
    });

    // Handle Net Income in Equity
    const pl = await getProfitLoss();
    equity.push({ name: 'Net Income / (Loss)', nameAr: 'صافي الربح / (الخسارة)', balance: pl.netIncome });
    totalEquity += pl.netIncome;

    return {
      assets,
      liabilities,
      equity,
      totalAssets: Math.abs(totalAssets),
      totalLiabilities: Math.abs(totalLiabilities),
      totalEquity: Math.abs(totalEquity)
    };
  } catch (error) {
    console.error('Failed to get Balance Sheet:', error);
    return { assets: [], liabilities: [], equity: [], totalAssets: 0, totalLiabilities: 0, totalEquity: 0 };
  }
}

export async function getSalesReport(startDate: string, endDate: string) {
  try {
    const companyId = await getCompanyId();
    const invoices = await prisma.salesInvoice.findMany({
      where: {
        companyId,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      include: {
        customer: true
      },
      orderBy: { date: 'desc' }
    });

    return { success: true, data: invoices };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPurchaseReport(startDate: string, endDate: string) {
  try {
    const companyId = await getCompanyId();
    const invoices = await prisma.purchaseInvoice.findMany({
      where: {
        companyId,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      include: {
        supplier: true
      },
      orderBy: { date: 'desc' }
    });

    return { success: true, data: invoices };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getReturnsReport(startDate: string, endDate: string) {
  try {
    const companyId = await getCompanyId();
    const salesReturns = await prisma.salesInvoice.findMany({
      where: {
        companyId,
        status: 'Returned',
        date: { gte: new Date(startDate), lte: new Date(endDate) }
      },
      include: { customer: true }
    });

    const purchaseReturns = await prisma.purchaseInvoice.findMany({
      where: {
        companyId,
        status: 'Returned',
        date: { gte: new Date(startDate), lte: new Date(endDate) }
      },
      include: { supplier: true }
    });

    return { success: true, salesReturns, purchaseReturns };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

