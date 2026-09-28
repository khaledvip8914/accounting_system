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
    
    const deductions = await prisma.payrollDeductionType.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(deductions);
  } catch (error: any) {
    console.error('Error fetching payroll deductions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { companyId } = session.user;
    const body = await request.json();

    const { name, nameAr, type, overrideAccountId, isActive } = body;

    if (!name || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newDeduction = await prisma.payrollDeductionType.create({
      data: {
        companyId,
        name,
        nameAr,
        type,
        overrideAccountId,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    return NextResponse.json(newDeduction);
  } catch (error: any) {
    console.error('Error creating payroll deduction:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Deduction with this name already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
