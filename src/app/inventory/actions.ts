'use server';

import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

async function getAuthContext() {
  const session = await getSession();
  if (!session || !session.user || !session.user.companyId) {
    throw new Error('Unauthorized');
  }
  return {
    companyId: session.user.companyId,
    permissions: session.user,
    role: session.user.role
  };
}

export async function getItemCard(productId: string, startDate?: string, endDate?: string) {
  try {
    const { companyId } = await getAuthContext();
    const where: any = { 
      productId,
      product: { companyId }
    };
    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.date.lte = end;
      }
    }

    const logs = await prisma.inventoryLog.findMany({
      where,
      include: {
        product: { include: { unitRef: true } },
        warehouse: true
      },
      orderBy: { date: 'desc' }
    });

    return logs;
  } catch (err) {
    console.error('Error fetching item card:', err);
    return [];
  }
}

export async function getDisposalVouchers() {
  try {
    const { companyId } = await getAuthContext();
    return await prisma.disposalVoucher.findMany({
      where: { companyId },
      include: {
        product: { include: { unitRef: true, subUnitRef: true } },
        warehouse: true
      },
      orderBy: { date: 'desc' }
    });
  } catch (err) {
    console.error('Error fetching disposal vouchers:', err);
    return [];
  }
}

export async function createDisposalVoucher(data: { productId: string, quantity: number, reason: string, date: string, warehouseId: string, unitId?: string, notes?: string }) {
  try {
    const { companyId } = await getAuthContext();

    const res = await prisma.$transaction(async (tx) => {
      // 1. Generate voucher number
      const count = await tx.disposalVoucher.count({ where: { companyId } });
      const voucherNumber = `DISP-${(count + 1).toString().padStart(4, '0')}`;

      // 2. Update Product stock
      await tx.product.update({
        where: { id: data.productId, companyId },
        data: { stockQuantity: { decrement: data.quantity } }
      });

      // 3. Update Warehouse stock
      const ws = await tx.warehouseStock.findUnique({
          where: { warehouseId_productId: { warehouseId: data.warehouseId, productId: data.productId } }
      });
      if (ws) {
          await tx.warehouseStock.update({
              where: { id: ws.id },
              data: { quantity: { decrement: data.quantity } }
          });
      }

      // 4. Create Voucher
      const voucher = await tx.disposalVoucher.create({
          data: {
              companyId,
              voucherNumber,
              productId: data.productId,
              warehouseId: data.warehouseId,
              unitId: data.unitId,
              quantity: data.quantity,
              reason: data.reason,
              notes: data.notes,
              date: new Date(data.date)
          }
      });

      // 5. Create Inventory Log
      await tx.inventoryLog.create({
        data: {
          companyId,
          productId: data.productId,
          warehouseId: data.warehouseId,
          type: 'Disposal',
          quantity: -data.quantity,
          date: new Date(data.date),
          referenceId: voucherNumber,
          description: `سند إتلاف: ${data.reason}`
        }
      });

      return voucher;
    });
    return { success: true, data: res };
  } catch (err: any) {
    console.error('Error in createDisposalVoucher:', err);
    return { success: false, error: err.message };
  }
}

export async function deleteDisposalVoucher(id: string) {
    try {
        const { companyId } = await getAuthContext();

        await prisma.$transaction(async (tx) => {
            const v = await tx.disposalVoucher.findFirst({ where: { id, companyId } });
            if (!v) throw new Error("Voucher not found");

            // Reverse stock
            await tx.product.update({
                where: { id: v.productId, companyId },
                data: { stockQuantity: { increment: v.quantity } }
            });
            const ws = await tx.warehouseStock.findUnique({
                where: { warehouseId_productId: { warehouseId: v.warehouseId, productId: v.productId } }
            });
            if (ws) {
                await tx.warehouseStock.update({
                    where: { id: ws.id },
                    data: { quantity: { increment: v.quantity } }
                });
            }

            // Remove associated log
            await tx.inventoryLog.deleteMany({
                where: { companyId, referenceId: v.voucherNumber, type: 'Disposal' }
            });

            // Delete Voucher
            await tx.disposalVoucher.delete({ where: { id } });
        });
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function updateDisposalVoucher(id: string, data: any) {
    try {
        await deleteDisposalVoucher(id);
        const res = await createDisposalVoucher(data);
        return res;
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}
