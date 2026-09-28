import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: dimensionId } = await params;
    const data = await request.json();

    const existing = await prisma.dimensionValue.findUnique({
      where: {
        dimensionId_code: {
          dimensionId,
          code: data.code,
        }
      }
    });

    if (existing) {
      return NextResponse.json({ error: 'Value with this code already exists in this dimension.' }, { status: 400 });
    }

    const newValue = await prisma.dimensionValue.create({
      data: {
        dimensionId,
        code: data.code,
        name: data.name,
        nameAr: data.nameAr,
        isActive: data.isActive !== undefined ? data.isActive : true,
        parentId: data.parentId || null,
      },
    });

    return NextResponse.json(newValue, { status: 201 });
  } catch (error: any) {
    console.error('Error creating dimension value:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
