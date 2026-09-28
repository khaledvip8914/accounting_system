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

export async function createEmployee(data: any) {
  try {
    const { companyId } = await getAuthContext();
    let finalCode = data.code;
    
    // Auto-generate code if empty (scoped to company)
    if (!finalCode) {
      const count = await prisma.employee.count({ where: { companyId } });
      finalCode = `EMP-${(count + 1).toString().padStart(3, '0')}`;
    }

    const assignedBranchId = data.branchId !== undefined ? (data.branchId || null) : ((await getActiveBranch()) || null);

    const newEmployee = await prisma.employee.create({
      data: {
        companyId,
        branchId: assignedBranchId,
        code: finalCode,
        name: data.name,
        nameAr: data.nameAr,
        jobTitle: data.jobTitle,
        jobTitleAr: data.jobTitleAr,
        department: data.department,
        phone: data.phone,
        photoUrl: data.photoUrl,
        basicSalary: data.basicSalary,
        idNumber: data.idNumber,
        idExpiry: data.idExpiry ? new Date(data.idExpiry) : null,
        joinDate: data.joinDate ? new Date(data.joinDate) : new Date(),
        status: data.status || 'Active',
        biometricId: data.biometricId || null,
        appPassword: data.appPassword ? data.appPassword.trim() : null,
        weekendDays: data.weekendDays ? (Array.isArray(data.weekendDays) ? data.weekendDays.join(',') : data.weekendDays) : '5',
        shiftStart: data.shiftStart || '09:00',
        shiftEnd: data.shiftEnd || '17:00',
        workHoursPerDay: data.workHoursPerDay ? parseFloat(data.workHoursPerDay) : 8,
        workLat: data.allowFieldWork ? null : (data.workLat ? parseFloat(data.workLat) : null),
        workLng: data.allowFieldWork ? null : (data.workLng ? parseFloat(data.workLng) : null),
        workRadius: data.workRadius ? parseFloat(data.workRadius) : 100,
        customFields: {
          allowFieldWork: !!data.allowFieldWork
        }
      }
    });

    // Auto-generate employee account in Chart of Accounts
    await getOrCreateEmployeeAccount(companyId, newEmployee.code, newEmployee.name, newEmployee.nameAr || newEmployee.name);

    revalidatePath('/employees');
    revalidatePath('/salaries');
    return { success: true };
  } catch (err: any) {
    console.error('Create Employee Error:', err);
    return { success: false, error: err.message };
  }
}

export async function updateEmployee(id: string, data: any) {
  try {
    const { companyId } = await getAuthContext();
    const existing = await prisma.employee.findUnique({ where: { id } });
    const existingCustomFields = (existing?.customFields as any) || {};
    
    await prisma.employee.update({
      where: { id, companyId },
      data: {
        code: data.code,
        branchId: data.branchId !== undefined ? (data.branchId || null) : undefined,
        name: data.name,
        nameAr: data.nameAr,
        jobTitle: data.jobTitle,
        jobTitleAr: data.jobTitleAr,
        department: data.department,
        phone: data.phone,
        photoUrl: data.photoUrl,
        basicSalary: data.basicSalary,
        idNumber: data.idNumber,
        idExpiry: data.idExpiry ? new Date(data.idExpiry) : null,
        joinDate: data.joinDate ? new Date(data.joinDate) : undefined,
        status: data.status,
        biometricId: data.biometricId || null,
        appPassword: data.appPassword !== undefined ? (data.appPassword ? data.appPassword.trim() : null) : undefined,
        weekendDays: data.weekendDays ? (Array.isArray(data.weekendDays) ? data.weekendDays.join(',') : data.weekendDays) : undefined,
        shiftStart: data.shiftStart || undefined,
        shiftEnd: data.shiftEnd || undefined,
        workHoursPerDay: data.workHoursPerDay !== undefined ? parseFloat(data.workHoursPerDay) : undefined,
        workLat: data.allowFieldWork ? null : (data.workLat !== undefined ? (data.workLat ? parseFloat(data.workLat) : null) : undefined),
        workLng: data.allowFieldWork ? null : (data.workLng !== undefined ? (data.workLng ? parseFloat(data.workLng) : null) : undefined),
        workRadius: data.workRadius !== undefined ? (data.workRadius ? parseFloat(data.workRadius) : 100) : undefined,
        customFields: {
          ...existingCustomFields,
          allowFieldWork: !!data.allowFieldWork
        }
      }
    });

    revalidatePath('/employees');
    revalidatePath('/salaries');
    return { success: true };
  } catch (err: any) {
    console.error('Update Employee Error:', err);
    return { success: false, error: err.message };
  }
}

