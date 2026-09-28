import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { companyId } = session.user;
    
    // Check if tax rates exist for this company
    let taxRates = await prisma.taxRate.findMany({
      where: { companyId },
      orderBy: { createdAt: 'asc' }
    });

    // If no tax rates exist, create a default 15% standard rate
    if (taxRates.length === 0) {
      const defaultTax = await prisma.taxRate.create({
        data: {
          companyId,
          name: 'Standard Rate 15%',
          nameAr: 'الضريبة الأساسية 15%',
          rate: 15,
          code: 'S',
          isDefault: true,
          isActive: true
        }
      });
      taxRates = [defaultTax];
    }

    return NextResponse.json(taxRates);
  } catch (error: any) {
    console.error('Error fetching tax rates:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { companyId } = session.user;
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

    if (!name || rate === undefined || !code) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // If this is set to default, unset default from others
    if (isDefault) {
      await prisma.taxRate.updateMany({
        where: { companyId },
        data: { isDefault: false }
      });
    }

    const newTaxRate = await prisma.taxRate.create({
      data: {
        companyId,
        name,
        nameAr,
        rate: parseFloat(rate.toString()),
        code,
        exemptionReasonCode,
        exemptionReasonText,
        isDefault: isDefault || false,
        isActive: isActive !== undefined ? isActive : true,
        outputAccountId,
        inputAccountId
      }
    });

    return NextResponse.json(newTaxRate);
  } catch (error: any) {
    console.error('Error creating tax rate:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Tax rate with this code and rate already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
