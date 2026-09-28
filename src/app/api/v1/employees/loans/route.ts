import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET /api/v1/employees/loans — list all loans for company
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { companyId } = session.user;
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');

    const where: any = { companyId };
    if (employeeId) where.employeeId = employeeId;

    const loans = await prisma.employeeLoan.findMany({
      where,
      include: {
        employee: { select: { id: true, name: true, nameAr: true, code: true } },
        installments: { orderBy: [{ year: 'asc' }, { month: 'asc' }] }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(loans);
  } catch (error: any) {
    console.error('Error fetching loans:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/v1/employees/loans — create new loan with installment schedule
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { companyId } = session.user;
    const body = await request.json();

    const { employeeId, totalAmount, installmentAmount, startMonth, startYear, reason } = body;

    if (!employeeId || !totalAmount || !installmentAmount || !startMonth || !startYear) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify employee belongs to company
    const employee = await prisma.employee.findFirst({
      where: { id: employeeId, companyId }
    });
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Generate installment schedule
    const installments = [];
    let remaining = parseFloat(totalAmount);
    const instAmount = parseFloat(installmentAmount);
    let month = parseInt(startMonth);
    let year = parseInt(startYear);

    while (remaining > 0) {
      const amount = remaining >= instAmount ? instAmount : remaining;
      installments.push({ month, year, amount, status: 'Pending' });
      remaining = parseFloat((remaining - amount).toFixed(2));
      month++;
      if (month > 12) { month = 1; year++; }
    }

    const loan = await prisma.employeeLoan.create({
      data: {
        companyId,
        employeeId,
        totalAmount: parseFloat(totalAmount),
        remainingAmount: parseFloat(totalAmount),
        installmentAmount: instAmount,
        startMonth: parseInt(startMonth),
        startYear: parseInt(startYear),
        reason: reason || null,
        status: 'Active',
        installments: {
          create: installments
        }
      },
      include: {
        employee: { select: { id: true, name: true, nameAr: true, code: true } },
        installments: { orderBy: [{ year: 'asc' }, { month: 'asc' }] }
      }
    });

    return NextResponse.json(loan);
  } catch (error: any) {
    console.error('Error creating loan:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
