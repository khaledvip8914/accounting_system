'use server';

import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { getActiveBranch } from '@/lib/branch';

async function getCompanyId() {
  const session = await getSession();
  if (!session || !session.user || !session.user.companyId) {
    throw new Error('Unauthorized');
  }
  return session.user.companyId;
}

export async function getTrialBalance(startDate?: string, endDate?: string, dimensionValueId?: string) {
  try {
    const companyId = await getCompanyId();
    const branchId = await getActiveBranch();
    const entriesWhere: any = branchId ? { journalVoucher: { branchId } } : {};
    
    if (startDate || endDate) {
      entriesWhere.date = {};
      if (startDate) entriesWhere.date.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999);
        entriesWhere.date.lte = end;
      }
    }

    const accounts = await prisma.account.findMany({
      where: { companyId },
      include: {
        entries: {
          where: entriesWhere,
          select: { debit: true, credit: true, dimensionValues: true }
        }
      }
    });

    if (dimensionValueId) {
      accounts.forEach(acc => {
        acc.entries = acc.entries.filter((e: any) => {
          if (!e.dimensionValues) return false;
          const dims = typeof e.dimensionValues === 'string' ? JSON.parse(e.dimensionValues) : e.dimensionValues;
          if (!Array.isArray(dims)) return false;
          return dims.some((dim: any) => dim.valueId === dimensionValueId);
        });
      });
    }

    if (dimensionValueId) {
      accounts.forEach(acc => {
        acc.entries = acc.entries.filter((e: any) => {
          if (!e.dimensionValues) return false;
          const dims = typeof e.dimensionValues === 'string' ? JSON.parse(e.dimensionValues) : e.dimensionValues;
          if (!Array.isArray(dims)) return false;
          return dims.some((dim: any) => dim.valueId === dimensionValueId);
        });
      });
    }

    if (dimensionValueId) {
      accounts.forEach(acc => {
        acc.entries = acc.entries.filter((e: any) => {
          if (!e.dimensionValues) return false;
          const dims = typeof e.dimensionValues === 'string' ? JSON.parse(e.dimensionValues) : e.dimensionValues;
          if (!Array.isArray(dims)) return false;
          return dims.some((dim: any) => dim.valueId === dimensionValueId);
        });
      });
    }

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

