import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid Authorization header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    const profile = await prisma.companyProfile.findUnique({
      where: { apiToken: token },
      include: { company: true }
    });

    if (!profile) {
      return NextResponse.json({ error: 'Invalid API Token' }, { status: 401 });
    }

    const companyId = profile.companyId;
    const body = await request.json();
    
    // Validation of incoming invoice data from POS/ERP
    if (!body.customerId || !body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: 'Invalid payload. customerId and items array are required.' }, { status: 400 });
    }

    // Check if customer exists in the company
    const customer = await prisma.customer.findFirst({
      where: { id: body.customerId, companyId }
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found or does not belong to this company.' }, { status: 404 });
    }

    // Generate invoice number
    const count = await prisma.salesInvoice.count({ where: { companyId } });
    const invoiceNumber = `API-INV-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

    let totalAmount = 0;
    let taxAmount = 0;
    let discount = body.discount || 0;
    
    const items = body.items.map((item: any) => {
      const lineTotal = item.quantity * item.unitPrice;
      const lineTax = lineTotal * 0.15; // 15% VAT assumption
      totalAmount += lineTotal;
      taxAmount += lineTax;
      
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: lineTotal
      };
    });

    const netAmount = (totalAmount - discount) + taxAmount;

    // Create Invoice in DB
    const invoice = await prisma.salesInvoice.create({
      data: {
        companyId,
        invoiceNumber,
        date: new Date(),
        customerId: body.customerId,
        warehouseId: body.warehouseId || null,
        totalAmount,
        taxAmount,
        discount,
        netAmount,
        status: 'Confirmed', 
        isTaxInclusive: false,
        invoiceType: '388', 
        zatcaStatus: 'Pending', // Ready to be synced with ZATCA
        items: {
          create: items
        }
      },
      include: {
        items: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Invoice created successfully and queued for ZATCA submission.',
      invoice: {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        netAmount: invoice.netAmount,
        zatcaStatus: invoice.zatcaStatus
      }
    });

  } catch (error: any) {
    console.error('API /v1/invoices Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
