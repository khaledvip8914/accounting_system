'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getSalesReport(startDate: string, endDate: string) {
  try {
    const invoices = await prisma.salesInvoice.findMany({
      where: {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      include: {
        customer: true
      },
      orderBy: { date: 'desc' }
    });

    return { success: true, data: invoices };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPurchaseReport(startDate: string, endDate: string) {
  try {
    const invoices = await prisma.purchaseInvoice.findMany({
      where: {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      include: {
        supplier: true
      },
      orderBy: { date: 'desc' }
    });

    return { success: true, data: invoices };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getReturnsReport(startDate: string, endDate: string) {
  try {
    // Currently, returns might be handled as invoices with negative amounts or specific status
    // Or we might need a separate Returns model if the schema grows.
    // For now, let's fetch invoices marked with 'Returned' status if applicable.
    const salesReturns = await prisma.salesInvoice.findMany({
      where: {
        status: 'Returned',
        date: { gte: new Date(startDate), lte: new Date(endDate) }
      },
      include: { customer: true }
    });

    const purchaseReturns = await prisma.purchaseInvoice.findMany({
      where: {
        status: 'Returned',
        date: { gte: new Date(startDate), lte: new Date(endDate) }
      },
      include: { supplier: true }
    });

    return { success: true, salesReturns, purchaseReturns };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
