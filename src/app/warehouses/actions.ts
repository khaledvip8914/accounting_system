'use server';

import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { revalidatePath } from 'next/cache';

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

export async function createWarehouse(data: any) {
  try {
    const { companyId, permissions: user } = await getAuthContext();
    if (!hasPermission(user, 'inventory', 'create')) {
      throw new Error('غير مصرح لك بإضافة مستودع');
    }

    // Check branch limit
    const companyInfo = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        subscriptionPlan: true,
        _count: {
          select: { warehouses: true }
        }
      }
    });

    if (companyInfo?.subscriptionPlan) {
      if (companyInfo._count.warehouses >= companyInfo.subscriptionPlan.maxBranches) {
        throw new Error(`عذراً، لقد وصلت للحد الأقصى المسموح به للفروع/المستودعات (${companyInfo.subscriptionPlan.maxBranches}) في باقتك الحالية.`);
      }
    }

    // Auto-generate code if empty
    let code = data.code;
    if (!code) {
      const count = await prisma.warehouse.count({ where: { companyId } });
      code = `WH-${(count + 1).toString().padStart(3, '0')}`;
    }

    const w = await prisma.warehouse.create({
      data: {
        companyId,
        code,
        name: data.name,
        nameAr: data.nameAr || null,
        location: data.location || null
      }
    });
    revalidatePath('/warehouses');
    revalidatePath('/inventory');
    revalidatePath('/sales');
    return { success: true, warehouse: w };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateWarehouse(id: string, data: any) {
  try {
    const { companyId, permissions: user } = await getAuthContext();
    if (!hasPermission(user, 'inventory', 'edit')) {
      throw new Error('غير مصرح لك بتعديل المستودع');
    }

    const w = await prisma.warehouse.update({
      where: { id, companyId },
      data: {
        name: data.name,
        nameAr: data.nameAr || null,
        location: data.location || null
      }
    });
    revalidatePath('/warehouses');
    return { success: true, warehouse: w };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteWarehouse(id: string) {
  try {
    const { companyId, permissions: user } = await getAuthContext();
    if (!hasPermission(user, 'inventory', 'delete')) {
      throw new Error('غير مصرح لك بحذف المستودع');
    }

    await prisma.warehouse.delete({ where: { id, companyId } });
    revalidatePath('/warehouses');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createStockTransfer(data: {
  fromWarehouseId: string;
  toWarehouseId: string;
  notes?: string;
  items: { productId: string; quantity: number }[];
}) {
  try {
    const { companyId, permissions: user } = await getAuthContext();
    if (!hasPermission(user, 'inventory', 'create')) {
      throw new Error('غير مصرح لك بإنشاء تحويل مخزني');
    }

    // Verify stock exists in fromWarehouse
    for (const item of data.items) {
      const stock = await prisma.warehouseStock.findUnique({
        where: { warehouseId_productId: { warehouseId: data.fromWarehouseId, productId: item.productId } }
      });
      if (!stock || stock.quantity < item.quantity) {
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        throw new Error(`الكمية المتوفرة للصنف ${product?.nameAr || product?.name} غير كافية في المستودع المصدر. المتوفر: ${stock?.quantity || 0}`);
      }
    }

    const count = await prisma.stockTransfer.count({ where: { companyId } });
    const transferNumber = `TRF-${(count + 1).toString().padStart(4, '0')}`;

    const transfer = await prisma.stockTransfer.create({
      data: {
        companyId,
        transferNumber,
        fromWarehouseId: data.fromWarehouseId,
        toWarehouseId: data.toWarehouseId,
        notes: data.notes || null,
        status: 'Pending',
        items: {
          create: data.items.map(i => ({
            productId: i.productId,
            quantity: i.quantity
          }))
        }
      }
    });

    revalidatePath('/warehouses');
    return { success: true, transfer };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function uploadTransferAttachment(transferId: string, url: string) {
  try {
    const { companyId, permissions: user } = await getAuthContext();
    if (!hasPermission(user, 'inventory', 'edit')) {
      throw new Error('غير مصرح لك');
    }

    await prisma.stockTransfer.update({
      where: { id: transferId, companyId },
      data: { attachmentUrl: url }
    });

    revalidatePath('/warehouses');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function dispatchStockTransfer(transferId: string) {
  try {
    const { companyId, permissions: user } = await getAuthContext();
    if (!hasPermission(user, 'inventory', 'edit')) {
      throw new Error('غير مصرح لك');
    }

    const transfer = await prisma.stockTransfer.findUnique({
      where: { id: transferId, companyId },
      include: { items: true }
    });

    if (!transfer) throw new Error('التحويل غير موجود');
    if (transfer.status !== 'Pending') throw new Error('حالة التحويل لا تسمح بالإرسال');
    if (!transfer.attachmentUrl) throw new Error('يجب إرفاق المستند الموقع أولاً');

    await prisma.$transaction(async (tx) => {
      for (const item of transfer.items) {
        // Deduct from source
        const sourceStock = await tx.warehouseStock.findUnique({
          where: { warehouseId_productId: { warehouseId: transfer.fromWarehouseId, productId: item.productId } }
        });
        if (!sourceStock || sourceStock.quantity < item.quantity) {
          throw new Error('الكمية غير كافية في المصدر أثناء الإرسال');
        }

        await tx.warehouseStock.update({
          where: { id: sourceStock.id },
          data: { quantity: { decrement: item.quantity } }
        });

        // Log deduction
        await tx.inventoryLog.create({
          data: {
            companyId,
            productId: item.productId,
            type: 'TRANSFER_OUT',
            quantity: item.quantity,
            description: `تحويل مخزني رقم ${transfer.transferNumber} تم إرساله (في الطريق)`,
            warehouseId: transfer.fromWarehouseId
          }
        });
      }

      await tx.stockTransfer.update({
        where: { id: transfer.id },
        data: { status: 'Dispatched' }
      });
    });

    revalidatePath('/warehouses');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function receiveStockTransfer(transferId: string) {
  try {
    const { companyId, permissions: user } = await getAuthContext();
    if (!hasPermission(user, 'inventory', 'edit')) {
      throw new Error('غير مصرح لك');
    }

    const transfer = await prisma.stockTransfer.findUnique({
      where: { id: transferId, companyId },
      include: { items: true }
    });

    if (!transfer) throw new Error('التحويل غير موجود');
    if (transfer.status !== 'Dispatched') throw new Error('لا يمكن استلام تحويل غير مرسل');
    if (!transfer.receiverAttachmentUrl) throw new Error('يجب إرفاق المستند الموقع من المستلم أولاً');

    await prisma.$transaction(async (tx) => {
      for (const item of transfer.items) {
        // Add to destination
        await tx.warehouseStock.upsert({
          where: { warehouseId_productId: { warehouseId: transfer.toWarehouseId, productId: item.productId } },
          create: {
            warehouseId: transfer.toWarehouseId,
            productId: item.productId,
            quantity: item.quantity,
          },
          update: { quantity: { increment: item.quantity } }
        });

        // Log addition
        await tx.inventoryLog.create({
          data: {
            companyId,
            productId: item.productId,
            type: 'TRANSFER_IN',
            quantity: item.quantity,
            description: `استلام تحويل مخزني رقم ${transfer.transferNumber}`,
            warehouseId: transfer.toWarehouseId
          }
        });
      }

      await tx.stockTransfer.update({
        where: { id: transfer.id },
        data: { status: 'Completed' }
      });
    });

    revalidatePath('/warehouses');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function cancelStockTransfer(transferId: string) {
  try {
    const { companyId, permissions: user } = await getAuthContext();
    if (!hasPermission(user, 'inventory', 'edit')) {
      throw new Error('غير مصرح لك');
    }

    const transfer = await prisma.stockTransfer.findUnique({
      where: { id: transferId, companyId },
      include: { items: true }
    });

    if (!transfer) throw new Error('التحويل غير موجود');
    if (transfer.status === 'Completed') throw new Error('لا يمكن إلغاء تحويل مكتمل');
    if (transfer.status === 'Cancelled') throw new Error('التحويل ملغي مسبقاً');

    await prisma.$transaction(async (tx) => {
      // If it was dispatched, stock was deducted from source. We must return it.
      if (transfer.status === 'Dispatched') {
        for (const item of transfer.items) {
          // Return to source
          await tx.warehouseStock.upsert({
            where: { warehouseId_productId: { warehouseId: transfer.fromWarehouseId, productId: item.productId } },
            create: {
              warehouseId: transfer.fromWarehouseId,
              productId: item.productId,
              quantity: item.quantity,
            },
            update: { quantity: { increment: item.quantity } }
          });

          // Log return
          await tx.inventoryLog.create({
            data: {
              companyId,
              productId: item.productId,
              type: 'ADJUSTMENT_ADD',
              quantity: item.quantity,
              description: `إرجاع مخزون بسبب إلغاء التحويل رقم ${transfer.transferNumber}`,
              warehouseId: transfer.fromWarehouseId
            }
          });
        }
      }

      await tx.stockTransfer.update({
        where: { id: transfer.id },
        data: { status: 'Cancelled' }
      });
    });

    revalidatePath('/warehouses');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function uploadReceiverAttachment(transferId: string, url: string) {
  try {
    const { companyId, permissions: user } = await getAuthContext();
    if (!hasPermission(user, 'inventory', 'edit')) {
      throw new Error('غير مصرح لك');
    }

    await prisma.stockTransfer.update({
      where: { id: transferId, companyId },
      data: { receiverAttachmentUrl: url }
    });

    revalidatePath('/warehouses');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
