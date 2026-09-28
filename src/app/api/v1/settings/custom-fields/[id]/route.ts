import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const data = await request.json();

    const updatedField = await prisma.customField.update({
      where: { id },
      data: {
        label: data.label,
        labelAr: data.labelAr,
        options: data.options,
        isRequired: data.isRequired,
        showInPrint: data.showInPrint,
        isActive: data.isActive,
      },
    });

    return NextResponse.json(updatedField);
  } catch (error: any) {
    console.error('Error updating custom field:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    await prisma.customField.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting custom field:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
