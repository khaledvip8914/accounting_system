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

    // 1. Fetch active employees with their active contracts
    const employees = await prisma.employee.findMany({
      where: { companyId, status: 'Active', ...(branchId ? { branchId } : {}) },
      select: { 
        id: true, name: true, nameAr: true, code: true, basicSalary: true, joinDate: true,
        weekendDays: true, shiftStart: true, shiftEnd: true, workHoursPerDay: true,
        contracts: {
          where: { status: 'Active' },
          include: { allowances: true, deductions: true }
        }
      }
    });

    if (employees.length === 0) {
      return NextResponse.json([]);
    }

    // 2. Fetch Payroll Settings
    const settings = await prisma.payrollSettings.findUnique({
      where: { companyId }
    });
    
    // Default GOSI
    const gosiEmployeeRatio = settings?.gosiEmployeeRatio || 9.75;
    const gosiMaxSalary = settings?.gosiMaxSalary || 45000;

    // 3. Fetch financial moves for the given month/year
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of month
    
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

    // Fetch pending loan installments for this month
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

    // 4. Calculate for each employee
    const previewData = employees.reduce((acc: any[], emp) => {
      // Get from contract if exists, otherwise fallback to employee table
      const activeContract = emp.contracts && emp.contracts.length > 0 ? emp.contracts[0] : null;
      let basicSalary = activeContract ? activeContract.basicSalary : emp.basicSalary;
      
      let allowances = 0;
      let rewards = 0;
      let advances = 0;
      let penalties = 0;

      // Filter by join date
      if (emp.joinDate && new Date(emp.joinDate) > endDate) {
        return acc; // Skip this employee entirely
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

      // Fixed Allowances and Deductions from Contract
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
      
      // Parse employee weekend days (default: 5 = Friday)
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

      // Calculate days in the target cycle (up to today or month end)
      const now = new Date();
      const calculationCutoff = (now < endDate && now.getFullYear() === year && now.getMonth() === month - 1)
        ? now.getDate()
        : totalDaysInMonth;

      for (let day = 1; day <= calculationCutoff; day++) {
        const currentDate = new Date(year, month - 1, day);
        
        // Skip days before employee joined
        if (emp.joinDate && currentDate < new Date(emp.joinDate)) {
          continue;
        }

        const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday
        const isWeekend = weekendDays.includes(dayOfWeek);

        if (isWeekend) {
          continue; // Weekends are excused
        }

        // Check if day is covered by approved full leave
        const hasApprovedLeave = empLeaves.some(l => {
          if (['Permission', 'LateArrival', 'EarlyDeparture'].includes(l.type)) return false;
          const lStart = new Date(l.startDate);
          const lEnd = new Date(l.endDate);
          const startMidnight = new Date(lStart.getFullYear(), lStart.getMonth(), lStart.getDate());
          const endMidnight = new Date(lEnd.getFullYear(), lEnd.getMonth(), lEnd.getDate(), 23, 59, 59);
          return currentDate >= startMidnight && currentDate <= endMidnight;
        });

        if (hasApprovedLeave) {
          continue; // Approved vacation/leave
        }

        // Find attendance record for this day
        const att = empAttendances.find(a => {
          const aDate = new Date(a.date);
          return aDate.getFullYear() === year && aDate.getMonth() === month - 1 && aDate.getDate() === day;
        });

        if (!att || (!att.checkIn && att.status === 'ABSENT')) {
          absentDaysCount++;
        } else {
          // Present or Late
          if (att.lateMinutes && att.lateMinutes > 0) {
            totalLateMinutes += att.lateMinutes;
          }
          if (att.earlyMinutes && att.earlyMinutes > 0) {
            totalEarlyMinutes += att.earlyMinutes;
          }
        }
      }

      // Compute deductions
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

      // Aggregate financial moves for this employee (Variable - Not prorated)
      const empMoves = financialMoves.filter(m => m.employeeId === emp.id);
      
      empMoves.forEach(move => {
        if (['Allowance', 'AdvanceAddition'].includes(move.type)) { allowances += move.amount; notes.push(`بدل ${move.reason || 'إضافي'}: ${move.amount}`); }
        else if (move.type === 'Reward') { rewards += move.amount; notes.push(`مكافأة ${move.reason || ''}: ${move.amount}`); }
        else if (['Advance', 'AdvanceDeduction'].includes(move.type)) { advances += move.amount; notes.push(`سلفة ${move.reason || ''}: ${move.amount}`); }
        else if (move.type === 'Penalty') { penalties += move.amount; notes.push(`جزاء ${move.reason || ''}: ${move.amount}`); }
      });

      // Add loan installments to advances (so it is deducted from net salary)
      const empInstallments = pendingInstallments.filter((i: any) => i.loan.employeeId === emp.id);
      empInstallments.forEach((inst: any) => {
        advances += inst.amount;
        notes.push(`قسط قرض ${inst.loan.reason || ''}: ${inst.amount}`);
      });

      // Simple GOSI calculation: basic salary (capped) * employee ratio
      const gosiSalaryBase = Math.min(basicSalary + allowances, gosiMaxSalary);
      const gosiDeduction = Math.round(((gosiSalaryBase * gosiEmployeeRatio) / 100) * 100) / 100;
      if (gosiDeduction > 0) notes.push(`تأمينات اجتماعية: ${gosiDeduction.toFixed(2)}`);
      
      // Treat GOSI as a penalty/deduction for net salary calculation in preview
      penalties += gosiDeduction; 

      basicSalary = Math.round(basicSalary * 100) / 100;
      allowances = Math.round(allowances * 100) / 100;
      rewards = Math.round(rewards * 100) / 100;
      advances = Math.round(advances * 100) / 100;
      penalties = Math.round(penalties * 100) / 100;

      const netSalary = Math.round((basicSalary + allowances + rewards - advances - penalties) * 100) / 100;

      acc.push({
        employeeId: emp.id,
        employeeCode: emp.code,
        employeeName: emp.name,
        employeeNameAr: emp.nameAr,
        basicSalary,
        allowances,
        rewards,
        advances,
        penalties,
        gosiDeduction,
        netSalary,
        absentDays: absentDaysCount,
        lateMinutes: totalLateMinutes + totalEarlyMinutes,
        notes: notes.join(' | ')
      });

      return acc;
    }, []);

    return NextResponse.json(previewData);
  } catch (error: any) {
    console.error('Error generating payroll preview:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