export async function getProfitLoss(startDate?: string, endDate?: string, dimensionValueId?: string) {
  try {
    const companyId = await getCompanyId();
    const branchId = await getActiveBranch();
    const entriesWhere: any = branchId ? { journalVoucher: { branchId } } : {};

    if (startDate || endDate) {
      entriesWhere.date = {};
      if (startDate) entriesWhere.date.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999);
        entriesWhere.date.lte = end;
      }
    }

    const accounts = await prisma.account.findMany({
      where: {
        companyId,
        OR: [
          { code: { startsWith: '4' } }, // Revenue
          { code: { startsWith: '5' } }, // Expenses
          { code: { startsWith: '6' } }, // Operating Expenses
        ]
      },
      include: {
        entries: {
          where: entriesWhere,
          select: { debit: true, credit: true, dimensionValues: true }
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

      const item = { id: acc.id, name: acc.name, nameAr: acc.nameAr, balance };
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

export async function getBalanceSheet(startDate?: string, endDate?: string, dimensionValueId?: string) {
  try {
    const companyId = await getCompanyId();
    const branchId = await getActiveBranch();
    const entriesWhere: any = branchId ? { journalVoucher: { branchId } } : {};

    if (startDate || endDate) {
      entriesWhere.date = {};
      if (startDate) entriesWhere.date.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999);
        entriesWhere.date.lte = end;
      }
    }

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
          where: entriesWhere,
          select: { debit: true, credit: true, dimensionValues: true }
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

      const item = { id: acc.id, name: acc.name, nameAr: acc.nameAr, balance: Math.abs(balance) };
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
    const pl = await getProfitLoss(startDate, endDate);
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
    const branchId = await getActiveBranch();
    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);
    const whereClause: any = {
      companyId,
      date: {
        gte: new Date(startDate),
        lte: end
      }
    };
    if (branchId) whereClause.branchId = branchId;

    const invoices = await prisma.salesInvoice.findMany({
      where: whereClause,
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
    const branchId = await getActiveBranch();
    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);
    const whereClause: any = {
      companyId,
      date: {
        gte: new Date(startDate),
        lte: end
      }
    };
    if (branchId) whereClause.branchId = branchId;

    const invoices = await prisma.purchaseInvoice.findMany({
      where: whereClause,
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
    const branchId = await getActiveBranch();
    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);
    const salesWhere: any = {
      companyId,
      status: 'Returned',
      date: { gte: new Date(startDate), lte: end }
    };
    const purchaseWhere: any = { ...salesWhere };
    
    if (branchId) {
      salesWhere.branchId = branchId;
      purchaseWhere.branchId = branchId;
    }

    const salesReturns = await prisma.salesInvoice.findMany({
      where: salesWhere,
      include: { customer: true }
    });

    const purchaseReturns = await prisma.purchaseInvoice.findMany({
      where: purchaseWhere,
      include: { supplier: true }
    });

    return { success: true, salesReturns, purchaseReturns };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getDimensionReport(startDate: string, endDate: string, dimensionValueId: string) {
  if (!dimensionValueId) return { success: true, data: [] };
  try {
    const companyId = await getCompanyId();
    const branchId = await getActiveBranch();
    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);
    
    const accounts = await prisma.account.findMany({
      where: { companyId },
      include: {
        entries: {
          where: {
            date: { gte: new Date(startDate), lte: end },
            journalVoucher: branchId ? { branchId } : undefined
          },
          select: { debit: true, credit: true, dimensionValues: true }
        }
      }
    });

    const reportData = accounts.map(acc => {
      // Filter entries that match the dimensionValueId
      const filteredEntries = acc.entries.filter((e: any) => {
        if (!e.dimensionValues) return false;
        const dims = typeof e.dimensionValues === 'string' ? JSON.parse(e.dimensionValues) : e.dimensionValues;
        if (!Array.isArray(dims)) return false;
        return dims.some((dim: any) => dim.valueId === dimensionValueId);
      });

      const totalDebit = filteredEntries.reduce((sum, e) => sum + e.debit, 0);
      const totalCredit = filteredEntries.reduce((sum, e) => sum + e.credit, 0);

      return {
        id: acc.id,
        code: acc.code,
        name: acc.name,
        nameAr: acc.nameAr,
        type: acc.type,
        totalDebit,
        totalCredit,
        balance: totalDebit - totalCredit
      };
    }).filter(acc => acc.totalDebit > 0 || acc.totalCredit > 0);

    return { success: true, data: reportData };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAccountLedger(accountId: string, startDate: string, endDate: string) {
  try {
    const companyId = await getCompanyId();
    const branchId = await getActiveBranch();
    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);
    
    // Validate account belongs to company
    const account = await prisma.account.findFirst({ where: { id: accountId, companyId } });
    if (!account) throw new Error('Account not found');

    const entriesWhere: any = { accountId };
    if (branchId) entriesWhere.journalVoucher = { branchId };

    const entries = await prisma.journalEntry.findMany({
      where: entriesWhere,
      include: {
        journalVoucher: true
      },
      orderBy: { journalVoucher: { date: 'asc' } }
    });

    let openingBalance = 0;
    const periodEntries: any[] = [];
    
    const start = new Date(startDate).getTime();
    const endTime = end.getTime();

    entries.forEach(e => {
      if (!e.journalVoucher) return;
      const eTime = new Date(e.journalVoucher.date).getTime();
      if (eTime < start) {
        openingBalance += (e.debit - e.credit);
      } else if (eTime <= endTime) {
        periodEntries.push({
          id: e.id,
          date: e.journalVoucher.date,
          reference: e.journalVoucher.reference,
          description: e.description || e.journalVoucher.description,
          debit: e.debit,
          credit: e.credit
        });
      }
    });

    periodEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let runningBalance = openingBalance;
    const rows = periodEntries.map(e => {
      runningBalance += (e.debit - e.credit);
      return { ...e, balance: runningBalance };
    });

    return {
      success: true,
      account,
      data: {
        openingBalance,
        rows,
        totalDebit: periodEntries.reduce((s, e) => s + e.debit, 0),
        totalCredit: periodEntries.reduce((s, e) => s + e.credit, 0),
        finalBalance: runningBalance
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getVatReturnReport(startDate: string, endDate: string) {
  try {
    const companyId = await getCompanyId();
    const branchId = await getActiveBranch();
    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);

    const whereBase: any = {
      companyId,
      date: { gte: new Date(startDate), lte: end },
      status: { notIn: ['Cancelled', 'Canceled', 'Void', 'Draft'] }
    };
    if (branchId) {
      whereBase.branchId = branchId;
    }

    const sales = await prisma.salesInvoice.findMany({ where: whereBase });
    const purchases = await prisma.purchaseInvoice.findMany({ where: whereBase });

    let outputVat = 0, taxableSales = 0, zeroRatedSales = 0;
    sales.forEach(inv => {
      // Handle returns (credit notes or status Returned)
      const multiplier = (inv.status === 'Returned' || (inv as any).invoiceType === '381') ? -1 : 1;
      outputVat += (inv.taxAmount || 0) * multiplier;
      if (inv.taxAmount > 0) taxableSales += (inv.netAmount || 0) * multiplier;
      else zeroRatedSales += (inv.netAmount || 0) * multiplier;
    });

    let inputVat = 0, taxablePurchases = 0, zeroRatedPurchases = 0;
    purchases.forEach(inv => {
      const multiplier = (inv.status === 'Returned') ? -1 : 1;
      inputVat += (inv.taxAmount || 0) * multiplier;
      if (inv.taxAmount > 0) taxablePurchases += (inv.netAmount || 0) * multiplier;
      else zeroRatedPurchases += (inv.netAmount || 0) * multiplier;
    });

    return {
      success: true,
      data: {
        sales: { taxable: taxableSales, zeroRated: zeroRatedSales, vat: outputVat },
        purchases: { taxable: taxablePurchases, zeroRated: zeroRatedPurchases, vat: inputVat },
        netVatDue: outputVat - inputVat
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAgingReport(type: 'receivables' | 'payables', asOfDate: string) {
  try {
    const companyId = await getCompanyId();
    const branchId = await getActiveBranch();
    const end = new Date(asOfDate);
    end.setUTCHours(23, 59, 59, 999);

    const nowTime = end.getTime();
    const msInDay = 1000 * 60 * 60 * 24;

    if (type === 'receivables') {
      const whereCustomer: any = { companyId, balance: { gt: 0 } };
      const customers = await prisma.customer.findMany({ where: whereCustomer });

      const reportData = [];

      for (const customer of customers) {
        let remainingBalance = customer.balance;
        const unpaidInvoices = await prisma.salesInvoice.findMany({
          where: {
            companyId,
            customerId: customer.id,
            status: { notIn: ['Paid', 'Cancelled', 'Canceled', 'Void'] },
            date: { lte: end }
          },
          orderBy: { date: 'desc' } // Newest first
        });

        const buckets = { '1-30': 0, '31-60': 0, '61-90': 0, '90+': 0 };

        for (const inv of unpaidInvoices) {
          if (remainingBalance <= 0) break;
          const amountToAllocate = Math.min(inv.netAmount, remainingBalance);
          remainingBalance -= amountToAllocate;

          const daysOld = Math.floor((nowTime - inv.date.getTime()) / msInDay);
          if (daysOld <= 30) buckets['1-30'] += amountToAllocate;
          else if (daysOld <= 60) buckets['31-60'] += amountToAllocate;
          else if (daysOld <= 90) buckets['61-90'] += amountToAllocate;
          else buckets['90+'] += amountToAllocate;
        }

        // If there's still balance left (maybe opening balance)
        if (remainingBalance > 0) {
          // Use the customer's creation date or a default age for the opening balance
          const customerDate = customer.createdAt ? customer.createdAt.getTime() : nowTime;
          const daysOld = Math.floor((nowTime - customerDate) / msInDay);
          
          if (daysOld <= 30) buckets['1-30'] += remainingBalance;
          else if (daysOld <= 60) buckets['31-60'] += remainingBalance;
          else if (daysOld <= 90) buckets['61-90'] += remainingBalance;
          else buckets['90+'] += remainingBalance;
        }

        reportData.push({
          id: customer.id,
          name: customer.name,
          nameAr: customer.nameAr,
          total: customer.balance,
          ...buckets
        });
      }

      return { success: true, data: reportData };
    } else {
      const whereSupplier: any = { companyId, balance: { gt: 0 } };
      const suppliers = await prisma.supplier.findMany({ where: whereSupplier });

      const reportData = [];

      for (const supplier of suppliers) {
        let remainingBalance = supplier.balance;
        const unpaidInvoices = await prisma.purchaseInvoice.findMany({
          where: {
            companyId,
            supplierId: supplier.id,
            status: { notIn: ['Paid', 'Cancelled', 'Canceled', 'Void'] },
            date: { lte: end }
          },
          orderBy: { date: 'desc' }
        });

        const buckets = { '1-30': 0, '31-60': 0, '61-90': 0, '90+': 0 };

        for (const inv of unpaidInvoices) {
          if (remainingBalance <= 0) break;
          const amountToAllocate = Math.min(inv.netAmount, remainingBalance);
          remainingBalance -= amountToAllocate;

          const daysOld = Math.floor((nowTime - inv.date.getTime()) / msInDay);
          if (daysOld <= 30) buckets['1-30'] += amountToAllocate;
          else if (daysOld <= 60) buckets['31-60'] += amountToAllocate;
          else if (daysOld <= 90) buckets['61-90'] += amountToAllocate;
          else buckets['90+'] += amountToAllocate;
        }

        if (remainingBalance > 0) {
          const supplierDate = supplier.createdAt ? supplier.createdAt.getTime() : nowTime;
          const daysOld = Math.floor((nowTime - supplierDate) / msInDay);
          
          if (daysOld <= 30) buckets['1-30'] += remainingBalance;
          else if (daysOld <= 60) buckets['31-60'] += remainingBalance;
          else if (daysOld <= 90) buckets['61-90'] += remainingBalance;
          else buckets['90+'] += remainingBalance;
        }

        reportData.push({
          id: supplier.id,
          name: supplier.name,
          nameAr: supplier.nameAr,
          total: supplier.balance,
          ...buckets
        });
      }

      return { success: true, data: reportData };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- NEW FINANCIAL REPORTS ---

export async function getGeneralJournal(startDate?: string, endDate?: string) {
  try {
    const companyId = await getCompanyId();
    const branchId = await getActiveBranch();
    
    const whereClause: any = { companyId };
    if (branchId) whereClause.branchId = branchId;

    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) whereClause.date.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999);
        whereClause.date.lte = end;
      }
    }

    const vouchers = await prisma.journalVoucher.findMany({
      where: whereClause,
      include: {
        entries: {
          include: {
            account: true
          },
          orderBy: [
            { debit: 'desc' }, // Usually Debits first
            { credit: 'desc' }
          ]
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    const journalEntries: any[] = [];
    vouchers.forEach(v => {
      v.entries.forEach(entry => {
        journalEntries.push({
          id: entry.id,
          date: v.date,
          reference: v.reference,
          description: entry.description || v.description,
          accountCode: entry.account.code,
          accountName: entry.account.name,
          accountNameAr: entry.account.nameAr,
          debit: entry.debit,
          credit: entry.credit
        });
      });
    });

    return { success: true, data: journalEntries };
  } catch (error: any) {
    console.error('Failed to get General Journal:', error);
    return { success: false, error: error.message };
  }
}

export async function getCashFlowReport(startDate?: string, endDate?: string) {
  // Indirect Method Implementation
  try {
    const companyId = await getCompanyId();
    const pl = await getProfitLoss(startDate, endDate);
    
    // We need opening and closing balances of Balance Sheet items for working capital changes.
    // For simplicity in this iteration, we fetch the entries within the period for AR and AP directly.
    const branchId = await getActiveBranch();
    const entriesWhere: any = branchId ? { journalVoucher: { branchId } } : {};
    
    if (startDate || endDate) {
      entriesWhere.date = {};
      if (startDate) entriesWhere.date.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999);
        entriesWhere.date.lte = end;
      }
    }

    const accounts = await prisma.account.findMany({
      where: { companyId },
      include: {
        entries: {
          where: entriesWhere,
          select: { debit: true, credit: true }
        }
      }
    });

    // We assume codes starting with:
    // 11 (Current Assets -> AR, Inventory)
    // 21 (Current Liabilities -> AP)
    // 12 (Fixed Assets -> Investing)
    // 22/3 (Long-term Liab / Equity -> Financing)
    
    let operatingActivities = 0;
    let investingActivities = 0;
    let financingActivities = 0;
    
    const operatingItems: any[] = [];
    const investingItems: any[] = [];
    const financingItems: any[] = [];

    // Start with Net Income
    operatingItems.push({ name: 'Net Income', nameAr: 'صافي الدخل', amount: pl.netIncome });
    operatingActivities += pl.netIncome;

    accounts.forEach(acc => {
      const totalDebit = acc.entries.reduce((sum, e) => sum + e.debit, 0);
      const totalCredit = acc.entries.reduce((sum, e) => sum + e.credit, 0);
      const change = totalDebit - totalCredit; 
      
      if (change === 0) return;

      if (acc.code.startsWith('11') && !acc.name.toLowerCase().includes('cash') && !acc.name.toLowerCase().includes('bank')) {
        // Increase in asset is negative cash flow
        operatingItems.push({ name: `Change in ${acc.name}`, nameAr: `التغير في ${acc.nameAr || acc.name}`, amount: -change });
        operatingActivities -= change;
      } else if (acc.code.startsWith('21')) {
        // Increase in liability is positive cash flow
        // For liability, balance increase is Credit > Debit (change is negative), so we reverse the sign? 
        // Wait, totalDebit - totalCredit is negative if credit > debit. So -change is positive cash flow.
        operatingItems.push({ name: `Change in ${acc.name}`, nameAr: `التغير في ${acc.nameAr || acc.name}`, amount: -change });
        operatingActivities -= change;
      } else if (acc.code.startsWith('12')) {
        // Fixed assets (Investing)
        investingItems.push({ name: `Change in ${acc.name}`, nameAr: `التغير في ${acc.nameAr || acc.name}`, amount: -change });
        investingActivities -= change;
      } else if (acc.code.startsWith('22') || acc.code.startsWith('3')) {
        // Equity and Long term liabilities (Financing)
        financingItems.push({ name: `Change in ${acc.name}`, nameAr: `التغير في ${acc.nameAr || acc.name}`, amount: -change });
        financingActivities -= change;
      }
    });

    return { 
      success: true, 
      data: {
        operating: operatingItems,
        investing: investingItems,
        financing: financingItems,
        netCashFlow: operatingActivities + investingActivities + financingActivities
      }
    };

  } catch (error: any) {
    console.error('Failed to get Cash Flow Report:', error);
    return { success: false, error: error.message };
  }
}

export async function getBankReconciliationReport(accountId: string, startDate?: string, endDate?: string) {
  try {
    const companyId = await getCompanyId();
    
    // Validate account
    const bankAccount = await prisma.bankAccount.findFirst({
      where: { id: accountId, companyId },
      include: { linkedAccount: true }
    });

    if (!bankAccount) return { success: false, error: 'Bank account not found' };

    // Get system transactions (Journal Entries)
    const branchId = await getActiveBranch();
    const entriesWhere: any = { accountId: bankAccount.linkedAccountId };
    if (branchId) entriesWhere.journalVoucher = { branchId };
    
    if (startDate || endDate) {
      entriesWhere.date = {};
      if (startDate) entriesWhere.date.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999);
        entriesWhere.date.lte = end;
      }
    }

    const entries = await prisma.journalEntry.findMany({
      where: entriesWhere,
      include: {
        journalVoucher: true
      },
      orderBy: { date: 'asc' }
    });

    // Check which ones are in BankReconciliationItem
    const systemVoucherIds = entries.map(e => e.journalVoucherId).filter(Boolean) as string[];
    
    const reconciledItems = await prisma.bankReconciliationItem.findMany({
      where: {
        systemVoucherId: { in: systemVoucherIds },
        status: 'Matched'
      },
      select: { systemVoucherId: true }
    });

    const reconciledVoucherIds = new Set(reconciledItems.map(i => i.systemVoucherId));

    const transactions = entries.map(entry => {
      const isReconciled = reconciledVoucherIds.has(entry.journalVoucherId);
      return {
        id: entry.id,
        date: entry.date,
        reference: entry.journalVoucher?.reference || entry.reference,
        description: entry.description,
        debit: entry.debit,
        credit: entry.credit,
        isReconciled
      };
    });

    const unclearedTransactions = transactions.filter(t => !t.isReconciled);
    const unclearedAmount = unclearedTransactions.reduce((sum, t) => sum + (t.debit - t.credit), 0);

    return { 
      success: true, 
      data: {
        bankAccount,
        systemBalance: bankAccount.currentBalance,
        transactions,
        unclearedTransactions,
        unclearedAmount
      }
    };
  } catch (error: any) {
    console.error('Failed to get Bank Reconciliation:', error);
    return { success: false, error: error.message };
  }
}

export async function getBankAccountsList() {
  try {
    const companyId = await getCompanyId();
    const accounts = await prisma.bankAccount.findMany({
      where: { companyId }
    });
    return { success: true, data: accounts };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getEquityChanges(startDate?: string, endDate?: string) {
  try {
    const companyId = await getCompanyId();
    const branchId = await getActiveBranch();
    const baseWhere: any = branchId ? { journalVoucher: { branchId } } : {};

    // For opening balance, we look at entries BEFORE startDate
    const openingWhere = { ...baseWhere };
    if (startDate) {
      openingWhere.date = { lt: new Date(startDate) };
    }

    // For period movements, we look at entries BETWEEN startDate and endDate
    const periodWhere: any = { ...baseWhere };
    if (startDate || endDate) {
      periodWhere.date = {};
      if (startDate) periodWhere.date.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999);
        periodWhere.date.lte = end;
      }
    }

    const accounts = await prisma.account.findMany({
      where: {
        companyId,
        code: { startsWith: '3' } // Equity
      },
      include: {
        entries: {
          select: { debit: true, credit: true, date: true, journalVoucher: { select: { branchId: true } } }
        }
      },
      orderBy: { code: 'asc' }
    });

    const equityAccounts: any[] = [];
    let totalOpening = 0;
    let totalAdditions = 0;
    let totalDeductions = 0;
    let totalEnding = 0;

    const sDate = startDate ? new Date(startDate) : null;
    let eDate = endDate ? new Date(endDate) : null;
    if (eDate) eDate.setUTCHours(23, 59, 59, 999);

    accounts.forEach(acc => {
      let openingBalance = 0;
      let periodAdditions = 0; // Credit increases equity
      let periodDeductions = 0; // Debit decreases equity

      acc.entries.forEach(entry => {
        // Filter by branch if applicable
        if (branchId && entry.journalVoucher?.branchId !== branchId) return;

        const entryDate = new Date(entry.date);
        
        if (sDate && entryDate < sDate) {
          // Opening balance (Equity increases with Credit, decreases with Debit)
          openingBalance += (entry.credit - entry.debit);
        } else if ((!sDate || entryDate >= sDate) && (!eDate || entryDate <= eDate)) {
          // Period movement
          if (entry.credit > 0) periodAdditions += entry.credit;
          if (entry.debit > 0) periodDeductions += entry.debit;
        }
      });

      const endingBalance = openingBalance + periodAdditions - periodDeductions;

      equityAccounts.push({
        id: acc.id,
        code: acc.code,
        name: acc.name,
        nameAr: acc.nameAr,
        openingBalance,
        additions: periodAdditions,
        deductions: periodDeductions,
        endingBalance
      });

      totalOpening += openingBalance;
      totalAdditions += periodAdditions;
      totalDeductions += periodDeductions;
      totalEnding += endingBalance;
    });

    // Handle Net Income for the period
    const pl = await getProfitLoss(startDate, endDate);
    
    // Add net income line
    const netIncomeLine = {
      id: 'net-income',
      code: '-',
      name: 'Current Period Earnings (Net Income)',
      nameAr: 'أرباح الفترة الحالية (صافي الربح)',
      openingBalance: 0,
      additions: pl.netIncome > 0 ? pl.netIncome : 0,
      deductions: pl.netIncome < 0 ? Math.abs(pl.netIncome) : 0,
      endingBalance: pl.netIncome
    };
    
    equityAccounts.push(netIncomeLine);
    
    if (pl.netIncome > 0) totalAdditions += pl.netIncome;
    else totalDeductions += Math.abs(pl.netIncome);
    
    totalEnding += pl.netIncome;

    return { 
      success: true, 
      data: {
        accounts: equityAccounts,
        totalOpening,
        totalAdditions,
        totalDeductions,
        totalEnding
      }
    };
  } catch (error: any) {
    console.error('Failed to get Equity Changes:', error);
    return { success: false, error: error.message };
  }
}

export async function getItemProfitabilityReport(startDate: string, endDate: string) {
  try {
    const companyId = await getCompanyId();
    const branchId = await getActiveBranch();
    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);
    const whereClause: any = {
      companyId,
      status: { notIn: ['Draft', 'Cancelled'] },
      date: {
        gte: new Date(startDate),
        lte: end
      }
    };
    if (branchId) whereClause.branchId = branchId;

    const invoices = await prisma.salesInvoice.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    const itemMap = new Map<string, any>();

    for (const inv of invoices) {
      // 381 is credit note (returns), 388 is standard invoice
      const isReturn = inv.invoiceType === '381';
      
      for (const item of inv.items) {
        if (!item.product) continue;
        
        const productId = item.productId;
        const qty = isReturn ? -item.quantity : item.quantity;
        const sales = isReturn ? -item.total : item.total;
        
        if (!itemMap.has(productId)) {
          itemMap.set(productId, {
            id: productId,
            name: item.product.name,
            nameAr: item.product.nameAr,
            sku: item.product.sku,
            quantity: 0,
            salesValue: 0,
            costValue: 0,
          });
        }
        
        const entry = itemMap.get(productId)!;
        entry.quantity += qty;
        entry.salesValue += sales;
        // Cost is current costPrice * quantity (in reality should track historical cost, but this is simple version)
        entry.costValue += qty * item.product.costPrice;
      }
    }

    const reportData = Array.from(itemMap.values()).map(item => {
      const profit = item.salesValue - item.costValue;
      const margin = item.salesValue > 0 ? (profit / item.salesValue) * 100 : 0;
      return {
        ...item,
        profit,
        margin
      };
    });
    
    // Sort by profit descending
    reportData.sort((a, b) => b.profit - a.profit);

    return { success: true, data: reportData };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getCustomersList() {
  try {
    const companyId = await getCompanyId();
    const customers = await prisma.customer.findMany({
      where: { companyId },
      select: { id: true, name: true, nameAr: true, code: true },
      orderBy: { name: 'asc' }
    });
    return { success: true, data: customers };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getSuppliersList() {
  try {
    const companyId = await getCompanyId();
    const suppliers = await prisma.supplier.findMany({
      where: { companyId },
      select: { id: true, name: true, nameAr: true, code: true },
      orderBy: { name: 'asc' }
    });
    return { success: true, data: suppliers };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAccountLedgerByCode(accountCode: string, startDate: string, endDate: string) {
  try {
    const companyId = await getCompanyId();
    let account = await prisma.account.findFirst({
      where: { code: accountCode, companyId }
    });

    if (!account) {
      // Auto-heal missing contact account
      const isCustomer = accountCode.startsWith('1130-');
      const isSupplier = accountCode.startsWith('2000-');
      
      if (isCustomer || isSupplier) {
        const contactCode = accountCode.split('-').slice(1).join('-');
        let contact = null;
        let parentCode = '';
        let type = 'Asset';
        
        if (isCustomer) {
          contact = await prisma.customer.findFirst({ where: { code: contactCode, companyId } });
          parentCode = '1130';
          type = 'Asset';
        } else {
          contact = await prisma.supplier.findFirst({ where: { code: contactCode, companyId } });
          parentCode = '2000';
          type = 'Liability';
        }

        if (contact) {
          const parent = await prisma.account.findFirst({ where: { code: parentCode, companyId } });
          if (parent) {
            account = await prisma.account.create({
              data: {
                code: accountCode,
                name: contact.name,
                nameAr: contact.nameAr || contact.name,
                type,
                parentId: parent.id,
                companyId
              }
            });

            // Migrate journal entries posted to the parent account
            if (isCustomer) {
              const invoices = await prisma.salesInvoice.findMany({
                where: { customerId: contact.id, journalVoucherId: { not: null } }
              });
              for (const inv of invoices) {
                const entries = await prisma.journalEntry.findMany({
                  where: { journalVoucherId: inv.journalVoucherId, account: { code: { in: ['1130', '1131'] } } }
                });
                for (const entry of entries) {
                  await prisma.journalEntry.update({ where: { id: entry.id }, data: { accountId: account.id } });
                }
              }
            } else {
              const invoices = await prisma.purchaseInvoice.findMany({
                where: { supplierId: contact.id, journalVoucherId: { not: null } }
              });
              for (const inv of invoices) {
                const entries = await prisma.journalEntry.findMany({
                  where: { journalVoucherId: inv.journalVoucherId, account: { code: { in: ['2000', '2001'] } } }
                });
                for (const entry of entries) {
                  await prisma.journalEntry.update({ where: { id: entry.id }, data: { accountId: account.id } });
                }
              }
            }
          }
        }
      }

      if (!account) {
        return {
          success: true,
          account: { name: accountCode, code: accountCode },
          data: {
            openingBalance: 0,
            rows: [],
            totalDebit: 0,
            totalCredit: 0,
            finalBalance: 0
          }
        };
      }
    }
    return await getAccountLedger(account.id, startDate, endDate);
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPerformanceComparison(periodType: 'month' | 'year' = 'month') {
  try {
    const companyId = await getCompanyId();
    const branchId = await getActiveBranch();
    
    const now = new Date();
    
    let currentStart: Date, currentEnd: Date;
    let prevStart: Date, prevEnd: Date;

    if (periodType === 'month') {
      // Current Month
      currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
      currentEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      // Previous Month
      prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      prevEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    } else {
      // Current Year
      currentStart = new Date(now.getFullYear(), 0, 1);
      currentEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      // Previous Year
      prevStart = new Date(now.getFullYear() - 1, 0, 1);
      prevEnd = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
    }

    const getMetricsForPeriod = async (start: Date, end: Date) => {
      const accounts = await prisma.account.findMany({
        where: { companyId, type: { in: ['Revenue', 'Expense'] } },
        include: {
          entries: {
            where: {
              date: { gte: start, lte: end },
              ...(branchId ? { journalVoucher: { branchId } } : {})
            },
            select: { debit: true, credit: true }
          }
        }
      });

      let revenue = 0;
      let expense = 0;

      accounts.forEach(acc => {
        const debit = acc.entries.reduce((s, e) => s + e.debit, 0);
        const credit = acc.entries.reduce((s, e) => s + e.credit, 0);
        
        if (acc.type === 'Revenue') {
          revenue += (credit - debit);
        } else if (acc.type === 'Expense') {
          expense += (debit - credit);
        }
      });

      return { revenue, expense, netProfit: revenue - expense };
    };

    const current = await getMetricsForPeriod(currentStart, currentEnd);
    const prev = await getMetricsForPeriod(prevStart, prevEnd);

    return {
      success: true,
      data: { current, previous: prev }
    };

  } catch (error: any) {
    console.error('Failed to get performance comparison:', error);
    return { success: false, error: error.message };
  }
}


