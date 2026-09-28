import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { getActiveBranch } from '@/lib/branch';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { companyId } = session.user;
    const { month, year } = await request.json();
    const branchId = await getActiveBranch();

    if (!month || !year) {
      return NextResponse.json({ error: 'Month and year are required' }, { status: 400 });
    }

    // Check if payroll already run for this month/year
    const existingPayments = await prisma.salaryPayment.findFirst({
      where: { companyId, month, year }
    });

    if (existingPayments) {
      return NextResponse.json({ error: 'Payroll already generated for this month and year' }, { status: 400 });
    }

    const employees = await prisma.employee.findMany({
      where: { companyId, status: 'Active', ...(branchId ? { branchId } : {}) },
      include: {
        contracts: {
          where: { status: 'Active' },
          include: { allowances: true, deductions: true }
        }
      }
    });

    if (employees.length === 0) {
      return NextResponse.json({ error: 'No active employees found' }, { status: 400 });
    }

    const settings = await prisma.payrollSettings.findUnique({
      where: { companyId }
    });

    // Strict validation: require account mapping before payroll can run
    const missingAccounts: string[] = [];
    if (!settings) {
      missingAccounts.push('لم يتم إنشاء إعدادات الرواتب بعد. اذهب إلى: الإعدادات ← إعدادات الرواتب');
    } else {
      if (!settings.basicSalaryAccountId) missingAccounts.push('حساب الرواتب الأساسية (Basic Salary Expense)');
      if (!settings.accruedSalariesAccountId) missingAccounts.push('حساب الرواتب المستحقة (Accrued Salaries Liability)');
      if (!settings.allowancesAccountId) missingAccounts.push('حساب البدلات (Allowances Expense)');
      if (!settings.deductionsAccountId) missingAccounts.push('حساب الخصومات (Deductions)');
    }

    if (missingAccounts.length > 0) {
      return NextResponse.json({ 
        error: `يجب ربط الحسابات التالية في إعدادات الرواتب قبل إصدار المسير:\n${missingAccounts.join('\n')}\n\nاذهب إلى: الإعدادات ← إعدادات الرواتب ← ربط الحسابات`
      }, { status: 400 });
    }

    const gosiEmployeeRatio = settings!.gosiEmployeeRatio || 9.75;
    const gosiCompanyRatio = settings!.gosiCompanyRatio || 11.75;
    const gosiMaxSalary = settings!.gosiMaxSalary || 45000;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const financialMovesWhere: any = {
      companyId,
      date: { gte: new Date(year, month - 1, 1), lt: new Date(year, month, 1) },
      status: { in: ['Confirmed', 'Approved'] },
      includeInPayroll: true
    };
    if (branchId) financialMovesWhere.branchId = branchId;

    const financialMoves = await prisma.employeeFinancialMove.findMany({
      where: financialMovesWhere
    });

    const pendingInstallments = await prisma.loanInstallment.findMany({
      where: {
        loan: { companyId },
        month: Number(month),
        year: Number(year),
        status: 'Pending'
      },
      include: { loan: true }
    });

    // Fetch attendance records for this month
    const attendances = await prisma.employeeAttendance.findMany({
      where: {
        companyId,
        date: { gte: startDate, lte: endDate }
      }
    });

    // Fetch approved leaves and permissions for this month
    const leaves = await prisma.employeeLeave.findMany({
      where: {
        companyId,
        status: 'Approved',
        startDate: { lte: endDate },
        endDate: { gte: startDate }
      }
    });

    // Use transaction to save all
    const result = await prisma.$transaction(async (tx) => {
      const generatedPayments = [];

      for (const emp of employees) {
        const activeContract = emp.contracts && emp.contracts.length > 0 ? emp.contracts[0] : null;
        let basicSalary = activeContract ? activeContract.basicSalary : emp.basicSalary;
        
        let allowances = 0;
        let rewards = 0;
        let advances = 0;
        let penalties = 0;

        // Filter by join date
        if (emp.joinDate && new Date(emp.joinDate) > endDate) {
          continue; // Skip this employee entirely
        }

        // Calculate Proration Factor
        const totalDaysInMonth = endDate.getDate();
        let workedDays = totalDaysInMonth;
        if (emp.joinDate && new Date(emp.joinDate) > startDate) {
          const join = new Date(emp.joinDate);
          workedDays = endDate.getDate() - join.getDate() + 1;
        }
        const prorationFactor = workedDays / totalDaysInMonth;

        // Prorate Basic Salary
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

        // =========================================================================
        // AUTOMATED ATTENDANCE & LATENESS CALCULATION (حساب الحضور والغياب والتأخير)
        // =========================================================================
        const empAttendances = attendances.filter(a => a.employeeId === emp.id);
        const empLeaves = leaves.filter(l => l.employeeId === emp.id);
        
        const weekendDays: number[] = emp.weekendDays 
          ? String(emp.weekendDays).split(',').map(d => Number(d.trim())).filter(n => !isNaN(n))
          : [5];

        // Dynamic month length (28, 29, 30, or 31 days based on exact year and month)
        const dailyRate = totalDaysInMonth > 0 ? (basicSalary / totalDaysInMonth) : (basicSalary / 30);
        const hourlyRate = dailyRate / (emp.workHoursPerDay || 8);
        const minuteRate = hourlyRate / 60;

        let totalLateMinutes = 0;
        let totalEarlyMinutes = 0;
        let absentDaysCount = 0;

        const now = new Date();
        const calculationCutoff = (now < endDate && now.getFullYear() === year && now.getMonth() === month - 1)
          ? now.getDate()
          : totalDaysInMonth;

        for (let day = 1; day <= calculationCutoff; day++) {
          const currentDate = new Date(year, month - 1, day);
          if (emp.joinDate && currentDate < new Date(emp.joinDate)) continue;

          const dayOfWeek = currentDate.getDay();
          if (weekendDays.includes(dayOfWeek)) continue; // Excused rest day

          const hasApprovedLeave = empLeaves.some(l => {
            if (['Permission', 'LateArrival', 'EarlyDeparture'].includes(l.type)) return false;
            const lStart = new Date(l.startDate);
            const lEnd = new Date(l.endDate);
            const startMidnight = new Date(lStart.getFullYear(), lStart.getMonth(), lStart.getDate());
            const endMidnight = new Date(lEnd.getFullYear(), lEnd.getMonth(), lEnd.getDate(), 23, 59, 59);
            return currentDate >= startMidnight && currentDate <= endMidnight;
          });

          if (hasApprovedLeave) continue;

          const att = empAttendances.find(a => {
            const aDate = new Date(a.date);
            return aDate.getFullYear() === year && aDate.getMonth() === month - 1 && aDate.getDate() === day;
          });

          if (!att || (!att.checkIn && att.status === 'ABSENT')) {
            absentDaysCount++;
          } else {
            if (att.lateMinutes && att.lateMinutes > 0) totalLateMinutes += att.lateMinutes;
            if (att.earlyMinutes && att.earlyMinutes > 0) totalEarlyMinutes += att.earlyMinutes;
          }
        }

        const absentDeduction = Math.round(absentDaysCount * dailyRate * 100) / 100;
        const lateDeduction = Math.round((totalLateMinutes + totalEarlyMinutes) * minuteRate * 100) / 100;

        if (absentDaysCount > 0) {
          penalties += absentDeduction;
          notes.push(`خصم غياب (${absentDaysCount} يوم): -${absentDeduction.toFixed(2)} SAR`);
        }

        if (totalLateMinutes > 0 || totalEarlyMinutes > 0) {
          penalties += lateDeduction;
          notes.push(`خصم تأخير/انصراف مبكر (${totalLateMinutes + totalEarlyMinutes} دقيقة): -${lateDeduction.toFixed(2)} SAR`);
        }

        const empMoves = financialMoves.filter(m => m.employeeId === emp.id);
        empMoves.forEach(move => {
          if (['Allowance', 'AdvanceAddition'].includes(move.type)) { allowances += move.amount; notes.push(`بدل ${move.reason || 'إضافي'}: ${move.amount}`); }
          else if (move.type === 'Reward') { rewards += move.amount; notes.push(`مكافأة ${move.reason || ''}: ${move.amount}`); }
          else if (['Advance', 'AdvanceDeduction'].includes(move.type)) { advances += move.amount; notes.push(`سلفة ${move.reason || ''}: ${move.amount}`); }
          else if (move.type === 'Penalty') { penalties += move.amount; notes.push(`جزاء ${move.reason || ''}: ${move.amount}`); }
        });

        // Add loan installments to advances and update their status
        const empInstallments = pendingInstallments.filter((i: any) => i.loan.employeeId === emp.id);
        for (const inst of empInstallments) {
          advances += inst.amount;
          notes.push(`قسط قرض ${inst.loan.reason || ''}: ${inst.amount}`);

          await tx.loanInstallment.update({
            where: { id: inst.id },
            data: { status: 'Deducted' }
          });

          const updatedRemaining = parseFloat((inst.loan.remainingAmount - inst.amount).toFixed(2));
          await tx.employeeLoan.update({
            where: { id: inst.loanId },
            data: {
              remainingAmount: updatedRemaining,
              status: updatedRemaining <= 0 ? 'Settled' : 'Active'
            }
          });
        }

        const gosiSalaryBase = Math.min(basicSalary + allowances, gosiMaxSalary);
        const gosiEmployeeDeduction = Math.round(((gosiSalaryBase * gosiEmployeeRatio) / 100) * 100) / 100;
        const gosiCompanyShare = Math.round(((gosiSalaryBase * gosiCompanyRatio) / 100) * 100) / 100;
        if (gosiEmployeeDeduction > 0) notes.push(`تأمينات اجتماعية: ${gosiEmployeeDeduction.toFixed(2)}`);

        penalties += gosiEmployeeDeduction;

        basicSalary = Math.round(basicSalary * 100) / 100;
        allowances = Math.round(allowances * 100) / 100;
        rewards = Math.round(rewards * 100) / 100;
        advances = Math.round(advances * 100) / 100;
        penalties = Math.round(penalties * 100) / 100;

        const netSalary = Math.round((basicSalary + allowances + rewards - advances - penalties) * 100) / 100;

        // Create Journal Voucher
        const jvRef = `PR-${year}-${month.toString().padStart(2, '0')}-${emp.code}`;
        
        const entries = [];
        
        // Debit: Basic Salary Expense
        if (basicSalary > 0) {
          entries.push({ accountId: settings!.basicSalaryAccountId!, debit: basicSalary, credit: 0, date: endDate, description: `Basic Salary ${month}/${year}` });
        }
        
        // Debit: Allowances & Rewards Expense
        const totalAllowancesAndRewards = allowances + rewards;
        if (totalAllowancesAndRewards > 0 && settings!.allowancesAccountId) {
          entries.push({ accountId: settings!.allowancesAccountId, debit: totalAllowancesAndRewards, credit: 0, date: endDate, description: `Allowances & Rewards ${month}/${year}` });
        }
        
        // Debit: GOSI Company Expense
        if (gosiCompanyShare > 0 && settings!.gosiCompanyExpenseAccountId) {
          entries.push({ accountId: settings!.gosiCompanyExpenseAccountId, debit: gosiCompanyShare, credit: 0, date: endDate, description: `GOSI Company Share ${month}/${year}` });
        }

        // Credit: Advances/Loans (Repayment)
        if (advances > 0 && settings!.employeeLoansAccountId) {
          entries.push({ accountId: settings!.employeeLoansAccountId, debit: 0, credit: advances, date: endDate, description: `Advance Repayment ${month}/${year}` });
        }

        // Credit: Deductions / Penalties (Non-GOSI)
        const nonGosiPenalties = penalties - gosiEmployeeDeduction;
        if (nonGosiPenalties > 0 && settings!.deductionsAccountId) {
          entries.push({ accountId: settings!.deductionsAccountId, debit: 0, credit: nonGosiPenalties, date: endDate, description: `Penalties ${month}/${year}` });
        }

        // Credit: GOSI Payable (Employee + Company share)
        const totalGosiPayable = gosiEmployeeDeduction + gosiCompanyShare;
        if (totalGosiPayable > 0 && settings!.gosiPayableAccountId) {
          entries.push({ accountId: settings!.gosiPayableAccountId, debit: 0, credit: totalGosiPayable, date: endDate, description: `GOSI Payable ${month}/${year}` });
        }

        // Credit: Accrued Salaries (Net Salary to be paid to employee)
        if (netSalary > 0) {
          entries.push({ accountId: settings!.accruedSalariesAccountId!, debit: 0, credit: netSalary, date: endDate, description: `Accrued Net Salary ${month}/${year}` });
        }

        const jv = await tx.journalVoucher.create({
          data: {
            companyId,
            branchId: emp.branchId || branchId || undefined,
            reference: jvRef,
            date: endDate,
            description: `Payroll for ${emp.name} - ${month}/${year}`,
            status: 'Posted',
            entries: {
              create: entries
            }
          }
        });

        // Create Salary Payment
        const payment = await tx.salaryPayment.create({
          data: {
            companyId,
            branchId: emp.branchId || branchId || undefined,
            employeeId: emp.id,
            month,
            year,
            basicSalary,
            allowances,
            rewards,
            advances,
            penalties,
            netSalary,
            notes: notes.join(' | '),
            status: 'Approved',
            journalVoucherId: jv.id
          }
        });

        generatedPayments.push(payment);
      }

      return generatedPayments;
    });

    return NextResponse.json({ success: true, count: result.length });
  } catch (error: any) {
    console.error('Error committing payroll:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
