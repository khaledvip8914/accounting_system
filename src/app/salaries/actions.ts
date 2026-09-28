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
  const financialMovesWhere: any = { companyId, date: { gte: new Date(year, month - 1, 1), lt: new Date(year, month, 1) }, status: { in: ['Confirmed', 'Approved'] }, includeInPayroll: true };
  if (branchId) financialMovesWhere.branchId = branchId;
  const paymentsWhere: any = { month, year, companyId };
  if (branchId) paymentsWhere.branchId = branchId;

  // We calculate start and end dates of the requested month
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const employees = await prisma.employee.findMany({
    where: whereClause,
    include: {
      financialMoves: {
        where: financialMovesWhere
      },
      salaryPayments: {
        where: paymentsWhere
      },
      contracts: {
        where: { status: 'Active' },
        include: { allowances: true, deductions: true }
      }
    }
  });

  const pendingInstallments = await prisma.loanInstallment.findMany({
    where: {
      loan: { companyId },
      month,
      year,
      status: 'Pending'
    },
    include: { loan: true }
  });

  const settings = await prisma.payrollSettings.findUnique({
    where: { companyId }
  });
  const gosiEmployeeRatio = settings?.gosiEmployeeRatio || 9.75;
  const gosiMaxSalary = settings?.gosiMaxSalary || 45000;

  return employees.reduce((acc: any[], emp) => {
    // 1. Filter by join date (skip if hired after this month)
    if (emp.joinDate && new Date(emp.joinDate) > endDate) {
      return acc;
    }

    // 2. Check if there's already a generated SalaryPayment
    const payment = emp.salaryPayments[0];
    if (payment) {
      acc.push({
        employeeId: emp.id,
        code: emp.code,
        name: emp.name,
        nameAr: emp.nameAr,
        phone: emp.phone,
        basicSalary: payment.basicSalary,
        allowances: payment.allowances,
        rewards: payment.rewards,
        advances: payment.advances,
        penalties: payment.penalties,
        netSalary: payment.netSalary,
        notes: payment.notes || '',
        status: payment.status,
        paymentId: payment.id
      });
      return acc;
    }

    // 3. Otherwise, calculate dynamically (Pending) with Proration
    const activeContract = emp.contracts && emp.contracts.length > 0 ? emp.contracts[0] : null;
    let basicSalary = activeContract ? activeContract.basicSalary : emp.basicSalary;
    
    let allowances = 0;
    let rewards = 0;
    let advances = 0;
    let penalties = 0;

    // Proration Factor
    const totalDaysInMonth = endDate.getDate();
    let workedDays = totalDaysInMonth;
    if (emp.joinDate && new Date(emp.joinDate) > startDate) {
      const join = new Date(emp.joinDate);
      workedDays = endDate.getDate() - join.getDate() + 1;
    }
    const prorationFactor = workedDays / totalDaysInMonth;

    basicSalary = basicSalary * prorationFactor;

    const notes: string[] = [];
    if (prorationFactor < 1) {
      notes.push(`تم احتساب الراتب لـ ${workedDays} أيام (من تاريخ التعيين)`);
    }
    notes.push(`راتب أساسي: ${basicSalary.toFixed(2)}`);

    if (activeContract) {
      activeContract.allowances.forEach((a: any) => {
        const proratedAllowance = a.amount * prorationFactor;
        allowances += proratedAllowance;
        notes.push(`بدل ${a.name}: ${proratedAllowance.toFixed(2)}`);
      });
      activeContract.deductions.forEach((d: any) => {
        const proratedDeduction = d.amount * prorationFactor;
        penalties += proratedDeduction;
        notes.push(`خصم ${d.name}: ${proratedDeduction.toFixed(2)}`);
      });
    }

    const moves = emp.financialMoves;
    moves.forEach(move => {
      if (['Allowance', 'AdvanceAddition'].includes(move.type)) { allowances += move.amount; notes.push(`بدل ${move.reason || 'إضافي'}: ${move.amount}`); }
      else if (move.type === 'Reward') { rewards += move.amount; notes.push(`مكافأة ${move.reason || ''}: ${move.amount}`); }
      else if (['Advance', 'AdvanceDeduction'].includes(move.type)) { advances += move.amount; notes.push(`سلفة/قرض ${move.reason || ''}: ${move.amount}`); }
      else if (move.type === 'Penalty') { penalties += move.amount; notes.push(`جزاء ${move.reason || ''}: ${move.amount}`); }
    });

    const empInstallments = pendingInstallments.filter(i => i.loan.employeeId === emp.id);
    empInstallments.forEach(inst => {
      advances += inst.amount;
      notes.push(`قسط قرض ${inst.loan.reason || ''}: ${inst.amount}`);
    });

    const gosiSalaryBase = Math.min(basicSalary + allowances, gosiMaxSalary);
    const gosiDeduction = Math.round(((gosiSalaryBase * gosiEmployeeRatio) / 100) * 100) / 100;
    if (gosiDeduction > 0) notes.push(`تأمينات اجتماعية: ${gosiDeduction.toFixed(2)}`);
    penalties += gosiDeduction;

    basicSalary = Math.round(basicSalary * 100) / 100;
    allowances = Math.round(allowances * 100) / 100;
    rewards = Math.round(rewards * 100) / 100;
    advances = Math.round(advances * 100) / 100;
    penalties = Math.round(penalties * 100) / 100;

    const netSalary = Math.round((basicSalary + allowances + rewards - advances - penalties) * 100) / 100;

    acc.push({
      employeeId: emp.id,
      code: emp.code,
      name: emp.name,
      nameAr: emp.nameAr,
      phone: emp.phone,
      basicSalary,
      allowances,
      rewards,
      advances,
      penalties,
      netSalary,
      notes: notes.join(' | '),
      status: 'Pending',
      paymentId: null
    });

    return acc;
  }, []);
}

