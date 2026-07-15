import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const invoices = await prisma.salesInvoice.findMany({
      where: { zatcaStatus: 'Failed' },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        invoiceNumber: true,
        zatcaStatus: true,
        zatcaErrorLogs: true,
        createdAt: true,
        branchId: true,
        company: {
          select: {
            profile: {
              select: {
                zatcaEnvironment: true,
                zatcaCsid: true
              }
            }
          }
        }
      }
    });
    return NextResponse.json(invoices);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
