import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { companyId } = session.user;
    const body = await request.json();

    const { name, nameAr, type, overrideAccountId, isActive } = body;

    const updatedDeduction = await prisma.payrollDeductionType.update({
      where: { id: params.id, companyId },
      data: {
        name,
        nameAr,
        type,
        overrideAccountId,
        isActive: isActive !== undefined ? isActive : undefined
      }
    });

    return NextResponse.json(updatedDeduction);
  } catch (error: any) {
    console.error('Error updating payroll deduction:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { companyId } = session.user;

    await prisma.payrollDeductionType.delete({
      where: { id: params.id, companyId }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting payroll deduction:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
