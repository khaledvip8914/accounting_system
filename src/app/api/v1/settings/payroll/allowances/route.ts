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
    
    const allowances = await prisma.payrollAllowanceType.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(allowances);
  } catch (error: any) {
    console.error('Error fetching payroll allowances:', error);
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

    const { name, nameAr, type, isGosiTaxable, defaultAmount, overrideAccountId, isActive } = body;

    if (!name || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newAllowance = await prisma.payrollAllowanceType.create({
      data: {
        companyId,
        name,
        nameAr,
        type,
        isGosiTaxable: isGosiTaxable || false,
        defaultAmount: defaultAmount ? parseFloat(defaultAmount) : 0,
        overrideAccountId,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    return NextResponse.json(newAllowance);
  } catch (error: any) {
    console.error('Error creating payroll allowance:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Allowance with this name already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