async function getOrCreateAccount(companyId: string, code: string, name: string, type: string, nameAr?: string, description?: string) {
  let acc = await prisma.account.findFirst({ where: { companyId, code } });
  if (!acc) {
    acc = await prisma.account.create({ data: { companyId, code, name, type, nameAr, description } });
  }
  return acc;
}

async function getOrCreateEmployeeAccount(companyId: string, empCode: string, name: string, nameAr: string) {
  let parentAcc = await prisma.account.findFirst({ where: { companyId, code: '1300' } });
  if (!parentAcc) {
    parentAcc = await prisma.account.create({ data: { companyId, code: '1300', name: 'Employee Advances & Allowances', nameAr: 'سلف وبدلات الموظفين', type: 'Asset' } });
  }

  const accountCode = `1300-${empCode}`;
  let empAcc = await prisma.account.findFirst({ where: { companyId, code: accountCode } });
  if (!empAcc) {
    empAcc = await prisma.account.create({
      data: {
        companyId,
        code: accountCode,
        name: `Current Account: ${name}`,
        nameAr: `حساب جاري: ${nameAr}`,
        type: 'Asset',
        parentId: parentAcc.id
      }
    });
  }
  return empAcc;
}

export async function createFinancialMove(data: any) {
  try {
    const { companyId } = await getAuthContext();
    
    const employee = await prisma.employee.findFirst({
        where: { id: data.employeeId, companyId }
    });
    if (!employee) throw new Error('Employee not found or unauthorized');

    const amount = parseFloat(data.amount);

    // Get or Create standard accounts
    const cashAcc = await getOrCreateAccount(companyId, '1000', 'Cash', 'Asset');
    const advancesAcc = await getOrCreateEmployeeAccount(companyId, employee.code, employee.name, employee.nameAr || employee.name);
    const expAcc = await getOrCreateAccount(companyId, '5000', 'Operating Expense', 'Expense');
    const penaltiesFundAcc = await getOrCreateAccount(companyId, '2110', 'Penalties Fund', 'Liability', 'صندوق جزاءات الموظفين', 'مخصصات وجزاءات الموظفين');
    const penaltiesReceivableAcc = await getOrCreateAccount(companyId, '1151', 'Penalties Receivable', 'Asset', 'ذمم جزاءات الموظفين', 'مستحقات جزاءات على الموظفين');

    let debitAccountId = '';
    let creditAccountId = '';
    
    if (data.type === 'Advance' || data.type === 'AdvanceAddition') {
      debitAccountId = advancesAcc.id; 
      creditAccountId = cashAcc.id;    
    } else if (data.type === 'AdvanceDeduction') {
      debitAccountId = cashAcc.id;       
      creditAccountId = advancesAcc.id;  
    } else if (data.type === 'Penalty') {
      debitAccountId = penaltiesReceivableAcc.id; // Asset: Employee owes the penalty
      creditAccountId = penaltiesFundAcc.id;     // Liability: Fund for employees
      } else if (data.type === 'Reward' || data.type === 'Allowance') {
        debitAccountId = expAcc.id;      // Increase expense
        creditAccountId = advancesAcc.id; // We owe employee
      }

      const branchId = await getActiveBranch();
      
      const includeInPayroll = data.type === 'Penalty' ? true : (data.includeInPayroll !== undefined ? data.includeInPayroll : true);
      const needsJV = !includeInPayroll || data.type.startsWith('Advance');
      
      let jvId = null;
      if (needsJV) {
        const jv = await prisma.journalVoucher.create({
          data: {
            companyId,
            branchId,
            reference: `HR-${Date.now()}`,
            date: data.date ? new Date(data.date) : new Date(),
            description: data.reason || `HR Transaction: ${data.type} for ${employee.name}`,
            status: data.status === 'Confirmed' ? 'Posted' : 'Draft',
            entries: {
              create: [
                { date: data.date ? new Date(data.date) : new Date(), accountId: debitAccountId, debit: amount, credit: 0, description: data.reason || data.type, dimensionValues: data.dimensionValues || [] },
                { date: data.date ? new Date(data.date) : new Date(), accountId: creditAccountId, debit: 0, credit: amount, description: data.reason || data.type, dimensionValues: data.dimensionValues || [] }
              ]
            }
          }
        });
        jvId = jv.id;
      }

        const newMove = await prisma.employeeFinancialMove.create({
          data: {
            companyId,
            branchId: employee.branchId || (await getActiveBranch()) || null,
            employeeId: data.employeeId,
          type: data.type, 
          amount,
          date: data.date ? new Date(data.date) : new Date(),
          reason: data.reason,
          status: data.status || 'Pending',
          includeInPayroll,
          dimensionValues: data.dimensionValues || [],
          journalVoucherId: jvId
        },
        include: { employee: true }
      });

    revalidatePath('/employees');
    revalidatePath('/salaries');
    revalidatePath('/ledger');
    return { success: true, move: newMove };
  } catch (err: any) {
    console.error('Create Financial Move Error:', err);
    return { success: false, error: err.message };
  }
}

