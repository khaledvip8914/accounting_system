'use server';

import { prisma_latest as prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createEmployee(data: any) {
  try {
    let finalCode = data.code;
    
    // Auto-generate code if empty
    if (!finalCode) {
      const count = await prisma.employee.count();
      finalCode = `EMP-${(count + 1).toString().padStart(3, '0')}`;
    }

    await prisma.employee.create({
      data: {
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

    revalidatePath('/employees');
    revalidatePath('/salaries');
    return { success: true };
  } catch (err: any) {
    console.error('Create Employee Error:', err);
    return { success: false, error: err.message };
  }
}

export async function createFinancialMove(data: any) {
  try {
    await prisma.employeeFinancialMove.create({
      data: {
        employeeId: data.employeeId,
        type: data.type, // Advance or Penalty
        amount: parseFloat(data.amount),
        date: data.date ? new Date(data.date) : new Date(),
        reason: data.reason,
        status: data.status || 'Pending',
      }
    });

    revalidatePath('/employees');
    revalidatePath('/salaries');
    return { success: true };
  } catch (err: any) {
    console.error('Create Financial Move Error:', err);
    return { success: false, error: err.message };
  }
}

export async function updateFinancialMove(data: any) {
  try {
    await prisma.employeeFinancialMove.update({
      where: { id: data.id },
      data: {
        employeeId: data.employeeId,
        type: data.type,
        amount: parseFloat(data.amount),
        date: data.date ? new Date(data.date) : new Date(),
        reason: data.reason,
        status: data.status,
      }
    });
    revalidatePath('/employees');
    revalidatePath('/salaries');
    return { success: true };
  } catch (err: any) {
    console.error('Update Financial Move Error:', err);
    return { success: false, error: err.message };
  }
}

export async function deleteFinancialMove({ id }: { id: string }) {
  try {
    await prisma.employeeFinancialMove.delete({
      where: { id }
    });
    revalidatePath('/employees');
    revalidatePath('/salaries');
    revalidatePath('/employees', 'page');
    return { success: true };
  } catch (err: any) {
    console.error('Delete Financial Move Error:', err);
    return { success: false, error: err.message };
  }
}

export async function approveFinancialMove({ id }: { id: string }) {
  try {
    await prisma.employeeFinancialMove.update({
      where: { id },
      data: { status: 'Approved' }
    });
    revalidatePath('/employees');
    revalidatePath('/salaries');
    revalidatePath('/employees', 'page');
    return { success: true };
  } catch (err: any) {
    console.error('Approve Financial Move Error:', err);
    return { success: false, error: err.message };
  }
}
