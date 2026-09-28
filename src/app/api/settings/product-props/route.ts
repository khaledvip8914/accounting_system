import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const props = await prisma.productCharacteristic.findMany({
      where: { companyId: session.user.companyId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(props);
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
    const { name, nameAr, type, options, isRequired, isActive } = body;

    const existing = await prisma.productCharacteristic.findUnique({
      where: { companyId_name: { companyId: session.user.companyId, name } },
    });

    if (existing) {
      return NextResponse.json({ error: 'Characteristic with this name already exists' }, { status: 400 });
    }

    const prop = await prisma.productCharacteristic.create({
      data: {
        companyId: session.user.companyId,
        name,
        nameAr,
        type,
        options: options || [],
        isRequired: isRequired || false,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(prop);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