export async function updateFinancialMove(data: any) {
  try {
    const { companyId } = await getAuthContext();

    const move = await prisma.employeeFinancialMove.findFirst({
       where: { id: data.id, companyId },
       include: { employee: true }
    });
    if (!move || !move.employee) throw new Error('Not found');

    const amount = parseFloat(data.amount);

    const includeInPayroll = data.type === 'Penalty' ? true : (data.includeInPayroll !== undefined ? data.includeInPayroll : true);
    const needsJV = !includeInPayroll || data.type.startsWith('Advance');
    let finalJvId = move.journalVoucherId;

    if (needsJV) {
      const cashAcc = await getOrCreateAccount(companyId, '1000', 'Cash', 'Asset');
      const advancesAcc = await getOrCreateEmployeeAccount(companyId, move.employee.code, move.employee.name, move.employee.nameAr || move.employee.name);
      const expAcc = await getOrCreateAccount(companyId, '5000', 'Operating Expense', 'Expense');
      const penaltiesFundAcc = await getOrCreateAccount(companyId, '2110', 'Penalties Fund', 'Liability', 'صندوق جزاءات الموظفين', 'مخصصات وجزاءات الموظفين');
      const penaltiesReceivableAcc = await getOrCreateAccount(companyId, '1151', 'Penalties Receivable', 'Asset', 'ذمم جزاءات الموظفين', 'مستحقات جزاءات على الموظفين');

      let debitAccountId = '';
      let creditAccountId = '';
      
      if (data.type === 'Advance' || data.type === 'AdvanceAddition') {
        debitAccountId = advancesAcc.id; creditAccountId = cashAcc.id;    
      } else if (data.type === 'AdvanceDeduction') {
        debitAccountId = cashAcc.id; creditAccountId = advancesAcc.id;  
      } else if (data.type === 'Penalty') {
        debitAccountId = penaltiesReceivableAcc.id; creditAccountId = penaltiesFundAcc.id; 
      } else if (data.type === 'Reward' || data.type === 'Allowance') {
        debitAccountId = expAcc.id; creditAccountId = advancesAcc.id; 
      }

      if (move.journalVoucherId) {
        await prisma.journalEntry.deleteMany({ where: { journalVoucherId: move.journalVoucherId } });
        await prisma.journalVoucher.update({
           where: { id: move.journalVoucherId },
           data: {
              date: data.date ? new Date(data.date) : new Date(),
              description: data.reason || `HR Transaction: ${data.type}`,
              status: data.status === 'Confirmed' ? 'Posted' : 'Draft',
              entries: {
                 create: [
                   { date: data.date ? new Date(data.date) : new Date(), accountId: debitAccountId, debit: amount, credit: 0, description: data.reason || data.type, dimensionValues: data.dimensionValues || [] },
                   { date: data.date ? new Date(data.date) : new Date(), accountId: creditAccountId, debit: 0, credit: amount, description: data.reason || data.type, dimensionValues: data.dimensionValues || [] }
                 ]
              }
           }
        });
      } else {
        const branchId = await getActiveBranch();
        const jv = await prisma.journalVoucher.create({
          data: {
            companyId,
            branchId,
            reference: `HR-${Date.now()}`,
            date: data.date ? new Date(data.date) : new Date(),
            description: data.reason || `HR Transaction: ${data.type} for ${move.employee.name}`,
            status: data.status === 'Confirmed' ? 'Posted' : 'Draft',
            entries: {
              create: [
                { date: data.date ? new Date(data.date) : new Date(), accountId: debitAccountId, debit: amount, credit: 0, description: data.reason || data.type, dimensionValues: data.dimensionValues || [] },
                { date: data.date ? new Date(data.date) : new Date(), accountId: creditAccountId, debit: 0, credit: amount, description: data.reason || data.type, dimensionValues: data.dimensionValues || [] }
              ]
            }
          }
        });
        finalJvId = jv.id;
      }
    } else {
      if (move.journalVoucherId) {
        await prisma.journalEntry.deleteMany({ where: { journalVoucherId: move.journalVoucherId } });
        await prisma.journalVoucher.delete({ where: { id: move.journalVoucherId } });
        finalJvId = null;
      }
    }

    const updatedMove = await prisma.employeeFinancialMove.update({
      where: { id: data.id, companyId },
      data: {
        employeeId: data.employeeId,
        branchId: move.employee.branchId || (await getActiveBranch()) || null,
        type: data.type,
        amount,
        date: data.date ? new Date(data.date) : new Date(),
        reason: data.reason,
        status: data.status,
        includeInPayroll: data.includeInPayroll !== undefined ? data.includeInPayroll : true,
        dimensionValues: data.dimensionValues || [],
        journalVoucherId: finalJvId
      },
      include: { employee: true }
    });

    revalidatePath('/employees');
    revalidatePath('/salaries');
    revalidatePath('/ledger');
    return { success: true, move: updatedMove };
  } catch (err: any) {
    console.error('Update Financial Move Error:', err);
    return { success: false, error: err.message };
  }
}

