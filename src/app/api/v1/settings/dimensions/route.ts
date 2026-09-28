import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId') || session?.user?.companyId || 'default';

    const dimensions = await prisma.accountingDimension.findMany({
      where: { companyId },
      include: {
        values: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(dimensions);
  } catch (error: any) {
    console.error('Error fetching dimensions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const existing = await prisma.accountingDimension.findUnique({
      where: {
        companyId_name: {
          companyId: data.companyId || 'default',
          name: data.name,
        }
      }
    });

    if (existing) {
      return NextResponse.json({ error: 'Dimension with this name already exists.' }, { status: 400 });
    }

    const newDimension = await prisma.accountingDimension.create({
      data: {
        companyId: data.companyId || 'default',
        name: data.name,
        nameAr: data.nameAr,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
      include: {
        values: true,
      }
    });

    return NextResponse.json(newDimension, { status: 201 });
  } catch (error: any) {
    console.error('Error creating dimension:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
