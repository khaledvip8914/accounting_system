import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!hasPermission(session.user, 'settings', 'edit')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, nameAr, dueDays, discountDays, discountPercentage, isActive } = body;

    const term = await prisma.paymentTerm.findFirst({
      where: { id, companyId: session.user.companyId },
    });

    if (!term) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const updated = await prisma.paymentTerm.update({
      where: { id },
      data: {
        name,
        nameAr,
        dueDays: Number(dueDays),
        discountDays: Number(discountDays || 0),
        discountPercentage: Number(discountPercentage || 0),
        isActive: isActive !== undefined ? isActive : term.isActive,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!hasPermission(session.user, 'settings', 'delete')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    const term = await prisma.paymentTerm.findFirst({
      where: { id, companyId: session.user.companyId },
    });

    if (!term) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Ensure it's not being used (You'd typically check relations here, but leaving simple for now)
    
    await prisma.paymentTerm.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