export async function deleteFinancialMove({ id }: { id: string }) {
  try {
    const { companyId } = await getAuthContext();

    const move = await prisma.employeeFinancialMove.findFirst({ where: { id, companyId } });
    if (move && move.journalVoucherId) {
       await prisma.journalEntry.deleteMany({ where: { journalVoucherId: move.journalVoucherId } });
       await prisma.journalVoucher.delete({ where: { id: move.journalVoucherId } });
    }

    await prisma.employeeFinancialMove.delete({
      where: { id, companyId }
    });
    
    revalidatePath('/employees');
    revalidatePath('/salaries');
    revalidatePath('/ledger');
    return { success: true };
  } catch (err: any) {
    console.error('Delete Financial Move Error:', err);
    return { success: false, error: err.message };
  }
}

export async function approveFinancialMove({ id }: { id: string }) {
  try {
    const { companyId } = await getAuthContext();

    const move = await prisma.employeeFinancialMove.findFirst({ where: { id, companyId } });
    if (move && move.journalVoucherId) {
       await prisma.journalVoucher.update({
         where: { id: move.journalVoucherId },
         data: { status: 'Posted' }
       });
    }

    await prisma.employeeFinancialMove.update({
      where: { id, companyId },
      data: { status: 'Confirmed' }
    });
    
    revalidatePath('/employees');
    revalidatePath('/salaries');
    revalidatePath('/ledger');
    return { success: true };
  } catch (err: any) {
    console.error('Approve Financial Move Error:', err);
    return { success: false, error: err.message };
  }
}

export async function createEmployeeLeave(data: any) {
  try {
    const { companyId } = await getAuthContext();
    const leave = await prisma.employeeLeave.create({
      data: {
        companyId,
        employeeId: data.employeeId,
        type: data.type,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        reason: data.reason,
        status: data.status || 'Pending'
      },
      include: { employee: true }
    });
    revalidatePath('/employees');
    return { success: true, leave };
  } catch (err: any) {
    console.error('Create Leave Error:', err);
    return { success: false, error: err.message };
  }
}

export async function updateEmployeeLeave(data: any) {
  try {
    const { companyId } = await getAuthContext();
    const leave = await prisma.employeeLeave.update({
      where: { id: data.id, companyId },
      data: {
        type: data.type,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        reason: data.reason,
        status: data.status || 'Pending'
      },
      include: { employee: true }
    });
    revalidatePath('/employees');
    return { success: true, leave };
  } catch (err: any) {
    console.error('Update Leave Error:', err);
    return { success: false, error: err.message };
  }
}

export async function deleteEmployeeLeave({ id }: { id: string }) {
  try {
    const { companyId } = await getAuthContext();
    await prisma.employeeLeave.delete({
      where: { id, companyId }
    });
    revalidatePath('/employees');
    return { success: true };
  } catch (err: any) {
    console.error('Delete Leave Error:', err);
    return { success: false, error: err.message };
  }
}

export async function updateEmployeeLeaveStatus({ id, status }: { id: string, status: string }) {
  try {
    const { companyId } = await getAuthContext();
    const leave = await prisma.employeeLeave.update({
      where: { id, companyId },
      data: { status },
      include: { employee: true }
    });
    revalidatePath('/employees');
    return { success: true, leave };
  } catch (err: any) {
    console.error('Update Leave Status Error:', err);
    return { success: false, error: err.message };
  }
}

// ==========================================
// ATTENDANCE ACTIONS
// ==========================================

