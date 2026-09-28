import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { companyId } = session.user;
    const id = params.id;

    const financialYear = await prisma.financialYear.findFirst({
      where: { id, companyId }
    });

    if (!financialYear) {
      return NextResponse.json({ error: 'Financial year not found' }, { status: 404 });
    }

    if (financialYear.status === 'Closed') {
      return NextResponse.json({ error: 'Financial year is already closed' }, { status: 400 });
    }

    // 1. Calculate the balance of all Revenue and Expense accounts
    // Find all Journal Entries within this financial year (for non-draft vouchers)
    const incomeExpenseEntries = await prisma.journalEntry.findMany({
      where: {
        account: {
          companyId,
          type: { in: ['Revenue', 'Expense'] }
        },
        journalVoucher: {
          companyId,
          status: { not: 'Draft' },
          date: {
            gte: financialYear.startDate,
            lte: financialYear.endDate
          }
        }
      },
      include: {
        account: true
      }
    });

    // Group balances by account
    const accountBalances = new Map<string, { account: any, debit: number, credit: number }>();
    
    for (const entry of incomeExpenseEntries) {
      if (!accountBalances.has(entry.accountId)) {
        accountBalances.set(entry.accountId, { account: entry.account, debit: 0, credit: 0 });
      }
      const balances = accountBalances.get(entry.accountId)!;
      balances.debit += entry.debit;
      balances.credit += entry.credit;
    }

    // 2. Prepare closing entries
    let totalRevenueCredit = 0;
    let totalRevenueDebit = 0;
    let totalExpenseDebit = 0;
    let totalExpenseCredit = 0;

    const closingEntries: any[] = [];

    for (const [accountId, { account, debit, credit }] of Array.from(accountBalances.entries())) {
      const netBalance = credit - debit;
      if (netBalance === 0) continue;

      if (account.type === 'Revenue') {
        totalRevenueCredit += credit;
        totalRevenueDebit += debit;
        // Revenue normally has Credit balance. To close it, we Debit it.
        closingEntries.push({
          accountId,
          debit: netBalance > 0 ? netBalance : 0,
          credit: netBalance < 0 ? Math.abs(netBalance) : 0,
          description: `Closing entry for ${financialYear.name}`
        });
      } else if (account.type === 'Expense') {
        totalExpenseDebit += debit;
        totalExpenseCredit += credit;
        // Expense normally has Debit balance. To close it, we Credit it.
        closingEntries.push({
          accountId,
          debit: netBalance > 0 ? netBalance : 0,
          credit: netBalance < 0 ? Math.abs(netBalance) : 0,
          description: `Closing entry for ${financialYear.name}`
        });
      }
    }

    const netProfit = (totalRevenueCredit - totalRevenueDebit) - (totalExpenseDebit - totalExpenseCredit);

    // 3. Find or Create "Retained Earnings" Account (Code 34)
    let retainedEarningsAccount = await prisma.account.findFirst({
      where: {
        companyId,
        OR: [
          { code: '34' },
          { name: 'Retained Earnings (or Losses)' }
        ]
      }
    });

    if (!retainedEarningsAccount) {
      const equityRoot = await prisma.account.findFirst({
        where: { companyId, type: 'Equity', parentId: null }
      });
      
      let equityRootId = equityRoot?.id;

      if (!equityRootId) {
        const newEquityRoot = await prisma.account.create({
          data: { companyId, code: '3', name: 'Equity', nameAr: 'حقوق الملكية', type: 'Equity', nature: 'Credit', description: 'حقوق الملاك' }
        });
        equityRootId = newEquityRoot.id;
      }

      retainedEarningsAccount = await prisma.account.create({
        data: {
          companyId,
          code: '34',
          name: 'Retained Earnings (or Losses)',
          nameAr: 'الأرباح المبقاة (أو الخسائر)',
          type: 'Equity',
          nature: 'Credit',
          parentId: equityRootId,
          description: 'صافي أرباح السنوات السابقة التي لم يتم توزيعها'
        }
      });
    }

    if (netProfit !== 0) {
      closingEntries.push({
        accountId: retainedEarningsAccount.id,
        debit: netProfit < 0 ? Math.abs(netProfit) : 0,
        credit: netProfit > 0 ? netProfit : 0,
        description: `Net Profit/Loss for ${financialYear.name}`
      });
    }

    // 4. Create the Closing Journal Voucher
    if (closingEntries.length > 0) {
      await prisma.journalVoucher.create({
        data: {
          companyId,
          reference: `CLOSE-${financialYear.name.replace(/\s+/g, '-')}`,
          date: financialYear.endDate,
          description: `Closing Journal Voucher for Financial Year: ${financialYear.name}`,
          status: 'Approved',
          entries: {
            create: closingEntries
          }
        }
      });
    }

    // 5. Update Financial Year Status
    const updatedYear = await prisma.financialYear.update({
      where: { id },
      data: { status: 'Closed' }
    });

    return NextResponse.json({ success: true, year: updatedYear, netProfit });
  } catch (error: any) {
    console.error('Error closing financial year:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
