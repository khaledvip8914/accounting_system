'use server';

import { prisma_latest as prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { getActiveBranch } from '@/lib/branch';

async function getAuthContext() {
  const session = await getSession();
  if (!session || !session.user || !session.user.companyId) {
    throw new Error('Unauthorized');
  }
  return {
    companyId: session.user.companyId,
    permissions: session.user
  };
}

export async function getPayrollData(month: number, year: number) {
  const { companyId } = await getAuthContext();
  const branchId = await getActiveBranch();
  const whereClause: any = { status: 'Active', companyId };
  if (branchId) whereClause.branchId = branchId;
  const financialMovesWhere: any = { companyId, branchId: branchId || null, date: { gte: new Date(year, month - 1, 1), lt: new Date(year, month, 1) }, status: { in: ['Confirmed', 'Approved'] } };
  const paymentsWhere: any = { month, year, companyId, branchId: branchId || null };

  const employees = await prisma.employee.findMany({
    where: whereClause,
    include: {
      financialMoves: {
        where: financialMovesWhere
      },
      salaryPayments: {
        where: paymentsWhere
      }
    }
  });

  return employees.map(emp => {
    const moves = emp.financialMoves;
    const basic = emp.basicSalary || 0;
    const allowances = moves.filter(m => ['Allowance', 'AdvanceAddition'].includes(m.type)).reduce((s, m) => s + m.amount, 0);
    const rewards = moves.filter(m => m.type === 'Reward').reduce((s, m) => s + m.amount, 0);
    const advances = moves.filter(m => ['Advance', 'AdvanceDeduction'].includes(m.type)).reduce((s, m) => s + m.amount, 0);
    const penalties = moves.filter(m => m.type === 'Penalty').reduce((s, m) => s + m.amount, 0);
    
    const net = basic + allowances + rewards - advances - penalties;

    return {
      employeeId: emp.id,
      code: emp.code,
      name: emp.name,
      nameAr: emp.nameAr,
      basicSalary: basic,
      allowances,
      rewards,
      advances,
      penalties,
      netSalary: net,
      status: emp.salaryPayments[0]?.status || 'Pending',
      paymentId: emp.salaryPayments[0]?.id || null
    };
  });
}

export async function approveSalary({ employeeId, month, year, amounts }: { employeeId: string, month: number, year: number, amounts: any }) {
  try {
    const { companyId } = await getAuthContext();
    const branchId = await getActiveBranch();

    // 1. Find necessary accounts (Scoped to company)
    const expenseAcc = await prisma.account.findFirst({ where: { code: '6000', companyId } });
    const payableAcc = await prisma.account.findFirst({ where: { code: '2100', companyId } });
    const advancesAcc = await prisma.account.findFirst({ where: { code: '1135', companyId } });
    const penaltiesAcc = await prisma.account.findFirst({ where: { code: '4400', companyId } });

    // 2. Start Transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create SalaryPayment record
      const payment = await tx.salaryPayment.upsert({
        where: { 
            employeeId_month_year: { employeeId, month, year },
            // employee: { companyId } // Not supported by prisma upsert unique filter directly easily, 
            // but the findUnique for upsert is strictly unique. 
            // We should check if employeeId belongs to companyId beforehand.
        },
        update: {
          basicSalary: amounts.basicSalary,
          allowances: amounts.allowances,
          rewards: amounts.rewards,
          advances: amounts.advances,
          penalties: amounts.penalties,
          netSalary: amounts.netSalary,
          status: 'Approved'
        },
        create: {
          companyId,
          employeeId,
          month,
          year,
          basicSalary: amounts.basicSalary,
          allowances: amounts.allowances,
          rewards: amounts.rewards,
          advances: amounts.advances,
          penalties: amounts.penalties,
          netSalary: amounts.netSalary,
          status: 'Approved',
          branchId
        }
      });

      // Verify ownership if it was an update
      if (payment.companyId !== companyId) {
          throw new Error('Unauthorized salary payment update attempt');
      }

      // Create Journal Voucher
      const date = new Date();
      const ref = `SAL-${year}${month.toString().padStart(2, '0')}-${amounts.code}`;
      
      const jv = await tx.journalVoucher.create({
        data: {
          companyId,
          branchId,
          reference: ref,
          date: new Date(),
          description: `Salary Payment - ${amounts.name} - ${month}/${year}`,
          status: 'Confirmed'
        }
      });

      // Entry 1: Salary Expense (Debit total gross: basic + allowances + rewards)
      const gross = amounts.basicSalary + (amounts.allowances || 0) + (amounts.rewards || 0);
      if (expenseAcc) {
        await tx.journalEntry.create({
          data: {
            journalVoucherId: jv.id,
            accountId: expenseAcc.id,
            description: `Gross Salary - ${amounts.name}`,
            debit: gross,
            credit: 0,
            date: jv.date
          }
        });
      }

      // Entry 2: Advances Deduction (Credit)
      if (advancesAcc && amounts.advances > 0) {
        await tx.journalEntry.create({
          data: {
            journalVoucherId: jv.id,
            accountId: advancesAcc.id,
            description: `Advance Deduction - ${amounts.name}`,
            debit: 0,
            credit: amounts.advances,
            date: jv.date
          }
        });
      }

      // Entry 3: Penalties (Credit to reduce Expense)
      const penaltyPostingAcc = penaltiesAcc || expenseAcc;
      if (penaltyPostingAcc && amounts.penalties > 0) {
        await tx.journalEntry.create({
          data: {
            journalVoucherId: jv.id,
            accountId: penaltyPostingAcc.id,
            description: `Penalty Deduction - ${amounts.name}`,
            debit: 0,
            credit: amounts.penalties,
            date: jv.date
          }
        });
      }

      // Entry 4: Salaries Payable (Credit Net)
      if (payableAcc) {
        await tx.journalEntry.create({
          data: {
            journalVoucherId: jv.id,
            accountId: payableAcc.id,
            description: `Net Salary Payable - ${amounts.name}`,
            debit: 0,
            credit: amounts.netSalary,
            date: jv.date
          }
        });
      }

      // Link payment to JV
      await tx.salaryPayment.update({
        where: { id: payment.id, companyId },
        data: { journalVoucherId: jv.id }
      });

      return { success: true };
    });

    revalidatePath('/salaries');
    return result;
  } catch (err: any) {
    console.error('Approval error:', err);
    return { success: false, error: err.message };
  }
}

export async function approveAllSalaries({ month, year, data }: { month: number, year: number, data: any[] }) {
  let successCount = 0;
  let errors = [];

  for (const item of data) {
    if (item.status === 'Approved') continue;
    const res = await approveSalary({ employeeId: item.employeeId, month, year, amounts: item });
    if (res.success) successCount++;
    else errors.push(`${item.name}: ${(res as any).error || 'Unknown error'}`);
  }

  revalidatePath('/salaries');
  revalidatePath('/financial');
  revalidatePath('/ledger');
  return { success: true, count: successCount, errors };
}
