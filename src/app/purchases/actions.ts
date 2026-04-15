'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { syncProductCostCascading } from '../sales/actions';
import { getUnitWeightInGramsServer } from '@/lib/inventory-helpers';
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
}) {
  try {
    const session = await getSession();
    const perms = session?.user?.permissions;
    if (!hasPermission(perms, 'purchases', 'create')) {
      throw new Error('غير مصرح لك بإنشاء فاتورة مشتريات');
    }

    const result = await prisma.$transaction(async (tx: any) => {
      // 1. Generate Purchase Invoice Number (e.g. PUR-2026-001)
    const count = await tx.purchaseInvoice.count();
    const invoiceNumber = `PUR-${new Date().getFullYear()}-${(count + 1).toString().padStart(3, '0')}`;

    // 2. Add Purchase Invoice to DB
    const invoice = await tx.purchaseInvoice.create({
      data: {
        invoiceNumber,
        date: new Date(data.date),
        supplierId: data.supplierId,
        totalAmount: data.subtotal,
        taxAmount: data.taxAmount,
        discount: data.discount,
        netAmount: data.netAmount,
        status: data.status,
        warehouseId: data.warehouseId, isTaxInclusive: data.isTaxInclusive,
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

    // 3. Increase Stock & Log Inventory
    for (const item of data.items) {
      const prod = await tx.product.findUnique({ where: { id: item.productId } });
      if (prod) {
        const currentStock = prod.stockQuantity || 0;
        const currentCost = prod.costPrice || 0;
        
        // Normalize unit prices to main unit
        const mainUnitWeight = await getUnitWeightInGramsServer(1, prod.unitId, prod.id);
        const purchaseUnitWeight = await getUnitWeightInGramsServer(1, item.unitId || prod.unitId, prod.id);
        
        const purchasePriceInMainUnit = mainUnitWeight > 0 
          ? (item.unitPrice / purchaseUnitWeight) * mainUnitWeight 
          : item.unitPrice;

        const normalizedQty = mainUnitWeight > 0 ? (item.quantity * purchaseUnitWeight) / mainUnitWeight : item.quantity;

        await tx.product.update({
          where: { id: item.productId },
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

      const unit = await tx.unitOfMeasure.findUnique({ where: { id: item.unitId || '' } });
      const product = await tx.product.findUnique({ where: { id: item.productId }, include: { unitRef: true } });

      await tx.inventoryLog.create({
        data: {
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
    // Correct balanced entry for a purchase invoice with VAT:
    //   DR  Inventory / Stock           = subtotal - discount  (cost of goods)
    //   DR  VAT Receivable (Input Tax)  = taxAmount            (recoverable VAT)
    //   CR  [Selected Account]          = netAmount            (total paid)
    // Total DR = Total CR  ✓
    
    const inventoryAccount = await tx.account.findUnique({ where: { code: '1140' } });

    // Determine the credit account:
    // - If 'Immediate Payment': use the account the user selected in the modal
    // - If 'On Credit': use Accounts Payable (auto-create if missing)
    let creditAccountId: string | null = null;
    if (data.paymentType === 'paid' && data.paymentAccountId) {
      creditAccountId = data.paymentAccountId;
    } else {
      const supplierCode = invoice.supplier.code;
      let qry = { where: { code: { in: [`2000-${supplierCode}`, `2001-${supplierCode}`] } } };
      let payablesAccount = await tx.account.findFirst(qry);
      if (!payablesAccount) {
        payablesAccount = await tx.account.findUnique({ where: { code: '2000' } }) ?? await tx.account.findUnique({ where: { code: '2001' } });
        if (!payablesAccount) {
          payablesAccount = await tx.account.create({
            data: { code: '2000', name: 'Accounts Payable', nameAr: 'ذمم دائنة - موردين', type: 'Liability' }
          });
        }
      }
      creditAccountId = payablesAccount.id;
    }

    // Ensure VAT Receivable (Input Tax) account exists
    let vatInputAccount = await tx.account.findUnique({ where: { code: '1150' } });
    if (!vatInputAccount) {
      vatInputAccount = await tx.account.create({
        data: { code: '1150', name: 'VAT Receivable (Input Tax)', nameAr: 'ضريبة القيمة المضافة المدفوعة', type: 'Asset' }
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

      // Add VAT Input line only if there is actual tax
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
          reference: `JVP-${invoiceNumber}`,
          date: new Date(data.date),
          description: `Purchase Invoice ${invoiceNumber} - ${data.paymentType === 'paid' ? 'Cash Purchase' : 'Credit Purchase'}`,
          status: 'Posted',
          entries: { create: entries }
        }
      });

      await tx.purchaseInvoice.update({
        where: { id: invoice.id },
        data: { journalVoucherId: gv.id }
      });
    }

    // 5. Update Supplier Balance if credit
    if (data.paymentType === 'credit') {
      await tx.supplier.update({
        where: { id: data.supplierId },
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

// ─── UPDATE PURCHASE INVOICE ──────────────────────────────────────────────
export async function updatePurchaseInvoice(invoiceId: string, data: any) {
  try {
    const session = await getSession();
    const perms = session?.user?.permissions;
    if (!hasPermission(perms, 'purchases', 'edit')) {
      throw new Error('غير مصرح لك بتعديل الفواتير');
    }

    const result = await prisma.$transaction(async (tx: any) => {
    // 1. Fetch old invoice
    const oldInvoice = await tx.purchaseInvoice.findUnique({
      where: { id: invoiceId },
      include: { items: true }
    });
    if (!oldInvoice) throw new Error('Invoice not found');
    const invoiceNumber = oldInvoice.invoiceNumber;

    // 2. Reverse stock additions with unit awareness
    for (const item of oldInvoice.items) {
      const prod = await tx.product.findUnique({ where: { id: item.productId } });
      if (prod) {
          const mainUnitWeight = await getUnitWeightInGramsServer(1, prod.unitId, prod.id);
          const purchaseUnitWeight = await getUnitWeightInGramsServer(1, item.unitId || prod.unitId, prod.id);
          const normalizedQty = mainUnitWeight > 0 ? (item.quantity * purchaseUnitWeight) / mainUnitWeight : item.quantity;

          await tx.product.update({
            where: { id: item.productId },
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
    await tx.inventoryLog.deleteMany({ where: { referenceId: invoiceId } });
    if (oldInvoice.journalVoucherId) {
      await tx.journalEntry.deleteMany({ where: { journalVoucherId: oldInvoice.journalVoucherId } });
      await tx.journalVoucher.delete({ where: { id: oldInvoice.journalVoucherId } });
    }

    // 4. Delete old purchase items
    await tx.purchaseItem.deleteMany({ where: { invoiceId } });

    // 5. Update invoice
    const invoice = await tx.purchaseInvoice.update({
      where: { id: invoiceId },
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
      const prod = await tx.product.findUnique({ where: { id: item.productId } });
      if (prod) {
        const currentStock = prod.stockQuantity || 0;
        const currentCost = prod.costPrice || 0;
        
        const mainUnitWeight = await getUnitWeightInGramsServer(1, prod.unitId, prod.id);
        const purchaseUnitWeight = await getUnitWeightInGramsServer(1, item.unitId || prod.unitId, prod.id);
        
        const purchasePriceInMainUnit = mainUnitWeight > 0 
          ? (item.unitPrice / purchaseUnitWeight) * mainUnitWeight 
          : item.unitPrice;

        const normalizedQty = mainUnitWeight > 0 ? (item.quantity * purchaseUnitWeight) / mainUnitWeight : item.quantity;

        await tx.product.update({
          where: { id: item.productId },
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

    // 7. Handle Accounting Link (Journal Voucher)
    const inventoryAccount = await tx.account.findUnique({ where: { code: '1301' } });

    let creditAccountId: string | null = null;
    if (data.paymentType === 'paid' && data.paymentAccountId) {
      creditAccountId = data.paymentAccountId;
    } else {
      const supplierSubAccountCode = `2000-${invoice.supplier.code}`;
      let payablesAccount = await tx.account.findUnique({ where: { code: supplierSubAccountCode } });
      if (!payablesAccount) {
        payablesAccount = await tx.account.findUnique({ where: { code: '2000' } }) ?? await tx.account.findUnique({ where: { code: '2001' } });
        if (!payablesAccount) {
          payablesAccount = await tx.account.create({
            data: { code: '2000', name: 'Accounts Payable', nameAr: 'ذمم دائنة - موردين', type: 'Liability' }
          });
        }
      }
      creditAccountId = payablesAccount.id;
    }

    let vatInputAccount = await tx.account.findUnique({ where: { code: '1401' } });
    if (!vatInputAccount) {
      vatInputAccount = await tx.account.create({
        data: { code: '1401', name: 'VAT Receivable (Input Tax)', nameAr: 'ضريبة القيمة المضافة المدفوعة', type: 'Asset' }
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
          reference: `JVP-${invoiceNumber}-U`,
          date: new Date(data.date),
          description: `Purchase Invoice ${invoiceNumber} - ${data.paymentType === 'paid' ? 'Cash Purchase' : 'Credit Purchase'} (Updated)`,
          status: 'Posted',
          entries: { create: entries }
        }
      });

      await tx.purchaseInvoice.update({
        where: { id: invoice.id },
        data: { journalVoucherId: gv.id }
      });
    }

    // 8. Update Supplier Balance
    if (oldInvoice.status !== 'Paid') {
       await tx.supplier.update({
         where: { id: oldInvoice.supplierId },
         data: { balance: { decrement: oldInvoice.netAmount } }
       });
    }
    if (data.paymentType === 'credit') {
       await tx.supplier.update({
         where: { id: data.supplierId },
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

// ─── DELETE PURCHASE INVOICE ──────────────────────────────────────────────
export async function deletePurchaseInvoice(invoiceId: string) {
  try {
    const session = await getSession();
    const perms = session?.user?.permissions;
    if (!hasPermission(perms, 'purchases', 'delete')) {
      throw new Error('غير مصرح لك بحذف الفواتير');
    }

    await prisma.$transaction(async (tx: any) => {
      const invoice = await tx.purchaseInvoice.findUnique({
        where: { id: invoiceId },
        include: { items: true }
      });
      if (!invoice) throw new Error('Invoice not found');

      // 1. Reverse stock additions
      for (const item of invoice.items) {
        const prod = await tx.product.findUnique({ where: { id: item.productId } });
        if (prod) {
            const mainUnitWeight = await getUnitWeightInGramsServer(1, prod.unitId, prod.id);
            const purchaseUnitWeight = await getUnitWeightInGramsServer(1, item.unitId || prod.unitId, prod.id);
            const normalizedQty = mainUnitWeight > 0 ? (item.quantity * purchaseUnitWeight) / mainUnitWeight : item.quantity;

            await tx.product.update({
              where: { id: item.productId },
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
      await tx.inventoryLog.deleteMany({ where: { referenceId: invoiceId } });

      // 3. Delete linked journal voucher
      if (invoice.journalVoucherId) {
        await tx.journalEntry.deleteMany({ where: { journalVoucherId: invoice.journalVoucherId } });
        await tx.journalVoucher.delete({ where: { id: invoice.journalVoucherId } });
      }

      // 4. Update Supplier Balance
      if (invoice.status !== 'Paid') {
         await tx.supplier.update({
           where: { id: invoice.supplierId },
           data: { balance: { decrement: invoice.netAmount } }
         });
      }

      // 4. Delete purchase items then invoice
      await tx.purchaseItem.deleteMany({ where: { invoiceId } });
      await tx.purchaseInvoice.delete({ where: { id: invoiceId } });
    });

    revalidatePath('/purchases');
    revalidatePath('/financial');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ─── UPDATE PURCHASE INVOICE STATUS ──────────────────────────────────────
export async function updatePurchaseInvoiceStatus(invoiceId: string, status: string) {
  try {
    await prisma.purchaseInvoice.update({
      where: { id: invoiceId },
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
    const session = await getSession();
    const perms = session?.user?.permissions;
    if (!hasPermission(perms, 'contacts', 'create')) {
      throw new Error('غير مصرح لك بإدارة الموردين');
    }

    const supplier = await prisma.$transaction(async (tx) => {
      // 1. Create the supplier
      const supp = await tx.supplier.create({ data });

      // 2. Ensure Accounts Payable (Liability) exists
      let apAccount = await tx.account.findUnique({ where: { code: '2000' } });
      if (!apAccount) {
        apAccount = await tx.account.create({
          data: { code: '2000', name: 'Accounts Payable', nameAr: 'الذمم الدائنة', type: 'Liability' }
        });
      }

      // 3. Ensure 'Suppliers' (2000) exists as child of AP
      let suppliersGroup = await tx.account.findUnique({ where: { code: '2000' } });
      if (!suppliersGroup) {
        suppliersGroup = await tx.account.create({
          data: { code: '2000', name: 'Suppliers', nameAr: 'الموردون', type: 'Liability', parentId: apAccount.id }
        });
      }

      // 4. Create local account for this specific supplier
      await tx.account.create({
        data: {
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
    const session = await getSession();
    const perms = session?.user?.permissions;
    if (!hasPermission(perms, 'contacts', 'edit')) {
      throw new Error('غير مصرح لك بإدارة الموردين');
    }

    const original = await prisma.supplier.findUnique({ where: { id } });
    if (!original) throw new Error('Supplier not found');

    const supplier = await prisma.$transaction(async (tx) => {
      const supp = await tx.supplier.update({
        where: { id },
        data
      });

      // Update linked account if exists
      const accountCode = `2000-${original.code}`;
      const account = await tx.account.findUnique({ where: { code: accountCode } });
      if (account) {
        await tx.account.update({
          where: { id: account.id },
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
    const session = await getSession();
    const perms = session?.user?.permissions;
    if (!hasPermission(perms, 'contacts', 'delete')) {
      throw new Error('غير مصرح لك بحذف الموردين');
    }

    const original = await prisma.supplier.findUnique({ where: { id } });
    if (!original) throw new Error('Supplier not found');

    await prisma.$transaction(async (tx) => {
      // 1. Delete supplier
      await tx.supplier.delete({ where: { id } });

      // 2. Delete linked account (only if no entries exist)
      const accountCode = `2000-${original.code}`;
      const account = await tx.account.findUnique({ 
        where: { code: accountCode },
        include: { entries: true }
      });
      if (account && account.entries.length === 0) {
        await tx.account.delete({ where: { id: account.id } });
      }
    });

    revalidatePath('/purchases');
    revalidatePath('/ledger');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
