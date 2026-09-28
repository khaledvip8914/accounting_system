import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { companyId } = session.user;
    const body = await request.json();
    const { name, isActive } = body;
    const id = params.id;

    // Verify it belongs to the company
    const existing = await prisma.financialYear.findFirst({
      where: { id, companyId }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Financial year not found' }, { status: 404 });
    }

    if (existing.status === 'Closed') {
      return NextResponse.json({ error: 'Cannot modify a closed financial year' }, { status: 400 });
    }

    // If making this active, deactivate others
    if (isActive) {
      await prisma.financialYear.updateMany({
        where: { companyId },
        data: { isActive: false }
      });
    }

    const updated = await prisma.financialYear.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(isActive !== undefined && { isActive }),
      }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error updating financial year:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { companyId } = session.user;
    const id = params.id;

    const existing = await prisma.financialYear.findFirst({
      where: { id, companyId }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Financial year not found' }, { status: 404 });
    }

    if (existing.status === 'Closed') {
      return NextResponse.json({ error: 'Cannot delete a closed financial year' }, { status: 400 });
    }

    // TODO: Add check to prevent deletion if invoices/vouchers are linked to this year's dates
    // For now, we allow deletion if they want, but realistically they shouldn't delete if it's used.

    await prisma.financialYear.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting financial year:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