export async function getAttendances(filters?: { date?: string; startDate?: string; endDate?: string; employeeId?: string }) {
  try {
    const { companyId } = await getAuthContext();
    const branchId = await getActiveBranch();
    const where: any = { companyId };

    // Branch isolation for attendance records
    if (branchId) {
      const activeBranch = await prisma.branch.findUnique({ where: { id: branchId } });
      if (activeBranch?.isMain) {
        where.employee = {
          OR: [
            { branchId: branchId },
            { branchId: null }
          ]
        };
      } else {
        where.employee = { branchId: branchId };
      }
    }

    if (filters?.employeeId && filters.employeeId !== 'ALL') {
      where.employeeId = filters.employeeId;
    }

    let startOfDay: Date;
    let endOfDay: Date;

    if (filters?.date) {
      const [y, m, d] = filters.date.split('-').map(Number);
      startOfDay = new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
      endOfDay = new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999));
    } else {
      const now = new Date();
      startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
      endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));
    }

    // Broad window to guarantee matching regardless of server UTC vs local timezone offsets (+- 12h)
    const queryStart = new Date(startOfDay.getTime() - 12 * 60 * 60 * 1000);
    const queryEnd = new Date(endOfDay.getTime() + 12 * 60 * 60 * 1000);

    where.date = { gte: queryStart, lte: queryEnd };

    const attendances = await prisma.employeeAttendance.findMany({
      where,
      include: {
        employee: {
          select: { 
            id: true, 
            name: true, 
            nameAr: true, 
            code: true, 
            department: true, 
            jobTitle: true, 
            jobTitleAr: true, 
            weekendDays: true, 
            workLat: true, 
            workLng: true, 
            workRadius: true,
            shiftStart: true,
            shiftEnd: true,
            workHoursPerDay: true,
            basicSalary: true,
            status: true
          }
        }
      },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }]
    });

    // Also fetch all active employees to dynamically synthesize status for anyone who hasn't punched
    const empWhere: any = { companyId, status: 'Active' };
    if (branchId) {
      const activeBranch = await prisma.branch.findUnique({ where: { id: branchId } });
      if (activeBranch?.isMain) {
        empWhere.OR = [{ branchId: branchId }, { branchId: null }];
      } else {
        empWhere.branchId = branchId;
      }
    }
    if (filters?.employeeId && filters.employeeId !== 'ALL') {
      empWhere.id = filters.employeeId;
    }

    const allEmployees = await prisma.employee.findMany({
      where: empWhere,
      select: {
        id: true,
        name: true,
        nameAr: true,
        code: true,
        department: true,
        jobTitle: true,
        jobTitleAr: true,
        weekendDays: true,
        workLat: true,
        workLng: true,
        workRadius: true,
        shiftStart: true,
        shiftEnd: true,
        workHoursPerDay: true,
        basicSalary: true,
        status: true,
        joinDate: true
      }
    });

    const leaves = await prisma.employeeLeave.findMany({
      where: {
        companyId,
        status: 'Approved',
        startDate: { lte: endOfDay },
        endDate: { gte: startOfDay }
      }
    });

    const now = new Date();
    const isToday = (now.getFullYear() === startOfDay.getFullYear() && now.getMonth() === startOfDay.getMonth() && now.getDate() === startOfDay.getDate());
    const dayOfWeek = startOfDay.getDay();

    const fullRecords: any[] = [];

    for (const emp of allEmployees) {
      if (emp.joinDate && startOfDay < new Date(emp.joinDate)) {
        continue; // Employee hadn't joined yet
      }

      const existingAtt = attendances.find(a => a.employeeId === emp.id);

      const weekendDays: number[] = emp.weekendDays 
        ? String(emp.weekendDays).split(',').map(d => Number(d.trim())).filter(n => !isNaN(n))
        : [5];
      const isWeekend = weekendDays.includes(dayOfWeek);

      const hasApprovedLeave = leaves.some(l => {
        if (l.employeeId !== emp.id) return false;
        if (['Permission', 'LateArrival', 'EarlyDeparture'].includes(l.type)) return false;
        return true;
      });

      if (existingAtt) {
        // Compute interactive status
        let computedStatus = existingAtt.status;
        if (existingAtt.checkIn) {
          if (existingAtt.lateMinutes && existingAtt.lateMinutes > 0) {
            computedStatus = 'LATE';
          } else {
            computedStatus = 'PRESENT';
          }
        }
        fullRecords.push({
          ...existingAtt,
          status: computedStatus
        });
      } else {
        // Employee has NOT punched yet today
        let status = 'NOT_ARRIVED'; // لم يحضر بعد
        let lateMinutes = 0;

        if (isWeekend) {
          status = 'WEEKEND'; // عطلة أسبوعية
        } else if (hasApprovedLeave) {
          status = 'ON_LEAVE'; // إجازة رسمية
        } else {
          // Check shift schedule
          const shiftStartStr = emp.shiftStart || '09:00';
          const [shH, shM] = shiftStartStr.split(':').map(Number);
          const shiftStartDate = new Date(startOfDay.getFullYear(), startOfDay.getMonth(), startOfDay.getDate(), shH, shM, 0);

          if (isToday) {
            const diffMinutes = Math.floor((now.getTime() - shiftStartDate.getTime()) / (1000 * 60));
            // If more than 60 minutes past shift start -> Absent (غائب)
            if (diffMinutes >= 60) {
              status = 'ABSENT';
            } else if (diffMinutes > 10) {
              status = 'LATE_PENDING'; // متأخر (لم يسجل بعد وتجاوز وقت الدوام)
              lateMinutes = diffMinutes;
            } else {
              status = 'NOT_ARRIVED'; // بانتظار الحضور
            }
          } else if (startOfDay < now) {
            // Past day without attendance -> Definite Absent (غائب)
            status = 'ABSENT';
          }
        }

        fullRecords.push({
          id: `virtual_${emp.id}_${startOfDay.toISOString()}`,
          companyId,
          employeeId: emp.id,
          employee: emp,
          date: startOfDay,
          checkIn: null,
          checkOut: null,
          workMinutes: 0,
          lateMinutes,
          earlyMinutes: 0,
          source: 'SYSTEM',
          status,
          isVirtual: true
        });
      }
    }

    return { success: true, attendances: fullRecords };
  } catch (err: any) {
    console.error('Get Attendances Error:', err);
    return { success: false, error: err.message, attendances: [] };
  }
}

