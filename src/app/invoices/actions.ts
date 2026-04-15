'use server';

import { prisma } from '../../lib/db';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';

export async function getInvoices() {
  try {
    const invoices = await prisma.salesInvoice.findMany({
      orderBy: { createdAt: 'desc' },
      include: { customer: true }
    });
    return invoices.map((inv: any) => ({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      client: inv.customer?.name || 'Unknown',
      amount: inv.netAmount,
      date: inv.date,
      status: inv.status
    }));
  } catch (error) {
    console.error('Failed to fetch invoices:', error);
    return [];
  }
}

export async function createInvoice(data: {
  customerId: string; // Actually receives the client name from the form
  netAmount: number;
  date: string;
  status: string;
}) {
  try {
    const session = await getSession();
    const userRole = session?.user?.role;
    const userPerms = session?.user?.permissions || session?.user?.roleRef?.permissions;

    if (userRole !== 'Admin' && !hasPermission(userPerms, 'invoices', 'create')) {
      throw new Error('غير مصرح لك بإنشاء فاتورة مبيعات');
    }

    // Treat data.customerId as the client name and auto-create or find a customer
    let customer = await prisma.customer.findFirst({
      where: { name: data.customerId }
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          code: `CUST-${Date.now()}`,
          name: data.customerId
        }
      });
    }

    const count = await prisma.salesInvoice.count();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

    await prisma.salesInvoice.create({
      data: {
        invoiceNumber,
        customerId: customer.id,
        netAmount: data.netAmount,
        totalAmount: data.netAmount,
        date: new Date(data.date + 'T12:00:00Z'),
        status: data.status,
      },
    });

    revalidatePath('/invoices');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to create invoice:', error);
    return { success: false, error: 'Failed to create invoice' };
  }
}