export async function approveSalary({ employeeId, month, year, amounts }: { employeeId: string, month: number, year: number, amounts: any }) {
  try {
    const { companyId } = await getAuthContext();
    const branchId = await getActiveBranch();

    // Strict validation: require account mapping in PayrollSettings
    const settings = await prisma.payrollSettings.findUnique({
      where: { companyId }
    });

    if (!settings?.basicSalaryAccountId || !settings?.accruedSalariesAccountId) {
      throw new Error('يجب ربط الحسابات في إعدادات الرواتب أولاً قبل اعتماد الرواتب. اذهب إلى: الإعدادات ← إعدادات الرواتب ← ربط الحسابات');
    }

    const expenseAcc = await prisma.account.findFirst({ where: { id: settings.basicSalaryAccountId, companyId } });
    const payableAcc = await prisma.account.findFirst({ where: { id: settings.accruedSalariesAccountId, companyId } });
    const advancesAcc = settings.employeeLoansAccountId ? await prisma.account.findFirst({ where: { id: settings.employeeLoansAccountId, companyId } }) : null;
    const penaltiesAcc = settings.deductionsAccountId ? await prisma.account.findFirst({ where: { id: settings.deductionsAccountId, companyId } }) : null;

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
          dimensionValues: amounts.dimensionValues || [],
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
          dimensionValues: amounts.dimensionValues || [],
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
            date: jv.date,
            dimensionValues: amounts.dimensionValues || []
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

export async function getPaymentAccounts() {
  try {
    const { companyId } = await getAuthContext();
    const accounts = await prisma.account.findMany({
      where: { companyId, type: 'Asset' },
      select: { id: true, name: true, nameAr: true, code: true }
    });
    return accounts;
  } catch (e) {
    return [];
  }
}

export async function payPayrollBatch({ 
  month, year, employeeIds, paymentMethods, notes, reference 
}: { 
  month: number, year: number, employeeIds: string[], 
  paymentMethods: { accountId: string, amount: number }[], 
  notes?: string, reference?: string 
}) {
  try {
    const { companyId } = await getAuthContext();
    const branchId = await getActiveBranch();

    const payments = await prisma.salaryPayment.findMany({
      where: {
        companyId, month, year, employeeId: { in: employeeIds }, status: 'Approved'
      }
    });

    if (payments.length === 0) return { success: false, error: 'No approved payments found for selected employees' };

    const totalNetSalary = payments.reduce((sum, p) => sum + p.netSalary, 0);
    const totalPaid = paymentMethods.reduce((sum, pm) => sum + (Number(pm.amount) || 0), 0);

    if (Math.abs(totalNetSalary - totalPaid) > 0.1) {
      return { success: false, error: 'Payment amounts do not match total net salary' };
    }

    const settings = await prisma.payrollSettings.findUnique({ where: { companyId } });
    if (!settings || !settings.accruedSalariesAccountId) {
      return { success: false, error: 'Accrued Salaries Account is not configured in Payroll Settings' };
    }

    const jvRef = reference || `PAY-${year}-${month.toString().padStart(2, '0')}-${Date.now().toString().slice(-4)}`;
    
    const paymentsByBranch: Record<string, typeof payments> = {};
    for (const p of payments) {
      const bId = p.branchId || 'GLOBAL';
      if (!paymentsByBranch[bId]) paymentsByBranch[bId] = [];
      paymentsByBranch[bId].push(p);
    }

    await prisma.$transaction(async (tx) => {
      let index = 1;
      for (const [bId, branchPayments] of Object.entries(paymentsByBranch)) {
        const branchTotalNet = branchPayments.reduce((sum, p) => sum + p.netSalary, 0);
        const actualBranchId = bId === 'GLOBAL' ? branchId : bId;
        
        const ratio = branchTotalNet / totalNetSalary;
        const branchPaymentMethods = paymentMethods.map(pm => ({
          accountId: pm.accountId,
          amount: Math.round(Number(pm.amount) * ratio * 100) / 100
        }));
        
        const branchPaid = branchPaymentMethods.reduce((sum, pm) => sum + pm.amount, 0);
        if (Math.abs(branchTotalNet - branchPaid) >= 0.01 && branchPaymentMethods.length > 0) {
           branchPaymentMethods[0].amount = Math.round((branchPaymentMethods[0].amount + (branchTotalNet - branchPaid)) * 100) / 100;
        }

        const entries: any[] = [];
        entries.push({
          accountId: settings.accruedSalariesAccountId,
          debit: branchTotalNet,
          credit: 0,
          date: new Date(),
          description: notes || `Payroll Payment for ${month}/${year}`
        });

        for (const pm of branchPaymentMethods) {
          if (pm.amount > 0) {
            entries.push({
              accountId: pm.accountId,
              debit: 0,
              credit: pm.amount,
              date: new Date(),
              description: notes || `Payroll Payment for ${month}/${year}`
            });
          }
        }

        const jv = await tx.journalVoucher.create({
          data: {
            companyId,
            branchId: actualBranchId || undefined,
            reference: Object.keys(paymentsByBranch).length > 1 ? `${jvRef}-${index++}` : jvRef,
            date: new Date(),
            description: notes || `Payroll Payment ${month}/${year}`,
            status: 'Posted',
            entries: { create: entries }
          }
        });

        await tx.salaryPayment.updateMany({
          where: { id: { in: branchPayments.map(p => p.id) } },
          data: { status: 'Paid' }
        });
      }
    });

    revalidatePath('/salaries');
    revalidatePath('/financial');
    return { success: true };
  } catch (err: any) {
    console.error('Pay Payroll Error:', err);
    return { success: false, error: err.message };
  }
}

export async function getPayrollHistory() {
  try {
    const { companyId } = await getAuthContext();
    const branchId = await getActiveBranch();
    
    const history = await prisma.salaryPayment.groupBy({
      by: ['month', 'year'],
      where: {
        companyId,
        ...(branchId ? { branchId } : {})
      },
      _sum: {
        basicSalary: true,
        allowances: true,
        rewards: true,
        advances: true,
        penalties: true,
        netSalary: true
      },
      _count: {
        id: true
      },
      orderBy: [
        { year: 'desc' },
        { month: 'desc' }
      ]
    });
    
    return history;
  } catch (err) {
    console.error(err);
    return [];
  }
}