export async function getMonthlyAttendanceReport(year: number, month: number, branchIdFilter?: string) {
  try {
    const { companyId } = await getAuthContext();
    const branchId = branchIdFilter || await getActiveBranch();

    const empWhere: any = { companyId };
    if (branchId) {
      const activeBranch = await prisma.branch.findUnique({ where: { id: branchId } });
      if (activeBranch?.isMain) {
        empWhere.OR = [{ branchId: branchId }, { branchId: null }];
      } else {
        empWhere.branchId = branchId;
      }
    }

    const employees = await prisma.employee.findMany({
      where: empWhere,
      include: { branch: true },
      orderBy: { code: 'asc' }
    });

    // Start of month & End of month (dynamic days: 28, 29, 30, 31)
    const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);
    const totalDaysInMonth = new Date(year, month, 0).getDate();

    const attendances = await prisma.employeeAttendance.findMany({
      where: {
        companyId,
        date: { gte: startDate, lte: endDate }
      },
      orderBy: { date: 'asc' }
    });

    const leaves = await prisma.employeeLeave.findMany({
      where: {
        companyId,
        status: 'Approved',
        startDate: { lte: endDate },
        endDate: { gte: startDate }
      }
    });

    const now = new Date();
    const isCurrentMonth = (now.getFullYear() === year && now.getMonth() === month - 1);
    const calculationCutoff = isCurrentMonth ? Math.min(now.getDate(), totalDaysInMonth) : totalDaysInMonth;

    const report = employees.map(emp => {
      const empAttendances = attendances.filter(a => a.employeeId === emp.id);
      const empLeaves = leaves.filter(l => l.employeeId === emp.id);

      const weekendDays: number[] = emp.weekendDays 
        ? String(emp.weekendDays).split(',').map(d => Number(d.trim())).filter(n => !isNaN(n))
        : [5];

      const expectedDailyHours = emp.workHoursPerDay || 8;
      let totalWorkMinutes = 0;
      let presentDays = 0;
      let lateDays = 0;
      let totalLateMinutes = 0;
      let totalEarlyMinutes = 0;
      let absentDays = 0;
      let weekendDaysCount = 0;
      let approvedLeaveDays = 0;
      let expectedWorkDays = 0;

      for (let day = 1; day <= totalDaysInMonth; day++) {
        const currentDate = new Date(year, month - 1, day);
        const dayOfWeek = currentDate.getDay();
        const isWeekend = weekendDays.includes(dayOfWeek);

        if (isWeekend) {
          weekendDaysCount++;
        } else {
          // It's a working day
          if (!emp.joinDate || currentDate >= new Date(emp.joinDate)) {
            expectedWorkDays++;
          }
        }

        // Only calculate actual attendance up to cutoff (today if current month)
        if (day <= calculationCutoff) {
          if (emp.joinDate && currentDate < new Date(emp.joinDate)) {
            continue; // Skip before join date
          }

          if (isWeekend) {
            continue; // Weekends don't count as absent
          }

          // Check approved leave
          const hasLeave = empLeaves.some(l => {
            if (['Permission', 'LateArrival', 'EarlyDeparture'].includes(l.type)) return false;
            const lStart = new Date(l.startDate);
            const lEnd = new Date(l.endDate);
            const startMidnight = new Date(lStart.getFullYear(), lStart.getMonth(), lStart.getDate());
            const endMidnight = new Date(lEnd.getFullYear(), lEnd.getMonth(), lEnd.getDate(), 23, 59, 59);
            return currentDate >= startMidnight && currentDate <= endMidnight;
          });

          if (hasLeave) {
            approvedLeaveDays++;
            continue;
          }

          // Check punch record
          const att = empAttendances.find(a => {
            const aDate = new Date(a.date);
            return aDate.getFullYear() === year && aDate.getMonth() === month - 1 && aDate.getDate() === day;
          });

          if (!att || (!att.checkIn && att.status === 'ABSENT')) {
            absentDays++;
          } else {
            presentDays++;
            if (att.workMinutes && att.workMinutes > 0) {
              totalWorkMinutes += att.workMinutes;
            }
            if (att.lateMinutes && att.lateMinutes > 0) {
              lateDays++;
              totalLateMinutes += att.lateMinutes;
            }
            if (att.earlyMinutes && att.earlyMinutes > 0) {
              totalEarlyMinutes += att.earlyMinutes;
            }
          }
        }
      }

      const totalActualHours = Math.round((totalWorkMinutes / 60) * 10) / 10;
      const expectedTotalHours = Math.round(expectedWorkDays * expectedDailyHours * 10) / 10;

      return {
        employeeId: emp.id,
        code: emp.code,
        name: emp.name,
        nameAr: emp.nameAr,
        department: emp.department,
        jobTitle: emp.jobTitle,
        jobTitleAr: emp.jobTitleAr,
        shiftStart: emp.shiftStart || '09:00',
        shiftEnd: emp.shiftEnd || '17:00',
        workHoursPerDay: expectedDailyHours,
        weekendDays,
        totalDaysInMonth,
        expectedWorkDays,
        expectedTotalHours,
        presentDays,
        lateDays,
        totalLateMinutes,
        totalEarlyMinutes,
        absentDays,
        approvedLeaveDays,
        weekendDaysCount,
        totalWorkMinutes,
        totalActualHours,
        calculationCutoff
      };
    });

    return { 
      success: true, 
      report, 
      meta: { 
        year, 
        month, 
        totalDaysInMonth, 
        calculationCutoff, 
        isCurrentMonth 
      } 
    };
  } catch (err: any) {
    console.error('Monthly Attendance Report Error:', err);
    return { success: false, error: err.message, report: [] };
  }
}

