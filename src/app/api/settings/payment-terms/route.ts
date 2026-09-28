import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const terms = await prisma.paymentTerm.findMany({
      where: { companyId: session.user.companyId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(terms);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!hasPermission(session.user, 'settings', 'edit')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { name, nameAr, dueDays, discountDays, discountPercentage, isActive } = body;

    const existing = await prisma.paymentTerm.findUnique({
      where: { companyId_name: { companyId: session.user.companyId, name } },
    });

    if (existing) {
      return NextResponse.json({ error: 'Payment term with this name already exists' }, { status: 400 });
    }

    const term = await prisma.paymentTerm.create({
      data: {
        companyId: session.user.companyId,
        name,
        nameAr,
        dueDays: Number(dueDays),
        discountDays: Number(discountDays || 0),
        discountPercentage: Number(discountPercentage || 0),
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(term);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
