import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string, valueId: string }> }) {
  try {
    const { valueId } = await params;
    const data = await request.json();

    const updatedValue = await prisma.dimensionValue.update({
      where: { id: valueId },
      data: {
        code: data.code,
        name: data.name,
        nameAr: data.nameAr,
        isActive: data.isActive,
        parentId: data.parentId !== undefined ? data.parentId : undefined,
      },
    });

    return NextResponse.json(updatedValue);
  } catch (error: any) {
    console.error('Error updating dimension value:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string, valueId: string }> }) {
  try {
    const { valueId } = await params;

    await prisma.dimensionValue.delete({
      where: { id: valueId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting dimension value:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