export async function recordAttendance(data: {
  employeeId: string;
  date: string;
  checkIn?: string | null;
  checkOut?: string | null;
  status?: string;
  source?: string;
  notes?: string;
}) {
  try {
    const { companyId } = await getAuthContext();
    const targetDate = new Date(data.date);
    const dayStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 0, 0, 0, 0);

    const checkInDate = data.checkIn ? new Date(data.checkIn) : null;
    const checkOutDate = data.checkOut ? new Date(data.checkOut) : null;

    let workMinutes = 0;
    if (checkInDate && checkOutDate) {
      const diffMs = checkOutDate.getTime() - checkInDate.getTime();
      if (diffMs > 0) workMinutes = Math.floor(diffMs / (1000 * 60));
    }

    const attendance = await prisma.employeeAttendance.upsert({
      where: {
        companyId_employeeId_date: {
          companyId,
          employeeId: data.employeeId,
          date: dayStart
        }
      },
      update: {
        checkIn: checkInDate,
        checkOut: checkOutDate,
        status: data.status || 'PRESENT',
        source: data.source || 'MANUAL',
        workMinutes,
        notes: data.notes || null,
      },
      create: {
        companyId,
        employeeId: data.employeeId,
        date: dayStart,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        status: data.status || 'PRESENT',
        source: data.source || 'MANUAL',
        workMinutes,
        notes: data.notes || null,
      },
      include: { employee: true }
    });

    revalidatePath('/employees');
    return { success: true, attendance };
  } catch (err: any) {
    console.error('Record Attendance Error:', err);
    return { success: false, error: err.message };
  }
}

