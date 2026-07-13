'use server';

import { prisma_latest as prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';

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

    const newEmployee = await prisma.employee.create({
      data: {
        companyId,
        code: finalCode,
        name: data.name,
        nameAr: data.nameAr,
        jobTitle: data.jobTitle,
        jobTitleAr: data.jobTitleAr,
        basicSalary: data.basicSalary,
        idNumber: data.idNumber,
        idExpiry: data.idExpiry ? new Date(data.idExpiry) : null,
        joinDate: data.joinDate ? new Date(data.joinDate) : new Date(),
        status: data.status || 'Active',
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

    const jv = await prisma.journalVoucher.create({
      data: {
        companyId,
        reference: `HR-${Date.now()}`,
        date: data.date ? new Date(data.date) : new Date(),
        description: data.reason || `HR Transaction: ${data.type} for ${employee.name}`,
        status: data.status === 'Confirmed' ? 'Posted' : 'Draft',
        entries: {
          create: [
            { date: data.date ? new Date(data.date) : new Date(), accountId: debitAccountId, debit: amount, credit: 0, description: data.reason || data.type },
            { date: data.date ? new Date(data.date) : new Date(), accountId: creditAccountId, debit: 0, credit: amount, description: data.reason || data.type }
          ]
        }
      }
    });

    const newMove = await prisma.employeeFinancialMove.create({
      data: {
        companyId,
        employeeId: data.employeeId,
        type: data.type, 
        amount,
        date: data.date ? new Date(data.date) : new Date(),
        reason: data.reason,
        status: data.status || 'Pending',
        journalVoucherId: jv.id
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

    if (move.journalVoucherId) {
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

      await prisma.journalEntry.deleteMany({ where: { journalVoucherId: move.journalVoucherId } });
      await prisma.journalVoucher.update({
         where: { id: move.journalVoucherId },
         data: {
            date: data.date ? new Date(data.date) : new Date(),
            description: data.reason || `HR Transaction: ${data.type}`,
            status: data.status === 'Confirmed' ? 'Posted' : 'Draft',
            entries: {
               create: [
                 { date: data.date ? new Date(data.date) : new Date(), accountId: debitAccountId, debit: amount, credit: 0, description: data.reason || data.type },
                 { date: data.date ? new Date(data.date) : new Date(), accountId: creditAccountId, debit: 0, credit: amount, description: data.reason || data.type }
               ]
            }
         }
      });
    }

    const updatedMove = await prisma.employeeFinancialMove.update({
      where: { id: data.id, companyId },
      data: {
        employeeId: data.employeeId,
        type: data.type,
        amount,
        date: data.date ? new Date(data.date) : new Date(),
        reason: data.reason,
        status: data.status,
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
