import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { companyId } = session.user;
    
    let settings = await prisma.payrollSettings.findUnique({
      where: { companyId }
    });

    if (!settings) {
      settings = await prisma.payrollSettings.create({
        data: {
          companyId
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error('Error fetching payroll settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { companyId } = session.user;
    const body = await request.json();

    const updatedSettings = await prisma.payrollSettings.upsert({
      where: { companyId },
      update: {
        basicSalaryAccountId: body.basicSalaryAccountId,
        allowancesAccountId: body.allowancesAccountId,
        deductionsAccountId: body.deductionsAccountId,
        employeeLoansAccountId: body.employeeLoansAccountId,
        accruedSalariesAccountId: body.accruedSalariesAccountId,
        gosiCompanyExpenseAccountId: body.gosiCompanyExpenseAccountId,
        gosiPayableAccountId: body.gosiPayableAccountId,
        endOfServiceExpenseAccountId: body.endOfServiceExpenseAccountId,
        endOfServiceProvisionAccountId: body.endOfServiceProvisionAccountId,
        vacationExpenseAccountId: body.vacationExpenseAccountId,
        vacationProvisionAccountId: body.vacationProvisionAccountId,
        gosiEmployeeRatio: body.gosiEmployeeRatio !== undefined ? parseFloat(body.gosiEmployeeRatio) : undefined,
        gosiCompanyRatio: body.gosiCompanyRatio !== undefined ? parseFloat(body.gosiCompanyRatio) : undefined,
        gosiMaxSalary: body.gosiMaxSalary !== undefined ? parseFloat(body.gosiMaxSalary) : undefined,
        defaultAnnualLeaveDays: body.defaultAnnualLeaveDays !== undefined ? parseInt(body.defaultAnnualLeaveDays) : undefined,
        enableEndOfServiceProvision: body.enableEndOfServiceProvision,
        enableVacationProvision: body.enableVacationProvision,
        payrollCycleStartDay: body.payrollCycleStartDay !== undefined ? parseInt(body.payrollCycleStartDay) : undefined,
        payrollCycleEndDay: body.payrollCycleEndDay !== undefined ? parseInt(body.payrollCycleEndDay) : undefined,
        defaultPaymentMethod: body.defaultPaymentMethod,
        defaultBankAccountId: body.defaultBankAccountId,
      },
      create: {
        companyId,
        basicSalaryAccountId: body.basicSalaryAccountId,
        allowancesAccountId: body.allowancesAccountId,
        deductionsAccountId: body.deductionsAccountId,
        employeeLoansAccountId: body.employeeLoansAccountId,
        accruedSalariesAccountId: body.accruedSalariesAccountId,
        gosiCompanyExpenseAccountId: body.gosiCompanyExpenseAccountId,
        gosiPayableAccountId: body.gosiPayableAccountId,
        endOfServiceExpenseAccountId: body.endOfServiceExpenseAccountId,
        endOfServiceProvisionAccountId: body.endOfServiceProvisionAccountId,
        vacationExpenseAccountId: body.vacationExpenseAccountId,
        vacationProvisionAccountId: body.vacationProvisionAccountId,
        gosiEmployeeRatio: body.gosiEmployeeRatio !== undefined ? parseFloat(body.gosiEmployeeRatio) : 9.75,
        gosiCompanyRatio: body.gosiCompanyRatio !== undefined ? parseFloat(body.gosiCompanyRatio) : 11.75,
        gosiMaxSalary: body.gosiMaxSalary !== undefined ? parseFloat(body.gosiMaxSalary) : 45000,
        defaultAnnualLeaveDays: body.defaultAnnualLeaveDays !== undefined ? parseInt(body.defaultAnnualLeaveDays) : 30,
        enableEndOfServiceProvision: body.enableEndOfServiceProvision || false,
        enableVacationProvision: body.enableVacationProvision || false,
        payrollCycleStartDay: body.payrollCycleStartDay !== undefined ? parseInt(body.payrollCycleStartDay) : 1,
        payrollCycleEndDay: body.payrollCycleEndDay !== undefined ? parseInt(body.payrollCycleEndDay) : 30,
        defaultPaymentMethod: body.defaultPaymentMethod || 'Bank Transfer',
        defaultBankAccountId: body.defaultBankAccountId,
      }
    });

    return NextResponse.json(updatedSettings);
  } catch (error: any) {
    console.error('Error updating payroll settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