export async function deleteAttendance(id: string) {
  try {
    const { companyId } = await getAuthContext();
    await prisma.employeeAttendance.delete({
      where: { id, companyId }
    });
    revalidatePath('/employees');
    return { success: true };
  } catch (err: any) {
    console.error('Delete Attendance Error:', err);
    return { success: false, error: err.message };
  }
}

export async function importBiometricData(records: Array<{
  employeeCode?: string;
  biometricId?: string;
  timestamp: string; // ISO or Date string
  type?: 'CHECK_IN' | 'CHECK_OUT' | 'AUTO';
}>) {
  try {
    const { companyId } = await getAuthContext();
    const employees = await prisma.employee.findMany({
      where: { companyId },
      select: { id: true, code: true, biometricId: true, weekendDays: true }
    });

    let successCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    // Group records by employee and day
    const dayGroups: { [key: string]: { employee: any; punches: Date[] } } = {};

    for (const rec of records) {
      const punchDate = new Date(rec.timestamp);
      if (isNaN(punchDate.getTime())) {
        failedCount++;
        continue;
      }

      // Find employee
      const emp = employees.find(e => 
        (rec.employeeCode && (e.code.toLowerCase() === rec.employeeCode.trim().toLowerCase())) ||
        (rec.biometricId && (e.biometricId === rec.biometricId.trim()))
      );

      if (!emp) {
        failedCount++;
        errors.push(`الموظف غير موجود: ${rec.employeeCode || rec.biometricId || 'بدون كود'}`);
        continue;
      }

      const dateKey = `${emp.id}_${punchDate.getFullYear()}-${punchDate.getMonth() + 1}-${punchDate.getDate()}`;
      if (!dayGroups[dateKey]) {
        dayGroups[dateKey] = { employee: emp, punches: [] };
      }
      dayGroups[dateKey].punches.push(punchDate);
    }

    // Process each employee day
    for (const key of Object.keys(dayGroups)) {
      const { employee, punches } = dayGroups[key];
      punches.sort((a, b) => a.getTime() - b.getTime());

      const checkIn = punches[0];
      const checkOut = punches.length > 1 ? punches[punches.length - 1] : null;
      const dayStart = new Date(checkIn.getFullYear(), checkIn.getMonth(), checkIn.getDate(), 0, 0, 0, 0);

      let workMinutes = 0;
      if (checkIn && checkOut) {
        workMinutes = Math.max(0, Math.floor((checkOut.getTime() - checkIn.getTime()) / (1000 * 60)));
      }

      await prisma.employeeAttendance.upsert({
        where: {
          companyId_employeeId_date: {
            companyId,
            employeeId: employee.id,
            date: dayStart
          }
        },
        update: {
          checkIn,
          checkOut: checkOut || undefined,
          workMinutes: workMinutes || undefined,
          source: 'BIOMETRIC',
          status: 'PRESENT',
        },
        create: {
          companyId,
          employeeId: employee.id,
          date: dayStart,
          checkIn,
          checkOut,
          workMinutes,
          source: 'BIOMETRIC',
          status: 'PRESENT',
        }
      });
      successCount++;
    }

    revalidatePath('/employees');
    return { success: true, successCount, failedCount, errors: errors.slice(0, 10) };
  } catch (err: any) {
    console.error('Import Biometric Data Error:', err);
    return { success: false, error: err.message };
  }
}

export async function resetEmployeeDevice(employeeId: string) {
  try {
    const { companyId } = await getAuthContext();
    const employee = await prisma.employee.findFirst({
      where: { id: employeeId, companyId }
    });

    if (!employee) {
      return { success: false, error: 'الموظف غير موجود بالنظام' };
    }

    const currentCf = (employee.customFields as any) || {};
    const updatedCf = { ...currentCf };
    delete updatedCf.deviceInfo;
    delete updatedCf.deviceBoundAt;

    await prisma.employee.update({
      where: { id: employeeId },
      data: {
        deviceId: null,
        customFields: updatedCf
      }
    });

    revalidatePath('/employees');
    revalidatePath(`/employees/${employeeId}`);
    return { 
      success: true, 
      message: `تم فك ارتباط الجهاز بنجاح للموظف (${employee.nameAr || employee.name}). أصبح بإمكانه الآن تسجيل الحضور من جهازه الجديد وسيتم توثيقه تلقائياً.` 
    };
  } catch (err: any) {
    console.error('Reset Employee Device Error:', err);
    return { success: false, error: err.message };
  }
}


