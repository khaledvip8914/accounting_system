'use server';

import { prisma } from '../../lib/db';

export async function getTrialBalance() {
  // Fetch all accounts and their entries
  const accounts = await prisma.account.findMany({
    include: {
      entries: true
    }
  });

  return accounts.map(account => {
    const totalDebit = account.entries.reduce((sum, entry) => sum + entry.debit, 0);
    const totalCredit = account.entries.reduce((sum, entry) => sum + entry.credit, 0);
    
    // Normal balances:
    // Asset/Expense: Debit - Credit
    // Liability/Equity/Revenue: Credit - Debit
    let balance = 0;
    if (['Asset', 'Expense'].includes(account.type)) {
      balance = totalDebit - totalCredit;
    } else {
      balance = totalCredit - totalDebit;
    }

    return {
      id: account.id,
      code: account.code,
      name: account.name,
      nameAr: account.nameAr,
      type: account.type,
      totalDebit,
      totalCredit,
      balance
    };
  });
}

export async function getProfitLoss() {
  const accounts = await prisma.account.findMany({
    where: {
      type: { in: ['Revenue', 'Expense'] }
    },
    include: { entries: true }
  });

  const report = {
    revenue: [] as any[],
    expenses: [] as any[],
    totalRevenue: 0,
    totalExpenses: 0,
    netIncome: 0
  };

  accounts.forEach(acc => {
    const totalDebit = acc.entries.reduce((sum, e) => sum + e.debit, 0);
    const totalCredit = acc.entries.reduce((sum, e) => sum + e.credit, 0);
    const balance = acc.type === 'Revenue' ? totalCredit - totalDebit : totalDebit - totalCredit;

    const item = { name: acc.name, nameAr: acc.nameAr, balance };
    
    if (acc.type === 'Revenue') {
      report.revenue.push(item);
      report.totalRevenue += balance;
    } else {
      report.expenses.push(item);
      report.totalExpenses += balance;
    }
  });

  report.netIncome = report.totalRevenue - report.totalExpenses;
  return report;
}

export async function getBalanceSheet() {
  const accounts = await prisma.account.findMany({
    where: {
      type: { in: ['Asset', 'Liability', 'Equity'] }
    },
    include: { entries: true }
  });

  const report = {
    assets: [] as any[],
    liabilities: [] as any[],
    equity: [] as any[],
    totalAssets: 0,
    totalLiabilities: 0,
    totalEquity: 0
  };

  accounts.forEach(acc => {
    const totalDebit = acc.entries.reduce((sum, e) => sum + e.debit, 0);
    const totalCredit = acc.entries.reduce((sum, e) => sum + e.credit, 0);
    
    let balance = 0;
    if (acc.type === 'Asset') {
      balance = totalDebit - totalCredit;
      report.assets.push({ name: acc.name, nameAr: acc.nameAr, balance });
      report.totalAssets += balance;
    } else if (acc.type === 'Liability') {
      balance = totalCredit - totalDebit;
      report.liabilities.push({ name: acc.name, nameAr: acc.nameAr, balance });
      report.totalLiabilities += balance;
    } else {
      balance = totalCredit - totalDebit;
      report.equity.push({ name: acc.name, nameAr: acc.nameAr, balance });
      report.totalEquity += balance;
    }
  });

  // Also include Net Income from P&L in Equity
  const pl = await getProfitLoss();
  report.equity.push({ name: 'Retained Earnings (Net Income)', nameAr: 'الأرباح المحتجزة (صافي الدخل)', balance: pl.netIncome });
  report.totalEquity += pl.netIncome;

  return report;
}
