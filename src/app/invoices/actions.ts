'use server';

import { prisma } from '../../lib/db';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';

async function getAuthContext() {
  const session = await getSession();
  if (!session || !session.user || !session.user.companyId) {
    throw new Error('Unauthorized');
  }
  return {
    companyId: session.user.companyId,
    permissions: session.user
  };
}

export async function getInvoices() {
  try {
    const { companyId } = await getAuthContext();
    const invoices = await prisma.salesInvoice.findMany({
      where: { companyId },
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
    const { companyId, permissions } = await getAuthContext();

    if (!hasPermission(permissions, 'invoices', 'create')) {
      throw new Error('غير مصرح لك بإنشاء فاتورة مبيعات');
    }

    // Treat data.customerId as the client name and auto-create or find a customer (Scoped to company)
    let customer = await prisma.customer.findFirst({
      where: { name: data.customerId, companyId }
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          companyId,
          code: `CUST-${Date.now()}`,
          name: data.customerId
        }
      });
    }

    const count = await prisma.salesInvoice.count({ where: { companyId } });
    const invoiceNumber = `INV-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

    await prisma.salesInvoice.create({
      data: {
        companyId,
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
