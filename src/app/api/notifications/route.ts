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

    // Fetch ZATCA failed invoices
    const failedInvoices = await prisma.salesInvoice.findMany({
      where: { 
        companyId,
        zatcaStatus: 'Failed'
      },
      orderBy: { updatedAt: 'desc' },
      take: 20
    });

    const notifications = failedInvoices.map(inv => ({
      id: inv.id,
      type: 'ZatcaError',
      title: 'ZATCA Submission Failed',
      titleAr: 'فشل إرسال الفاتورة',
      message: `Invoice ${inv.invoiceNumber} failed to sync with ZATCA.`,
      messageAr: `فشل مزامنة الفاتورة ${inv.invoiceNumber} مع منصة فاتورة.`,
      isRead: false,
      link: `/sales`,
      date: inv.updatedAt
    }));

    return NextResponse.json({ notifications, count: notifications.length });
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
