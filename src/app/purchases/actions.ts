'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { getActiveBranch } from '@/lib/branch';
import { syncProductCostCascading } from '../sales/actions';
import { getUnitWeightInGramsServer } from '@/lib/inventory-helpers';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

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

export async function uploadAttachmentBase64(data: { name: string, base64: string }) {
  try {
    const { permissions } = await getAuthContext();
    if (!permissions) throw new Error('Unauthorized');

    if (!data.base64) return { success: false, error: 'No file data' };

    const base64Data = data.base64.replace(/^data:(.*);base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const uploadDir = join(process.cwd(), 'public', 'uploads');
    try { await mkdir(uploadDir, { recursive: true }); } catch (e) {}

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = uniqueSuffix + '-' + data.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = join(uploadDir, filename);

    await writeFile(path, buffer);
    return { success: true, url: `/uploads/${filename}` };
  } catch (error: any) {
    console.error('Upload Error:', error);
    return { success: false, error: error.message };
  }
}

export async function createPurchaseInvoice(data: {
  supplierId: string;
  date: string;
  items: any[];
  subtotal: number;
  taxAmount: number;
  discount: number;
  netAmount: number;
  status: string;
  paymentType: 'paid' | 'credit';
  paymentAccountId: string | null;
  notes?: string;
  lang?: string;
  warehouseId?: string;
  isTaxInclusive?: boolean;
  attachmentUrl?: string | null;
  orderId?: string | null;
  currency?: string;
  exchangeRate?: number;
}) {
  try {
    const { companyId, permissions } = await getAuthContext();
    if (!hasPermission(permissions, 'purchases', 'create')) {
      throw new Error('غير مصرح لك بإنشاء فاتورة مشتريات');
    }

    const result = await prisma.$transaction(async (tx: any) => {
      // 1. Generate Purchase Invoice Number (scoped to company)
      const count = await tx.purchaseInvoice.count({ where: { companyId } });
      const invoiceNumber = `PUR-${new Date().getFullYear()}-${(count + 1).toString().padStart(3, '0')}`;

      const branchId = await getActiveBranch();

      // 2. Add Purchase Invoice to DB
      const invoice = await tx.purchaseInvoice.create({
        data: {
          companyId,
          branchId,
          invoiceNumber,
          date: new Date(data.date),
          supplierId: data.supplierId,
          totalAmount: data.subtotal,
          taxAmount: data.taxAmount,
          discount: data.discount,
          netAmount: data.netAmount,
          status: data.status,
          warehouseId: data.warehouseId || null, 
          isTaxInclusive: data.isTaxInclusive,
          attachmentUrl: data.attachmentUrl || null,
          currency: data.currency || 'SAR',
          exchangeRate: data.exchangeRate || 1.0,
          items: {
            create: (data.items || []).map((i: any) => ({
              productId: i.productId,
              unitId: i.unitId || null,
              quantity: Number(i.quantity) || 0,
              unitPrice: Number(i.unitPrice) || 0,
              total: Number(i.total) || 0
            }))
          }
        },
        include: { supplier: true }
      });

      // 3. Increase Stock & Log Inventory
      for (const item of data.items) {
        const prod = await tx.product.findFirst({ 
          where: { id: item.productId, companyId } 
        });
        if (prod) {
          // Normalize unit prices to main unit
          const mainUnitWeight = await getUnitWeightInGramsServer(1, prod.unitId, prod.id);
          const purchaseUnitWeight = await getUnitWeightInGramsServer(1, item.unitId || prod.unitId, prod.id);
          
          const purchasePriceInMainUnit = mainUnitWeight > 0 
            ? (item.unitPrice / purchaseUnitWeight) * mainUnitWeight 
            : item.unitPrice;

          const normalizedQty = mainUnitWeight > 0 ? (item.quantity * purchaseUnitWeight) / mainUnitWeight : item.quantity;

          await tx.product.update({
            where: { id: item.productId, companyId },
            data: {
              stockQuantity: { increment: normalizedQty },
              costPrice: purchasePriceInMainUnit
            }
          });

          // Trigger cascading update for recipes
          await syncProductCostCascading(item.productId, tx);
        }

        // Update specific warehouse stock
        if (data.warehouseId) {
          const ws = await tx.warehouseStock.findUnique({
            where: { warehouseId_productId: { warehouseId: data.warehouseId, productId: item.productId } }
          });
          if (ws) {
            await tx.warehouseStock.update({
              where: { id: ws.id },
              data: { quantity: { increment: item.quantity } }
            });
          } else {
            await tx.warehouseStock.create({
              data: { warehouseId: data.warehouseId, productId: item.productId, quantity: item.quantity }
            });
          }
        }

        await tx.inventoryLog.create({
          data: {
            companyId,
            productId: item.productId,
            warehouseId: data.warehouseId,
            type: 'Purchase',
            quantity: item.quantity,
            referenceId: invoice.id,
            description: data.lang === 'ar' 
              ? `فاتورة مشتريات رقم: ${invoiceNumber}` 
              : `Purchase Invoice No: ${invoiceNumber}`
          }
        });
      }

      // 4. Handle Accounting Link (Journal Voucher)
      const inventoryAccount = await tx.account.findFirst({ 
        where: { code: '1140', companyId } 
      });

      let creditAccountId: string | null = null;
      if (data.paymentType === 'paid' && data.paymentAccountId) {
        creditAccountId = data.paymentAccountId;
      } else {
        const supplierCode = invoice.supplier.code;
        let payablesAccount = await tx.account.findFirst({
          where: { code: { in: [`2000-${supplierCode}`, `2001-${supplierCode}`] }, companyId }
        });
        if (!payablesAccount) {
          payablesAccount = await tx.account.findFirst({ 
            where: { code: { in: ['2000', '2001'] }, companyId } 
          });
          if (!payablesAccount) {
            payablesAccount = await tx.account.create({
              data: { companyId, code: '2000', name: 'Accounts Payable', nameAr: 'ذمم دائنة - موردين', type: 'Liability' }
            });
          }
        }
        creditAccountId = payablesAccount.id;
      }

      let vatInputAccount = await tx.account.findFirst({ 
        where: { code: '1150', companyId } 
      });
      if (!vatInputAccount) {
        vatInputAccount = await tx.account.create({
          data: { companyId, code: '1150', name: 'VAT Receivable (Input Tax)', nameAr: 'ضريبة القيمة المضافة المدفوعة', type: 'Asset' }
        });
      }

      if (inventoryAccount && creditAccountId) {
        const inventoryCost = data.subtotal - data.discount;
        const entries: any[] = [
          {
            accountId: inventoryAccount.id,
            date: new Date(data.date),
            description: `Inventory cost for purchase ${invoiceNumber}`,
            debit: inventoryCost,
            credit: 0
          },
          {
            accountId: creditAccountId,
            date: new Date(data.date),
            description: `${data.paymentType === 'paid' ? 'Cash paid' : 'Payable'} for purchase ${invoiceNumber}`,
            debit: 0,
            credit: data.netAmount
          }
        ];

        if (data.taxAmount > 0 && vatInputAccount) {
          entries.splice(1, 0, {
            accountId: vatInputAccount.id,
            date: new Date(data.date),
            description: `Input VAT 15% for ${invoiceNumber}`,
            debit: data.taxAmount,
            credit: 0
          });
        }

        const gv = await tx.journalVoucher.create({
          data: {
            companyId,
            branchId,
            reference: `JVP-${invoiceNumber}`,
            date: new Date(data.date),
            description: `Purchase Invoice ${invoiceNumber} - ${data.paymentType === 'paid' ? 'Cash Purchase' : 'Credit Purchase'}`,
            status: 'Posted',
            entries: { create: entries }
          }
        });

        await tx.purchaseInvoice.update({
          where: { id: invoice.id, companyId },
          data: { journalVoucherId: gv.id }
        });
      }

      if (data.paymentType === 'credit') {
        await tx.supplier.update({
          where: { id: data.supplierId, companyId },
          data: { balance: { increment: data.netAmount } }
        });
      }

      if (data.orderId) {
        await tx.purchaseOrder.update({
          where: { id: data.orderId },
          data: { status: 'Closed' }
        });
      }

      return invoice;
    });

    revalidatePath('/purchases');
    revalidatePath('/sales');
    revalidatePath('/financial');
    return { success: true, invoice: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updatePurchaseInvoice(invoiceId: string, data: any) {
  try {
    const { companyId, permissions } = await getAuthContext();
    if (!hasPermission(permissions, 'purchases', 'edit')) {
      throw new Error('غير مصرح لك بتعديل الفواتير');
    }

    const result = await prisma.$transaction(async (tx: any) => {
    // 1. Fetch old invoice
    const oldInvoice = await tx.purchaseInvoice.findFirst({
      where: { id: invoiceId, companyId },
      include: { items: true }
    });
    if (!oldInvoice) throw new Error('Invoice not found');
    const invoiceNumber = oldInvoice.invoiceNumber;

    // 2. Reverse stock additions
    for (const item of oldInvoice.items) {
      const prod = await tx.product.findFirst({ 
        where: { id: item.productId, companyId } 
      });
      if (prod) {
          const mainUnitWeight = await getUnitWeightInGramsServer(1, prod.unitId, prod.id);
          const purchaseUnitWeight = await getUnitWeightInGramsServer(1, item.unitId || prod.unitId, prod.id);
          const normalizedQty = mainUnitWeight > 0 ? (item.quantity * purchaseUnitWeight) / mainUnitWeight : item.quantity;

          await tx.product.update({
            where: { id: item.productId, companyId },
            data: { stockQuantity: { decrement: normalizedQty } }
          });
          if (oldInvoice.warehouseId) {
            await tx.warehouseStock.updateMany({
              where: { warehouseId: oldInvoice.warehouseId, productId: item.productId },
              data: { quantity: { decrement: normalizedQty } }
            });
          }
      }
    }

    // 3. Delete inventory logs & journal entries
    await tx.inventoryLog.deleteMany({ where: { referenceId: invoiceId, companyId } });
    if (oldInvoice.journalVoucherId) {
      await tx.journalEntry.deleteMany({ 
        where: { journalVoucher: { id: oldInvoice.journalVoucherId, companyId } } 
      });
      await tx.journalVoucher.delete({ where: { id: oldInvoice.journalVoucherId, companyId } });
    }

    // 4. Delete old purchase items
    await tx.purchaseItem.deleteMany({ 
      where: { invoice: { id: invoiceId, companyId } } 
    });

    // 5. Update invoice
    const invoice = await tx.purchaseInvoice.update({
      where: { id: invoiceId, companyId },
      data: {
        date: new Date(data.date),
        supplierId: data.supplierId,
        totalAmount: data.subtotal,
        taxAmount: data.taxAmount,
        discount: data.discount,
        netAmount: data.netAmount,
        status: data.status,
        warehouseId: data.warehouseId,
        journalVoucherId: null,
        attachmentUrl: data.attachmentUrl !== undefined ? data.attachmentUrl : null,
        currency: data.currency || 'SAR',
        exchangeRate: data.exchangeRate || 1.0,
        items: {
          create: data.items.map((i: any) => ({
            productId: i.productId,
            unitId: i.unitId,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            total: i.total
          }))
        }
      },
      include: { supplier: true }
    });

    // 6. Increase Stock & Log Inventory
    for (const item of data.items) {
      const prod = await tx.product.findFirst({ 
        where: { id: item.productId, companyId } 
      });
      if (prod) {
        const mainUnitWeight = await getUnitWeightInGramsServer(1, prod.unitId, prod.id);
        const purchaseUnitWeight = await getUnitWeightInGramsServer(1, item.unitId || prod.unitId, prod.id);
        
        const purchasePriceInMainUnit = mainUnitWeight > 0 
          ? (item.unitPrice / purchaseUnitWeight) * mainUnitWeight 
          : item.unitPrice;

        const normalizedQty = mainUnitWeight > 0 ? (item.quantity * purchaseUnitWeight) / mainUnitWeight : item.quantity;

        await tx.product.update({
          where: { id: item.productId, companyId },
          data: {
            stockQuantity: { increment: normalizedQty },
            costPrice: purchasePriceInMainUnit
          }
        });

        await syncProductCostCascading(item.productId, tx);
      }

      if (data.warehouseId) {
        const ws = await tx.warehouseStock.findUnique({
          where: { warehouseId_productId: { warehouseId: data.warehouseId, productId: item.productId } }
        });
        if (ws) {
          await tx.warehouseStock.update({
            where: { id: ws.id },
            data: { quantity: { increment: item.quantity } }
          });
        } else {
          await tx.warehouseStock.create({
            data: { warehouseId: data.warehouseId, productId: item.productId, quantity: item.quantity }
          });
        }
      }

      await tx.inventoryLog.create({
        data: {
          companyId,
          productId: item.productId,
          warehouseId: data.warehouseId,
          unitId: item.unitId,
          type: 'Purchase',
          quantity: item.quantity,
          referenceId: invoice.id,
          description: data.lang === 'ar'
            ? `تعديل فاتورة مشتريات رقم: ${invoiceNumber}`
            : `Purchase Invoice No: ${invoiceNumber} (Updated)`
        }
      });
    }

    // 7. Handle Accounting Link
    const inventoryAccount = await tx.account.findFirst({ where: { code: '1140', companyId } });

    let creditAccountId: string | null = null;
    if (data.paymentType === 'paid' && data.paymentAccountId) {
      creditAccountId = data.paymentAccountId;
    } else {
      const supplierSubAccountCode = `2000-${invoice.supplier.code}`;
      let payablesAccount = await tx.account.findFirst({ where: { code: supplierSubAccountCode, companyId } });
      if (!payablesAccount) {
        payablesAccount = await tx.account.findFirst({ 
          where: { code: { in: ['2000', '2001'] }, companyId } 
        });
        if (!payablesAccount) {
          payablesAccount = await tx.account.create({
            data: { companyId, code: '2000', name: 'Accounts Payable', nameAr: 'ذمم دائنة - موردين', type: 'Liability' }
          });
        }
      }
      creditAccountId = payablesAccount.id;
    }

    let vatInputAccount = await tx.account.findFirst({ where: { code: '1150', companyId } });
    if (!vatInputAccount) {
      vatInputAccount = await tx.account.create({
        data: { companyId, code: '1150', name: 'VAT Receivable (Input Tax)', nameAr: 'ضريبة القيمة المضافة المدفوعة', type: 'Asset' }
      });
    }

    if (inventoryAccount && creditAccountId) {
      const inventoryCost = data.subtotal - data.discount;
      const entries: any[] = [
        {
          accountId: inventoryAccount.id,
          date: new Date(data.date),
          description: `Inventory cost for purchase ${invoiceNumber}`,
          debit: inventoryCost,
          credit: 0
        },
        {
          accountId: creditAccountId,
          date: new Date(data.date),
          description: `${data.paymentType === 'paid' ? 'Cash paid' : 'Payable'} for purchase ${invoiceNumber}`,
          debit: 0,
          credit: data.netAmount
        }
      ];

      if (data.taxAmount > 0 && vatInputAccount) {
        entries.splice(1, 0, {
          accountId: vatInputAccount.id,
          date: new Date(data.date),
          description: `Input VAT 15% for ${invoiceNumber}`,
          debit: data.taxAmount,
          credit: 0
        });
      }

      const gv = await tx.journalVoucher.create({
        data: {
          companyId,
          reference: `JVP-${invoiceNumber}-U`,
          date: new Date(data.date),
          description: `Purchase Invoice ${invoiceNumber} - ${data.paymentType === 'paid' ? 'Cash Purchase' : 'Credit Purchase'} (Updated)`,
          status: 'Posted',
          entries: { create: entries }
        }
      });

      await tx.purchaseInvoice.update({
        where: { id: invoice.id, companyId },
        data: { journalVoucherId: gv.id }
      });
    }

    // 8. Update Supplier Balance
    if (oldInvoice.status !== 'Paid') {
       await tx.supplier.update({
         where: { id: oldInvoice.supplierId, companyId },
         data: { balance: { decrement: oldInvoice.netAmount } }
       });
    }
    if (data.paymentType === 'credit') {
       await tx.supplier.update({
         where: { id: data.supplierId, companyId },
         data: { balance: { increment: data.netAmount } }
       });
    }

    return invoice;
    });

    revalidatePath('/purchases');
    revalidatePath('/sales');
    revalidatePath('/financial');
    return { success: true, invoice: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deletePurchaseInvoice(invoiceId: string) {
  try {
    const { companyId, permissions } = await getAuthContext();
    if (!hasPermission(permissions, 'purchases', 'delete')) {
      throw new Error('غير مصرح لك بحذف الفواتير');
    }

    await prisma.$transaction(async (tx: any) => {
      const invoice = await tx.purchaseInvoice.findFirst({
        where: { id: invoiceId, companyId },
        include: { items: true }
      });
      if (!invoice) throw new Error('Invoice not found');

      // 1. Reverse stock additions
      for (const item of invoice.items) {
        const prod = await tx.product.findFirst({ where: { id: item.productId, companyId } });
        if (prod) {
            const mainUnitWeight = await getUnitWeightInGramsServer(1, prod.unitId, prod.id);
            const purchaseUnitWeight = await getUnitWeightInGramsServer(1, item.unitId || prod.unitId, prod.id);
            const normalizedQty = mainUnitWeight > 0 ? (item.quantity * purchaseUnitWeight) / mainUnitWeight : item.quantity;

            await tx.product.update({
              where: { id: item.productId, companyId },
              data: { stockQuantity: { decrement: normalizedQty } }
            });
            if (invoice.warehouseId) {
              await tx.warehouseStock.updateMany({
                where: { warehouseId: invoice.warehouseId, productId: item.productId },
                data: { quantity: { decrement: normalizedQty } }
              });
            }
        }
      }

      // 2. Delete inventory logs
      await tx.inventoryLog.deleteMany({ where: { referenceId: invoiceId, companyId } });

      // 3. Delete linked journal voucher
      if (invoice.journalVoucherId) {
        await tx.journalEntry.deleteMany({ 
          where: { journalVoucher: { id: invoice.journalVoucherId, companyId } } 
        });
        await tx.journalVoucher.delete({ where: { id: invoice.journalVoucherId, companyId } });
      }

      // 4. Update Supplier Balance
      if (invoice.status !== 'Paid') {
         await tx.supplier.update({
           where: { id: invoice.supplierId, companyId },
           data: { balance: { decrement: invoice.netAmount } }
         });
      }

      // 5. Delete purchase items then invoice
      await tx.purchaseItem.deleteMany({ 
        where: { invoice: { id: invoiceId, companyId } } 
      });
      await tx.purchaseInvoice.delete({ where: { id: invoiceId, companyId } });
    });

    revalidatePath('/purchases');
    revalidatePath('/financial');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updatePurchaseInvoiceStatus(invoiceId: string, status: string) {
  try {
    const { companyId } = await getAuthContext();
    await prisma.purchaseInvoice.update({
      where: { id: invoiceId, companyId },
      data: { status }
    });
    revalidatePath('/purchases');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createSupplier(data: { address?: string, taxNumber?: string, commercialRegistry?: string, name: string, nameAr?: string, code: string, phone?: string, email?: string }) {
  try {
    const { companyId, permissions } = await getAuthContext();
    if (!hasPermission(permissions, 'contacts', 'create')) {
      throw new Error('غير مصرح لك بإدارة الموردين');
    }

    const supplier = await prisma.$transaction(async (tx) => {
      // 1. Create the supplier
      const supp = await tx.supplier.create({ 
        data: { ...data, companyId } 
      });

      // 2. Ensure Accounts Payable (Liability) exists for this company
      let apAccount = await tx.account.findFirst({ where: { code: '2000', companyId } });
      if (!apAccount) {
        apAccount = await tx.account.create({
          data: { companyId, code: '2000', name: 'Accounts Payable', nameAr: 'الذمم الدائنة', type: 'Liability' }
        });
      }

      // 3. Ensure 'Suppliers' (2000) exists as child of AP
      let suppliersGroup = await tx.account.findFirst({ where: { code: '2000', companyId } });
      if (!suppliersGroup) {
        suppliersGroup = await tx.account.create({
          data: { companyId, code: '2000', name: 'Suppliers', nameAr: 'الموردون', type: 'Liability', parentId: apAccount.id }
        });
      }

      // 4. Create local account for this specific supplier
      await tx.account.create({
        data: {
          companyId,
          code: `2000-${data.code}`,
          name: data.name,
          nameAr: data.nameAr || undefined,
          type: 'Liability',
          parentId: suppliersGroup.id
        }
      });

      return supp;
    });

    revalidatePath('/purchases');
    revalidatePath('/ledger');
    revalidatePath('/financial');
    return { success: true, supplier };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateSupplier(id: string, data: { address?: string, taxNumber?: string, commercialRegistry?: string, name: string, nameAr?: string, code: string, phone?: string, email?: string }) {
  try {
    const { companyId, permissions } = await getAuthContext();
    if (!hasPermission(permissions, 'contacts', 'edit')) {
      throw new Error('غير مصرح لك بإدارة الموردين');
    }

    const original = await prisma.supplier.findFirst({ where: { id, companyId } });
    if (!original) throw new Error('Supplier not found');

    const supplier = await prisma.$transaction(async (tx) => {
      const supp = await tx.supplier.update({
        where: { id, companyId },
        data
      });

      // Update linked account if exists
      const accountCode = `2000-${original.code}`;
      const account = await tx.account.findFirst({ where: { code: accountCode, companyId } });
      if (account) {
        await tx.account.update({
          where: { id: account.id, companyId },
          data: {
            code: `2000-${data.code}`,
            name: data.name,
            nameAr: data.nameAr || undefined
          }
        });
      }
      return supp;
    });

    revalidatePath('/purchases');
    revalidatePath('/ledger');
    return { success: true, supplier };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteSupplier(id: string) {
  try {
    const { companyId, permissions } = await getAuthContext();
    if (!hasPermission(permissions, 'contacts', 'delete')) {
      throw new Error('غير مصرح لك بحذف الموردين');
    }

    const original = await prisma.supplier.findFirst({ where: { id, companyId } });
    if (!original) throw new Error('Supplier not found');

    await prisma.$transaction(async (tx) => {
      // 1. Delete supplier
      await tx.supplier.delete({ where: { id, companyId } });

      // 2. Delete linked account (only if no entries exist)
      const accountCode = `2000-${original.code}`;
      const account = await tx.account.findFirst({ 
        where: { code: accountCode, companyId },
        include: { entries: true }
      });
      if (account && account.entries.length === 0) {
        await tx.account.delete({ where: { id: account.id, companyId } });
      }
    });

    revalidatePath('/purchases');
    revalidatePath('/ledger');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPurchaseOrders() {
  try {
    const { companyId } = await getAuthContext();
    return await prisma.purchaseOrder.findMany({
      where: { companyId },
      include: { supplier: true, warehouse: true, items: { include: { product: true } } },
      orderBy: { date: 'desc' }
    });
  } catch (error) {
    return [];
  }
}

export async function createPurchaseOrder(data: {
  supplierId?: string | null;
  date: string;
  items: any[];
  subtotal: number;
  taxAmount: number;
  discount: number;
  netAmount: number;
  status: string;
  notes?: string;
  warehouseId?: string;
  isTaxInclusive?: boolean;
  currency?: string;
  exchangeRate?: number;
}) {
  try {
    const { companyId, permissions } = await getAuthContext();
    if (!hasPermission(permissions, 'purchases', 'create')) {
      throw new Error('غير مصرح لك بإنشاء طلب شراء');
    }

    const count = await prisma.purchaseOrder.count({ where: { companyId } });
    const orderNumber = `PO-${new Date().getFullYear()}-${(count + 1).toString().padStart(3, '0')}`;

    const order = await prisma.purchaseOrder.create({
      data: {
        companyId,
        branchId: (await getActiveBranch()) || null,
        orderNumber,
        date: new Date(data.date),
        supplierId: data.supplierId || null,
        totalAmount: data.subtotal,
        taxAmount: data.taxAmount,
        discount: data.discount,
        netAmount: data.netAmount,
        status: data.status,
        warehouseId: data.warehouseId || null,
        isTaxInclusive: data.isTaxInclusive,
        notes: data.notes,
        currency: data.currency || 'SAR',
        exchangeRate: data.exchangeRate || 1.0,
        items: {
          create: (data.items || []).map((i: any) => ({
            productId: i.productId,
            unitId: i.unitId,
            supplierId: i.supplierId || null,
            quantity: Number(i.quantity) || 0,
            unitPrice: Number(i.unitPrice) || 0,
            total: Number(i.total) || 0
          }))
        }
      }
    });

    revalidatePath('/purchases');
    return { success: true, order };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updatePurchaseOrder(orderId: string, data: any) {
  try {
    const { companyId, permissions } = await getAuthContext();
    if (!hasPermission(permissions, 'purchases', 'edit')) {
      throw new Error('غير مصرح لك بتعديل طلبات الشراء');
    }

    const order = await prisma.$transaction(async (tx) => {
      await tx.purchaseOrderItem.deleteMany({ 
        where: { order: { id: orderId, companyId } } 
      });
      return await tx.purchaseOrder.update({
        where: { id: orderId, companyId },
        data: {
          date: new Date(data.date),
          supplierId: data.supplierId || null,
          totalAmount: data.subtotal,
          taxAmount: data.taxAmount,
          discount: data.discount,
          netAmount: data.netAmount,
          status: data.status,
          warehouseId: data.warehouseId || null,
          notes: data.notes,
          currency: data.currency || 'SAR',
          exchangeRate: data.exchangeRate || 1.0,
          items: {
            create: (data.items || []).map((i: any) => ({
              productId: i.productId,
              unitId: i.unitId,
              supplierId: i.supplierId || null,
              quantity: Number(i.quantity) || 0,
              unitPrice: Number(i.unitPrice) || 0,
              total: Number(i.total) || 0
            }))
          }
        }
      });
    });

    revalidatePath('/purchases');
    return { success: true, order };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deletePurchaseOrder(orderId: string) {
  try {
    const { companyId, permissions } = await getAuthContext();
    if (!hasPermission(permissions, 'purchases', 'delete')) {
      throw new Error('غير مصرح لك بحذف طلبات الشراء');
    }

    await prisma.purchaseOrder.delete({ where: { id: orderId, companyId } });
    revalidatePath('/purchases');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
