'use server';

import { prisma_latest as prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getPayrollData(month: number, year: number) {
  const employees = await prisma.employee.findMany({
    where: { status: 'Active' },
    include: {
      financialMoves: {
        where: {
          date: {
            gte: new Date(year, month - 1, 1),
            lt: new Date(year, month, 1)
          },
          status: { in: ['Confirmed', 'Approved'] }
        }
      },
      salaryPayments: {
        where: { month, year }
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
    // 1. Find necessary accounts
    const expenseAcc = await prisma.account.findFirst({ where: { code: '6000' } });
    const payableAcc = await prisma.account.findFirst({ where: { code: '2100' } });
    const advancesAcc = await prisma.account.findFirst({ where: { code: '1135' } });
    const penaltiesAcc = await prisma.account.findFirst({ where: { code: '4400' } });

    // 2. Start Transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create SalaryPayment record
      const payment = await tx.salaryPayment.upsert({
        where: { employeeId_month_year: { employeeId, month, year } },
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
          employeeId,
          month,
          year,
          basicSalary: amounts.basicSalary,
          allowances: amounts.allowances,
          rewards: amounts.rewards,
          advances: amounts.advances,
          penalties: amounts.penalties,
          netSalary: amounts.netSalary,
          status: 'Approved'
        }
      });

      // Create Journal Voucher
      const date = new Date();
      const ref = `SAL-${year}${month.toString().padStart(2, '0')}-${amounts.code}`;
      
      const jv = await tx.journalVoucher.create({
        data: {
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
        where: { id: payment.id },
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
