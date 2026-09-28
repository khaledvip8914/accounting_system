import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const invs = await prisma.salesInvoice.findMany({
      where: { zatcaStatus: 'Failed' },
      select: { invoiceNumber: true, zatcaStatus: true, zatcaErrorLogs: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    return NextResponse.json(invs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
