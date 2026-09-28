import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { companyId } = session.user;
    const { id } = await params;
    const body = await request.json();

    const {
      name,
      nameAr,
      rate,
      code,
      exemptionReasonCode,
      exemptionReasonText,
      isDefault,
      isActive,
      outputAccountId,
      inputAccountId
    } = body;

    // Check if the tax rate belongs to the user's company
    const existingTaxRate = await prisma.taxRate.findUnique({
      where: { id }
    });

    if (!existingTaxRate || existingTaxRate.companyId !== companyId) {
      return NextResponse.json({ error: 'Tax rate not found or access denied' }, { status: 404 });
    }

    // If this is set to default, unset default from others
    if (isDefault) {
      await prisma.taxRate.updateMany({
        where: { companyId, id: { not: id } },
        data: { isDefault: false }
      });
    }

    const updatedTaxRate = await prisma.taxRate.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existingTaxRate.name,
        nameAr: nameAr !== undefined ? nameAr : existingTaxRate.nameAr,
        rate: rate !== undefined ? parseFloat(rate.toString()) : existingTaxRate.rate,
        code: code !== undefined ? code : existingTaxRate.code,
        exemptionReasonCode: exemptionReasonCode !== undefined ? exemptionReasonCode : existingTaxRate.exemptionReasonCode,
        exemptionReasonText: exemptionReasonText !== undefined ? exemptionReasonText : existingTaxRate.exemptionReasonText,
        isDefault: isDefault !== undefined ? isDefault : existingTaxRate.isDefault,
        isActive: isActive !== undefined ? isActive : existingTaxRate.isActive,
        outputAccountId: outputAccountId !== undefined ? outputAccountId : existingTaxRate.outputAccountId,
        inputAccountId: inputAccountId !== undefined ? inputAccountId : existingTaxRate.inputAccountId
      }
    });

    return NextResponse.json(updatedTaxRate);
  } catch (error: any) {
    console.error('Error updating tax rate:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Tax rate with this code and rate already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { companyId } = session.user;
    const { id } = await params;

    const existingTaxRate = await prisma.taxRate.findUnique({
      where: { id }
    });

    if (!existingTaxRate || existingTaxRate.companyId !== companyId) {
      return NextResponse.json({ error: 'Tax rate not found or access denied' }, { status: 404 });
    }

    // Optionally check if it's used in any products or invoices before deleting. 
    // Since we don't have hard relations yet, we can just delete it, or maybe set isActive to false instead.
    if (existingTaxRate.isDefault) {
      return NextResponse.json({ error: 'Cannot delete the default tax rate. Set another one as default first.' }, { status: 400 });
    }

    await prisma.taxRate.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting tax rate:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
