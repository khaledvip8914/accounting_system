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
    const { name, nameAr, type, options, isRequired, isActive } = body;

    const prop = await prisma.productCharacteristic.findFirst({
      where: { id, companyId: session.user.companyId },
    });

    if (!prop) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const updated = await prisma.productCharacteristic.update({
      where: { id },
      data: {
        name,
        nameAr,
        type,
        options: options || [],
        isRequired: isRequired !== undefined ? isRequired : prop.isRequired,
        isActive: isActive !== undefined ? isActive : prop.isActive,
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

    const prop = await prisma.productCharacteristic.findFirst({
      where: { id, companyId: session.user.companyId },
    });

    if (!prop) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await prisma.productCharacteristic.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
