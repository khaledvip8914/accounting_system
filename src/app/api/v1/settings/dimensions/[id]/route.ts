import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();

    const updatedDimension = await prisma.accountingDimension.update({
      where: { id },
      data: {
        name: data.name,
        nameAr: data.nameAr,
        isActive: data.isActive,
      },
      include: {
        values: true,
      }
    });

    return NextResponse.json(updatedDimension);
  } catch (error: any) {
    console.error('Error updating dimension:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    await prisma.accountingDimension.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting dimension:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
