'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';

export async function getUnits() {
  const units = await prisma.unitOfMeasure.findMany({ 
    include: { parentUnit: true, childUnits: true },
    orderBy: { name: 'asc' } 
  });
  if (units.length === 0) {
    const defaults = [
      { name: 'Gram', nameAr: 'جرام' },
      { name: 'Kilogram', nameAr: 'كيلوجرام' },
      { name: 'Milliliter', nameAr: 'مليليتر' },
      { name: 'Liter', nameAr: 'لتر' },
      { name: 'Carton', nameAr: 'كرتون' },
      { name: 'Piece', nameAr: 'قطعة' }
    ];
    await prisma.unitOfMeasure.createMany({ data: defaults });
    // After defaults, we can set up some sample conversions manually or just return
    return prisma.unitOfMeasure.findMany({ include: { parentUnit: true }, orderBy: { name: 'asc' } });
  }
  return units;
}

export async function createUnit(data: { name: string, nameAr?: string, parentUnitId?: string | null, conversionFactor?: number }) {
  try {
     const unit = await prisma.unitOfMeasure.create({ 
       data: { 
         name: data.name, 
         nameAr: data.nameAr || null,
         parentUnitId: data.parentUnitId || null,
         conversionFactor: data.conversionFactor || 1
       } 
     });
     revalidatePath('/sales');
     return { success: true, unit };
  } catch (err: any) {
     return { success: false, error: err.message };
  }
}

export async function updateUnit(id: string, data: any) {
  try {
     const unit = await prisma.unitOfMeasure.update({
       where: { id },
       data: {
         name: data.name,
         nameAr: data.nameAr || null,
         parentUnitId: data.parentUnitId || null,
         conversionFactor: data.conversionFactor || 1
       }
     });
     revalidatePath('/sales');
     return { success: true, unit };
  } catch (err: any) {
     return { success: false, error: err.message };
  }
}

export async function getCostCenters() {
  return prisma.costCenter.findMany({ 
    include: { 
      product: { include: { unitRef: true } }, 
      items: { include: { product: { include: { unitRef: true } }, unit: true } } 
    }, 
    orderBy: { code: 'asc' } 
  });
}

export async function createCostCenter(data: { 
  code: string, 
  name: string, 
  nameAr?: string, 
  description?: string, 
  productId?: string | null, 
  quantityUsed?: number,
  yieldWeight?: number,
  items: any[],
  totalCost?: number,
  calPer100g?: number
}) {
  try {
    const session = await getSession();
    if (!hasPermission(session?.user, 'MANAGE_FINANCIALS')) {
      throw new Error('غير مصرح لك بإدارة مراكز التكلفة');
    }

    const totalCost = data.items.reduce((sum: number, item: any) => sum + (item.quantity * item.costPrice), 0);

    const cc = await prisma.$transaction(async (tx) => {
        const createdCc = await tx.costCenter.create({
            data: {
              code: data.code,
              name: data.name,
              nameAr: data.nameAr || null,
              description: data.description || null,
              productId: data.productId || null,
              quantityUsed: data.quantityUsed || 0,
              yieldWeight: data.yieldWeight || 0,
              items: {
                create: data.items.map((item: any) => ({
                  productId: item.productId,
                  unitId: (item.unitId && item.unitId !== '') ? item.unitId : null,
                  quantity: Number(item.quantity) || 0,
                  costPrice: Number(item.costPrice) || 0,
                  ratio: Number(item.ratio) || 0
                }))
              }
            }
        });

        // Update the target product's costPrice and caloriesPer100g
        if (data.productId) {
            console.log(`Syncing Product ${data.productId}: Cost=${data.totalCost}, Calories=${data.calPer100g}`);
            await tx.product.update({
                where: { id: data.productId },
                data: { 
                  costPrice: data.totalCost ?? totalCost,
                  caloriesPer100g: data.calPer100g ?? 0
                }
            });

            await syncProductCostCascading(data.productId, tx);
        }
        return createdCc;
    });

    revalidatePath('/sales');
    revalidatePath('/inventory');
    return { success: true, costCenter: cc };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateCostCenter(id: string, data: any) {
  try {
     const finalTotalCost = data.totalCost ?? data.items.reduce((sum: number, item: any) => sum + (item.quantity * item.costPrice), 0);

     const cc = await prisma.$transaction(async (tx) => {
        // Step 1: Delete old items
        await tx.costCenterItem.deleteMany({ where: { costCenterId: id } });

        // Step 2: Update the CostCenter header only (no nested items)
        const updatedCc = await tx.costCenter.update({
          where: { id },
          data: {
            code: data.code,
            name: data.name,
            nameAr: data.nameAr || null,
            description: data.description || null,
            productId: data.productId || null,
            quantityUsed: Number(data.quantityUsed) || 0,
            yieldWeight: Number(data.yieldWeight) || 0,
          }
        });

        // Step 3: Create new items separately
        if (data.items && data.items.length > 0) {
          await tx.costCenterItem.createMany({
            data: data.items.map((item: any) => ({
              costCenterId: id,
              productId: item.productId,
              unitId: (item.unitId && item.unitId !== '') ? item.unitId : null,
              quantity: Number(item.quantity) || 0,
              costPrice: Number(item.costPrice) || 0,
              ratio: Number(item.ratio) || 0,
            }))
          });
        }

        // Step 4: Update the target product's costPrice and caloriesPer100g
        if (data.productId) {
            await tx.product.update({
                where: { id: data.productId },
                data: { 
                  costPrice: finalTotalCost,
                  caloriesPer100g: Number(data.calPer100g) || 0
                }
            });

            await syncProductCostCascading(data.productId, tx);
        }
        return updatedCc;
     });

     revalidatePath('/sales');
     revalidatePath('/inventory');
     return { success: true, costCenter: cc };
  } catch (err: any) {
     return { success: false, error: err.message };
  }
}

export async function deleteCostCenter(id: string) {
    try {
        await prisma.costCenter.delete({ where: { id } });
        revalidatePath('/sales');
        revalidatePath('/inventory');
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function getProductionOrders() {
  return prisma.productionOrder.findMany({
    include: { 
      product: { include: { unitRef: true } }, 
      warehouse: true, 
      items: { include: { product: true, unit: true } } 
    },
    orderBy: { date: 'desc' }
  });
}

async function getUnitWeightInGramsServer(qty: number, unitId: string | null, productId?: string | null): Promise<number> {
  if (!qty) return 0;
  
  // 1. Try to find the unit metadata
  let u = null;
  if (unitId) {
    u = await prisma.unitOfMeasure.findUnique({ where: { id: unitId } });
  }

  // 2. Identify by name first (standard units)
  const name = (u?.name || '').toLowerCase().trim();
  const nameAr = (u?.nameAr || '').trim();
  
  if (name === 'kilogram' || name === 'kg' || nameAr === 'كيلو' || nameAr === 'كجم') return qty * 1000;
  if (name === 'gram' || name === 'g' || name === 'gm' || nameAr === 'جرام' || nameAr === 'جم') return qty;
  if (name === 'liter' || name === 'ltr' || name === 'l' || nameAr === 'لتر') return qty * 1000;
  if (name === 'milliliter' || name === 'ml' || nameAr === 'ملي') return qty;
  
  if (name.includes('kilogram') || name.includes('كيلو')) return qty * 1000;
  if (name.includes('liter') || name.includes('لتر')) return qty * 1000;

  // 3. Fallback to product-specific unitQuantity if unitId matches product.unitId
  if (productId) {
    const prod = await prisma.product.findUnique({ where: { id: productId } });
    if (prod && unitId === prod.unitId && prod.subUnitId) {
      // It's the product's main unit, and it has a sub-unit definition
      const subWeight = await getUnitWeightInGramsServer(1, prod.subUnitId); 
      return qty * (prod.unitQuantity || 1) * subWeight;
    }
  }

  // 4. Fallback to conversion factor in unit table
  return qty * (u?.conversionFactor || 1);
}

async function calculateRecipeTotalWeightServer(recipeItems: any[]) {
  if (!recipeItems || recipeItems.length === 0) return 0;
  let total = 0;
  for (const ri of recipeItems) {
    const unitIdToUse = ri.unitId || ri.product?.unitId;
    total += await getUnitWeightInGramsServer(ri.quantity, unitIdToUse, ri.productId || ri.product?.id);
  }
  return total;
}

/**
 * Automatically syncs cost updates from components to target final products.
 * This ensures that if a raw material price changes, all recipes using it update their costs,
 * and the final product's costPrice is also updated accordingly.
 */
async function syncProductCostCascading(productId: string, tx: any, visited = new Set<string>()) {
    if (visited.has(productId)) return; // Prevent infinite loops
    visited.add(productId);

    const sourceProduct = await tx.product.findUnique({ where: { id: productId } });
    if (!sourceProduct) return;

    // 1. Calculate the weight of ONE main unit of the source product
    const sourceUnitWeight = await getUnitWeightInGramsServer(1, sourceProduct.unitId, sourceProduct.id);

    // 2. Find all recipe items (ingredients) that use this product
    const affectedRecipeItems = await tx.costCenterItem.findMany({
        where: { productId },
        include: { product: true }
    });

    for (const item of affectedRecipeItems) {
        // 3. Calculate the weight of the unit chosen in THIS recipe item
        const itemUnitWeight = await getUnitWeightInGramsServer(1, item.unitId || item.product?.unitId, item.productId);
        
        // 4. newItemCost = (PriceOfMainUnit / WeightOfMainUnit) * WeightOfItemUnit
        const newItemCost = sourceUnitWeight > 0 
            ? (sourceProduct.costPrice / sourceUnitWeight) * itemUnitWeight 
            : sourceProduct.costPrice;

        await tx.costCenterItem.update({
            where: { id: item.id },
            data: { costPrice: newItemCost }
        });
    }

    // 5. Identify unique recipes (CostCenters) affected
    const recipeIds = Array.from(new Set(affectedRecipeItems.map((ri: any) => ri.costCenterId)));

    for (const rid of recipeIds) {
        // 6. Recalculate total cost of the recipe
        const recipe = await tx.costCenter.findUnique({
            where: { id: rid },
            include: { items: true, product: true }
        });

        if (!recipe) continue;

        const totalBatchCost = recipe.items.reduce((sum: number, item: any) => sum + (item.quantity * item.costPrice), 0);
        const yieldWeight = recipe.yieldWeight || await calculateRecipeTotalWeightServer(recipe.items);
        
        if (yieldWeight === 0) continue;

        const costPerGram = totalBatchCost / yieldWeight;
        const unitWeightG = await getUnitWeightInGramsServer(1, recipe.product?.unitId, recipe.productId);
        const newTargetCostPrice = costPerGram * unitWeightG;

        if (recipe.productId) {
            await tx.product.update({
                where: { id: recipe.productId },
                data: { costPrice: newTargetCostPrice }
            });

            // Recurse to update products that might use THIS finished product as an ingredient
            await syncProductCostCascading(recipe.productId, tx, visited);
        }
    }
}

export async function createProductionOrder(data: {
  productId: string,
  quantity: number,
  warehouseId: string,
  notes?: string
}) {
  try {
     const count = await prisma.productionOrder.count();
     const orderNumber = `PO-${(count + 1).toString().padStart(4, '0')}`;

     const recipe = await prisma.costCenter.findFirst({
        where: { productId: data.productId },
        include: { items: { include: { product: { include: { unitRef: true } } } } }
     });

     if (!recipe) throw new Error('لا يوجد وصفة إنتاج (Recipe) لهذا الصنف. يرجى إنشاء وصفة أولاً.');
     
     const targetProduct = await prisma.product.findUnique({
         where: { id: data.productId }
     });

     const requestedWeightG = await getUnitWeightInGramsServer(data.quantity, targetProduct?.unitId || null, data.productId);
     const totalIngredientsWeightG = await calculateRecipeTotalWeightServer(recipe.items);
     
     // CRITICAL: Scaling factor must be (Requested Output) / (Recipe Output Weight)
     // If yieldWeight is not set, we fallback to the raw mix weight (totalIngredientsWeightG)
     const recipeYieldG = recipe.yieldWeight || totalIngredientsWeightG;
     
     if (recipeYieldG === 0) throw new Error('وصفة الإنتاج تحتوي على مكونات بدون وزن. يرجى التحقق من وحدات القياس.');
     const scaleFactor = requestedWeightG / recipeYieldG;

     const order = await prisma.productionOrder.create({
        data: {
           orderNumber,
           productId: data.productId,
           quantity: data.quantity,
           warehouseId: data.warehouseId,
           notes: data.notes,
           items: {
              create: recipe.items.map(ri => ({
                 productId: ri.productId,
                 unitId: ri.unitId,
                 quantity: ri.quantity * scaleFactor,
                 costPrice: ri.costPrice,
                 ratio: ri.ratio || 0
              }))
           }
        }
     });

     revalidatePath('/sales');
     revalidatePath('/inventory');
     return { success: true, order };
  } catch (err: any) {
     return { success: false, error: err.message };
  }
}

export async function completeProductionOrder(id: string) {
    try {
        const order = await prisma.productionOrder.findUnique({
            where: { id },
            include: { items: true }
        });
        if (!order || order.status !== 'Draft') throw new Error('طلب الإنتاج غير موجود أو تم معالجته مسبقاً');

        await prisma.$transaction(async (tx) => {
            // 1. Decrease Raw Materials
            for (const item of order.items) {
                // a. Global Stock
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stockQuantity: { decrement: item.quantity } }
                });

                // b. Warehouse-specific Stock
                await tx.warehouseStock.upsert({
                    where: { 
                        warehouseId_productId: { 
                            warehouseId: order.warehouseId, 
                            productId: item.productId 
                        } 
                    },
                    update: { quantity: { decrement: item.quantity } },
                    create: { 
                        warehouseId: order.warehouseId, 
                        productId: item.productId, 
                        quantity: -item.quantity 
                    }
                });

                await tx.inventoryLog.create({
                    data: {
                        productId: item.productId,
                        warehouseId: order.warehouseId,
                        type: 'Issue',
                        quantity: -item.quantity,
                        referenceId: order.id,
                        description: `صرف خامات لأمر إنتاج ${order.orderNumber}`
                    }
                });
            }

            // 2. Increase Finished Product
            // a. Global Stock
            await tx.product.update({
                where: { id: order.productId },
                data: { stockQuantity: { increment: order.quantity } }
            });

            // b. Warehouse-specific Stock
            await tx.warehouseStock.upsert({
                where: { 
                    warehouseId_productId: { 
                        warehouseId: order.warehouseId, 
                        productId: order.productId 
                    } 
                },
                update: { quantity: { increment: order.quantity } },
                create: { 
                    warehouseId: order.warehouseId, 
                    productId: order.productId, 
                    quantity: order.quantity 
                }
            });

            await tx.inventoryLog.create({
                data: {
                    productId: order.productId,
                    warehouseId: order.warehouseId,
                    type: 'Receipt',
                    quantity: order.quantity,
                    referenceId: order.id,
                    description: `استلام منتج تام من أمر إنتاج ${order.orderNumber}`
                }
            });

            // 3. Update Status
            await tx.productionOrder.update({
                where: { id },
                data: { status: 'Completed' }
            });
        });

        revalidatePath('/sales');
        revalidatePath('/inventory');
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function updateProductionOrder(id: string, data: any) {
    try {
        const order = await prisma.productionOrder.findUnique({ where: { id } });
        if (!order || order.status !== 'Draft') throw new Error('لا يمكن تعديل أمر إنتاج مكتمل');

        const recipe = await prisma.costCenter.findFirst({
            where: { productId: data.productId },
            include: { items: { include: { product: true } } }
        });
        if (!recipe) throw new Error('لا يوجد وصفة إنتاج لهذا الصنف');

        const updatedOrder = await prisma.$transaction(async (tx) => {
            await tx.productionOrderItem.deleteMany({ where: { productionOrderId: id } });

            // Unified scaling factor (same as creation)
            const targetProduct = await tx.product.findUnique({
                where: { id: data.productId }
            });
            
            const requestedWeightG = await getUnitWeightInGramsServer(data.quantity, targetProduct?.unitId || null, data.productId);
            const totalIngredientsWeightG = await calculateRecipeTotalWeightServer(recipe.items);
            
            const recipeYieldG = recipe.yieldWeight || totalIngredientsWeightG;
            if (recipeYieldG === 0) throw new Error('وصفة الإنتاج تحتوي على مكونات بدون وزن');
            const scaleFactor = requestedWeightG / recipeYieldG;

            return await tx.productionOrder.update({
                where: { id },
                data: {
                    productId: data.productId,
                    quantity: data.quantity,
                    warehouseId: data.warehouseId,
                    notes: data.notes,
                    items: {
                        create: recipe.items.map(ri => ({
                            productId: ri.productId,
                            unitId: ri.unitId,
                            quantity: ri.quantity * scaleFactor,
                            costPrice: ri.costPrice,
                            ratio: ri.ratio || 0
                        }))
                    }
                }
            });
        });

        revalidatePath('/sales');
        revalidatePath('/inventory');
        return { success: true, order: updatedOrder };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function finalizeProductionOrder(id: string) {
    try {
        const order = await prisma.productionOrder.findUnique({
            where: { id },
            include: { items: true, product: true }
        });

        if (!order) throw new Error('أمر الإنتاج غير موجود');
        if (order.status === 'Completed') throw new Error('أمر الإنتاج معتمد بالفعل');

        await prisma.$transaction(async (tx: any) => {
            // 1. Update order status
            await tx.productionOrder.update({
                where: { id },
                data: { status: 'Completed' }
            });

            // 2. Increase stock for finished product
            await tx.product.update({
                where: { id: order.productId },
                data: { stockQuantity: { increment: order.quantity } }
            });

            if (order.warehouseId) {
                await tx.warehouseStock.upsert({
                    where: { 
                        warehouseId_productId: { 
                            warehouseId: order.warehouseId, 
                            productId: order.productId 
                        } 
                    },
                    update: { quantity: { increment: order.quantity } },
                    create: { 
                        warehouseId: order.warehouseId, 
                        productId: order.productId, 
                        quantity: order.quantity 
                    }
                });

                // Log Finished Product entry
                await tx.inventoryLog.create({
                    data: {
                        productId: order.productId,
                        warehouseId: order.warehouseId,
                        type: 'Production Output',
                        quantity: order.quantity,
                        referenceId: order.orderNumber,
                        description: `Production of ${order.product.sku}`
                    }
                });
            }

            // 3. Decrease stock for raw materials (ingredients)
            for (const item of order.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stockQuantity: { decrement: item.quantity } }
                });

                if (order.warehouseId) {
                    await tx.warehouseStock.upsert({
                        where: { 
                            warehouseId_productId: { 
                                warehouseId: order.warehouseId, 
                                productId: item.productId 
                            } 
                        },
                        update: { quantity: { decrement: item.quantity } },
                        create: { 
                            warehouseId: order.warehouseId, 
                            productId: item.productId, 
                            quantity: -item.quantity 
                        }
                    });

                    // Log Raw Material consumption
                    await tx.inventoryLog.create({
                        data: {
                            productId: item.productId,
                            warehouseId: order.warehouseId,
                            type: 'Production Usage',
                            quantity: -item.quantity,
                            referenceId: order.orderNumber,
                            description: `Consume for ${order.product.sku} production (#${order.orderNumber})`
                        }
                    });
                }
            }
        });

        revalidatePath('/sales');
        revalidatePath('/inventory');
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function deleteProductionOrder(id: string) {
    try {
        const order = await prisma.productionOrder.findUnique({ where: { id } });
        if (!order || order.status !== 'Draft') throw new Error('لا يمكن حذف أمر إنتاج مكتمل');

        await prisma.productionOrder.delete({ where: { id } });
        revalidatePath('/sales');
        revalidatePath('/inventory');
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function createSalesInvoice(data: {
  customerId: string;
  warehouseId: string;
  date: string;
  items: any[];
  subtotal: number;
  taxAmount: number;
  discount: number;
  netAmount: number;
  status: string;
  paymentType: 'paid' | 'credit';
  receiptAccountId: string | null;
}) {
  try {
    const session = await getSession();
    if (!hasPermission(session?.user, 'CREATE_INVOICE')) {
      throw new Error('غير مصرح لك بإنشاء فاتورة مبيعات');
    }

    const result = await prisma.$transaction(async (tx: any) => {
      // 1. Generate Invoice Number (e.g. INV-2026-001)
      const count = await tx.salesInvoice.count();
      const invoiceNumber = `INV-${new Date().getFullYear()}-${(count + 1).toString().padStart(3, '0')}`;

      const finalWarehouseId = data.warehouseId || null;

      // 2. Add Invoice to DB
      const invoice = await tx.salesInvoice.create({
        data: {
          invoiceNumber,
          date: new Date(data.date),
          customerId: data.customerId,
          warehouseId: finalWarehouseId,
          totalAmount: data.subtotal,
          taxAmount: data.taxAmount,
          discount: data.discount,
          netAmount: data.netAmount,
          status: data.status,
          items: {
            create: data.items.map((i: any) => ({
              productId: i.productId,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
              total: i.total
            }))
          }
        },
        include: { customer: true }
      });

      // 3. Deduct Stock & Log Inventory
      for (const item of data.items) {
        // a. Update Global Stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: { decrement: item.quantity }
          }
        });

        // b. Update Warehouse Specific Stock
        if (finalWarehouseId) {
          await tx.warehouseStock.upsert({
            where: { 
              warehouseId_productId: { 
                warehouseId: finalWarehouseId, 
                productId: item.productId 
              } 
            },
            update: { quantity: { decrement: item.quantity } },
            create: { 
              warehouseId: finalWarehouseId, 
              productId: item.productId, 
              quantity: -item.quantity 
            }
          });
        }

        await tx.inventoryLog.create({
          data: {
            productId: item.productId,
            warehouseId: finalWarehouseId,
            type: 'Sale',
            quantity: -item.quantity,
            referenceId: invoice.id,
            description: `Sale Invoice No: ${invoiceNumber}`
          }
        });
      }

      // 4. Handle Accounting Link (Journal Voucher)
      const revenueAccount     = await tx.account.findUnique({ where: { code: '4101' } })
                              || await tx.account.findUnique({ where: { code: '1101' } });

      let debitAccountId: string | null = null;
      if (data.paymentType === 'paid' && data.receiptAccountId) {
        debitAccountId = data.receiptAccountId;
      } else {
        const customerSubAccountCode = `1201-${invoice.customer.code}`;
        let receivablesAccount = await tx.account.findUnique({ where: { code: customerSubAccountCode } });
        if (!receivablesAccount) {
          receivablesAccount = await tx.account.findUnique({ where: { code: '1201' } });
          if (!receivablesAccount) {
            receivablesAccount = await tx.account.create({
              data: { code: '1201', name: 'Accounts Receivable', nameAr: 'ذمم مدينة - عملاء', type: 'Asset' }
            });
          }
        }
        debitAccountId = receivablesAccount.id;
      }

      let vatPayableAccount = await tx.account.findUnique({ where: { code: '2101' } });
      if (!vatPayableAccount) {
        vatPayableAccount = await tx.account.create({
          data: { code: '2101', name: 'VAT Payable (Output Tax)', nameAr: 'ضريبة القيمة المضافة المحصلة', type: 'Liability' }
        });
      }

      if (revenueAccount && debitAccountId && vatPayableAccount) {
        const revenueAmount = data.subtotal - data.discount;
        const entries: any[] = [
          {
            accountId: debitAccountId,
            date: new Date(data.date),
            description: `${data.status === 'Paid' ? 'Cash received' : 'Receivable'} for sale ${invoiceNumber}`,
            debit: data.netAmount,
            credit: 0
          },
          {
            accountId: revenueAccount.id,
            date: new Date(data.date),
            description: `Sales Revenue for ${invoiceNumber}`,
            debit: 0,
            credit: revenueAmount
          }
        ];

        if (data.taxAmount > 0) {
          entries.push({
            accountId: vatPayableAccount.id,
            date: new Date(data.date),
            description: `Output VAT 15% for ${invoiceNumber}`,
            debit: 0,
            credit: data.taxAmount
          });
        }

        const gv = await tx.journalVoucher.create({
          data: {
            reference: `JVI-${invoiceNumber}`,
            date: new Date(data.date),
            description: `Sales Invoice ${invoiceNumber} - ${data.status === 'Paid' ? 'Cash Sale' : 'Credit Sale'}`,
            status: 'Posted',
            entries: { create: entries }
          }
        });

        await tx.salesInvoice.update({
          where: { id: invoice.id },
          data: { journalVoucherId: gv.id }
        });
      }

      if (data.paymentType === 'credit') {
        await tx.customer.update({
          where: { id: data.customerId },
          data: { balance: { increment: data.netAmount } }
        });
      }

      return invoice;
    });

    revalidatePath('/sales');
    revalidatePath('/financial');
    return { success: true, invoice: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ─── UPDATE SALES INVOICE ─────────────────────────────────────────────────
export async function updateSalesInvoice(invoiceId: string, data: any) {
  try {
    const session = await getSession();
    if (!hasPermission(session?.user, 'EDIT_INVOICE')) {
      throw new Error('غير مصرح لك بتعديل الفواتير');
    }

    const result = await prisma.$transaction(async (tx: any) => {
    // 1. Fetch old invoice to reverse previous effects
    const oldInvoice = await tx.salesInvoice.findUnique({
      where: { id: invoiceId },
      include: { items: true }
    });
    if (!oldInvoice) throw new Error('Invoice not found');
    const invoiceNumber = oldInvoice.invoiceNumber;

    // 2. Reverse old stock deductions
    for (const item of oldInvoice.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stockQuantity: { increment: item.quantity } }
      });
      if (oldInvoice.warehouseId) {
        await tx.warehouseStock.updateMany({
          where: { warehouseId: oldInvoice.warehouseId, productId: item.productId },
          data: { quantity: { increment: item.quantity } }
        });
      }
    }

    // 3. Delete old inventory logs & journal entries
    await tx.inventoryLog.deleteMany({ where: { referenceId: invoiceId } });
    if (oldInvoice.journalVoucherId) {
      await tx.journalEntry.deleteMany({ where: { journalVoucherId: oldInvoice.journalVoucherId } });
      await tx.journalVoucher.delete({ where: { id: oldInvoice.journalVoucherId } });
    }

    // 4. Delete old invoice items
    await tx.invoiceItem.deleteMany({ where: { invoiceId } });

    // 5. Update main invoice and recreate items
    const invoice = await tx.salesInvoice.update({
      where: { id: invoiceId },
      data: {
        date: new Date(data.date),
        customerId: data.customerId,
        warehouseId: data.warehouseId,
        totalAmount: data.subtotal,
        taxAmount: data.taxAmount,
        discount: data.discount,
        netAmount: data.netAmount,
        status: data.status,
        journalVoucherId: null, // Clear it temporarily
        items: {
          create: data.items.map((i: any) => ({
            productId: i.productId,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            total: i.total
          }))
        }
      },
      include: { customer: true }
    });

    // 6. Deduct New Stock & Log Inventory
    for (const item of data.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stockQuantity: { decrement: item.quantity } }
      });

      if (data.warehouseId) {
        await tx.warehouseStock.upsert({
          where: { 
            warehouseId_productId: { warehouseId: data.warehouseId, productId: item.productId } 
          },
          update: { quantity: { decrement: item.quantity } },
          create: { warehouseId: data.warehouseId, productId: item.productId, quantity: -item.quantity }
        });
      }

      await tx.inventoryLog.create({
        data: {
          productId: item.productId,
          warehouseId: data.warehouseId,
          type: 'Sale',
          quantity: -item.quantity,
          referenceId: invoice.id,
          description: `Sale Invoice No: ${invoiceNumber} (Updated)`
        }
      });
    }

    // 7. Handle Accounting Link (Journal Voucher)
    const revenueAccount     = await tx.account.findUnique({ where: { code: '4101' } }) || await tx.account.findUnique({ where: { code: '1101' } });

    let debitAccountId: string | null = null;
    if (data.paymentType === 'paid' && data.receiptAccountId) {
      debitAccountId = data.receiptAccountId;
    } else {
      const customerSubAccountCode = `1201-${invoice.customer.code}`;
      let receivablesAccount = await tx.account.findUnique({ where: { code: customerSubAccountCode } });
      if (!receivablesAccount) {
        receivablesAccount = await tx.account.findUnique({ where: { code: '1201' } });
        if (!receivablesAccount) {
          receivablesAccount = await tx.account.create({
            data: { code: '1201', name: 'Accounts Receivable', nameAr: 'ذمم مدينة - عملاء', type: 'Asset' }
          });
        }
      }
      debitAccountId = receivablesAccount.id;
    }

    let vatPayableAccount = await tx.account.findUnique({ where: { code: '2101' } });
    if (!vatPayableAccount) {
      vatPayableAccount = await tx.account.create({
        data: { code: '2101', name: 'VAT Payable (Output Tax)', nameAr: 'ضريبة القيمة المضافة المحصلة', type: 'Liability' }
      });
    }

    if (revenueAccount && debitAccountId && vatPayableAccount) {
      const revenueAmount = data.subtotal - data.discount;
      const entries: any[] = [
        {
          accountId: debitAccountId,
          date: new Date(data.date),
          description: `${data.status === 'Paid' ? 'Cash received' : 'Receivable'} for sale ${invoiceNumber}`,
          debit: data.netAmount,
          credit: 0
        },
        {
          accountId: revenueAccount.id,
          date: new Date(data.date),
          description: `Sales Revenue for ${invoiceNumber}`,
          debit: 0,
          credit: revenueAmount
        }
      ];

      if (data.taxAmount > 0) {
        entries.push({
          accountId: vatPayableAccount.id,
          date: new Date(data.date),
          description: `Output VAT 15% for ${invoiceNumber}`,
          debit: 0,
          credit: data.taxAmount
        });
      }

      const gv = await tx.journalVoucher.create({
        data: {
          reference: `JVI-${invoiceNumber}-U`,
          date: new Date(data.date),
          description: `Sales Invoice ${invoiceNumber} - ${data.status === 'Paid' ? 'Cash Sale' : 'Credit Sale'} (Updated)`,
          status: 'Posted',
          entries: { create: entries }
        }
      });

      await tx.salesInvoice.update({
        where: { id: invoice.id },
        data: { journalVoucherId: gv.id }
      });
    }

    // 8. Update Customer Balance
    // Reverse old, add new
    if (oldInvoice.status !== 'Paid') {
       await tx.customer.update({
         where: { id: oldInvoice.customerId },
         data: { balance: { decrement: oldInvoice.netAmount } }
       });
    }
    if (data.paymentType === 'credit') {
      await tx.customer.update({
        where: { id: data.customerId },
        data: { balance: { increment: data.netAmount } }
      });
    }

    return invoice;
  });

    revalidatePath('/sales');
    revalidatePath('/financial');
    return { success: true, invoice: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ─── DELETE SALES INVOICE ─────────────────────────────────────────────────
export async function deleteSalesInvoice(invoiceId: string) {
  try {
    const session = await getSession();
    if (!hasPermission(session?.user, 'DELETE_INVOICE')) {
      throw new Error('غير مصرح لك بحذف الفواتير');
    }

    await prisma.$transaction(async (tx: any) => {
      const invoice = await tx.salesInvoice.findUnique({
        where: { id: invoiceId },
        include: { items: true }
      });
      if (!invoice) throw new Error('Invoice not found');

      // 1. Reverse all stock deductions
      for (const item of invoice.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { increment: item.quantity } }
        });
        if (invoice.warehouseId) {
          await tx.warehouseStock.updateMany({
            where: { warehouseId: invoice.warehouseId, productId: item.productId },
            data: { quantity: { increment: item.quantity } }
          });
        }
      }

      // 2. Delete linked inventory logs
      await tx.inventoryLog.deleteMany({ where: { referenceId: invoiceId } });

      // 3. Delete linked journal entries & voucher
      if (invoice.journalVoucherId) {
        await tx.journalEntry.deleteMany({ where: { journalVoucherId: invoice.journalVoucherId } });
        await tx.journalVoucher.delete({ where: { id: invoice.journalVoucherId } });
      }

      // 5. Update Customer Balance
      if (invoice.status !== 'Paid') {
        await tx.customer.update({
          where: { id: invoice.customerId },
          data: { balance: { decrement: invoice.netAmount } }
        });
      }

      // 4. Delete invoice items then invoice
      await tx.invoiceItem.deleteMany({ where: { invoiceId } });
      await tx.salesInvoice.delete({ where: { id: invoiceId } });
    });

    revalidatePath('/sales');
    revalidatePath('/financial');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ─── UPDATE SALES INVOICE STATUS ──────────────────────────────────────────
export async function updateSalesInvoiceStatus(invoiceId: string, status: string) {
  try {
    await prisma.salesInvoice.update({
      where: { id: invoiceId },
      data: { status }
    });
    revalidatePath('/sales');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createCustomer(data: { name: string, nameAr?: string, code: string, phone?: string, email?: string }) {
  try {
    const session = await getSession();
    if (!hasPermission(session?.user, 'MANAGE_CONTACTS')) {
      throw new Error('غير مصرح لك بإدارة العملاء');
    }

    const customer = await prisma.$transaction(async (tx) => {
      // 1. Create the customer
      const cust = await tx.customer.create({ data });

      // 2. Ensure Accounts Receivable (Asset) exists
      let arAccount = await tx.account.findUnique({ where: { code: '1200' } });
      if (!arAccount) {
        arAccount = await tx.account.create({
          data: { code: '1200', name: 'Accounts Receivable', nameAr: 'الذمم المدينة', type: 'Asset' }
        });
      }

      // 3. Ensure 'Customers' (1201) exists as child of AR
      let customersGroup = await tx.account.findUnique({ where: { code: '1201' } });
      if (!customersGroup) {
        customersGroup = await tx.account.create({
          data: { code: '1201', name: 'Customers', nameAr: 'العملاء', type: 'Asset', parentId: arAccount.id }
        });
      }

      // 4. Create local account for this specific customer
      await tx.account.create({
        data: {
          code: `1201-${data.code}`,
          name: data.name,
          nameAr: data.nameAr || undefined,
          type: 'Asset',
          parentId: customersGroup.id
        }
      });

      return cust;
    });

    revalidatePath('/sales');
    revalidatePath('/customers');
    revalidatePath('/ledger');
    revalidatePath('/financial');
    return { success: true, customer };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateCustomer(id: string, data: { name: string, nameAr?: string, code: string, phone?: string, email?: string }) {
  try {
    const session = await getSession();
    if (!hasPermission(session?.user, 'MANAGE_CONTACTS')) {
      throw new Error('غير مصرح لك بإدارة العملاء');
    }

    const original = await prisma.customer.findUnique({ where: { id } });
    if (!original) throw new Error('Customer not found');

    const customer = await prisma.$transaction(async (tx) => {
      const cust = await tx.customer.update({
        where: { id },
        data
      });

      // Update linked account if exists
      const accountCode = `1201-${original.code}`;
      const account = await tx.account.findUnique({ where: { code: accountCode } });
      if (account) {
        await tx.account.update({
          where: { id: account.id },
          data: {
            code: `1201-${data.code}`,
            name: data.name,
            nameAr: data.nameAr || undefined
          }
        });
      }
      return cust;
    });

    revalidatePath('/sales');
    revalidatePath('/customers');
    revalidatePath('/ledger');
    return { success: true, customer };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCustomer(id: string) {
  try {
    const session = await getSession();
    if (!hasPermission(session?.user, 'DELETE_CONTACT')) {
      throw new Error('غير مصرح لك بحذف العملاء');
    }

    const original = await prisma.customer.findUnique({ where: { id } });
    if (!original) throw new Error('Customer not found');

    await prisma.$transaction(async (tx) => {
      // 1. Delete customer
      await tx.customer.delete({ where: { id } });

      // 2. Delete linked account (only if no entries exist)
      const accountCode = `1201-${original.code}`;
      const account = await tx.account.findUnique({ 
        where: { code: accountCode },
        include: { entries: true }
      });
      if (account && account.entries.length === 0) {
        await tx.account.delete({ where: { id: account.id } });
      }
    });

    revalidatePath('/sales');
    revalidatePath('/customers');
    revalidatePath('/ledger');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ─── SALES QUOTATIONS ─────────────────────────────────────────────────────

export async function createSalesQuotation(data: {
  customerId: string;
  warehouseId: string;
  date: string;
  validUntil?: string;
  items: any[];
  subtotal: number;
  taxAmount: number;
  discount: number;
  netAmount: number;
}) {
  try {
    const session = await getSession();
    if (!hasPermission(session?.user, 'CREATE_QUOTATION')) {
      throw new Error('غير مصرح لك بإنشاء عروض أسعار');
    }

    const quotation = await prisma.$transaction(async (tx) => {
      // 1. Generate Quotation Number (e.g. QUO-2026-001)
      const count = await tx.salesQuotation.count();
      const quotationNumber = `QUO-${new Date().getFullYear()}-${(count + 1).toString().padStart(3, '0')}`;

      // 2. Add Quotation to DB
      return await tx.salesQuotation.create({
        data: {
          quotationNumber,
          date: new Date(data.date),
          validUntil: data.validUntil ? new Date(data.validUntil) : null,
          customerId: data.customerId,
          warehouseId: data.warehouseId,
          totalAmount: data.subtotal,
          taxAmount: data.taxAmount,
          discount: data.discount,
          netAmount: data.netAmount,
          status: 'Draft',
          items: {
            create: data.items.map((i: any) => ({
              productId: i.productId,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
              total: i.total
            }))
          }
        },
        include: { items: { include: { product: true } }, customer: true }
      });
    });

    revalidatePath('/sales');
    return { success: true, quotation };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateSalesQuotation(id: string, data: any) {
  try {
    const session = await getSession();
    if (!hasPermission(session?.user, 'EDIT_QUOTATION')) {
      throw new Error('غير مصرح لك بتعديل عروض الأسعار');
    }

    const result = await prisma.$transaction(async (tx: any) => {
      // Clear old items
      await tx.quotationItem.deleteMany({ where: { quotationId: id } });

      return await tx.salesQuotation.update({
        where: { id },
        data: {
          date: new Date(data.date),
          validUntil: data.validUntil ? new Date(data.validUntil) : null,
          customerId: data.customerId,
          warehouseId: data.warehouseId,
          totalAmount: data.subtotal,
          taxAmount: data.taxAmount,
          discount: data.discount,
          netAmount: data.netAmount,
          status: data.status || 'Draft',
          items: {
            create: data.items.map((i: any) => ({
              productId: i.productId,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
              total: i.total
            }))
          }
        },
        include: { items: { include: { product: true } }, customer: true }
      });
    });

    revalidatePath('/sales');
    return { success: true, quotation: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteSalesQuotation(id: string) {
  try {
    const session = await getSession();
    if (!hasPermission(session?.user, 'DELETE_QUOTATION')) {
      throw new Error('غير مصرح لك بحذف عروض الأسعار');
    }

    await prisma.salesQuotation.delete({ where: { id } });
    revalidatePath('/sales');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteAllQuotations() {
  try {
    const session = await getSession();
    if (!hasPermission(session?.user, 'DELETE_QUOTATION')) {
      throw new Error('غير مصرح لك بحذف عروض الأسعار');
    }

    await prisma.salesQuotation.deleteMany({});
    revalidatePath('/sales');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteAllProducts() {
  try {
    const session = await getSession();
    if (!hasPermission(session?.user, 'MANAGE_INVENTORY')) {
      throw new Error('غير مصرح لك بحذف الأصناف');
    }

    await prisma.$transaction([
      prisma.invoiceItem.deleteMany({}),
      prisma.quotationItem.deleteMany({}),
      prisma.purchaseItem.deleteMany({}),
      prisma.inventoryLog.deleteMany({}),
      prisma.stockTransferItem.deleteMany({}),
      prisma.costCenterItem.deleteMany({}),
      prisma.productionOrderItem.deleteMany({}),
      prisma.warehouseStock.deleteMany({}),
      prisma.productionOrder.deleteMany({}),
      prisma.costCenter.deleteMany({}),
      prisma.product.deleteMany({})
    ]);

    revalidatePath('/sales');
    revalidatePath('/inventory');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteProductsByName(searchTerm: string) {
    try {
        const products = await prisma.product.findMany({
            where: {
                OR: [
                    { nameAr: { contains: searchTerm } },
                    { name: { contains: searchTerm } }
                ]
            }
        });

        for (const p of products) {
            // First clear all dependencies that don't have cascade in schema
            await prisma.quotationItem.deleteMany({ where: { productId: p.id } });
            await prisma.invoiceItem.deleteMany({ where: { productId: p.id } });
            await prisma.purchaseItem.deleteMany({ where: { productId: p.id } });
            await prisma.inventoryLog.deleteMany({ where: { productId: p.id } });
            await prisma.stockTransferItem.deleteMany({ where: { productId: p.id } });
            await prisma.costCenterItem.deleteMany({ where: { productId: p.id } });
            await prisma.productionOrderItem.deleteMany({ where: { productId: p.id } });
            
            // Delete product
            await prisma.product.delete({ where: { id: p.id } });
        }

        revalidatePath('/inventory');
        revalidatePath('/sales');
        return { success: true, count: products.length };
    } catch (error: any) {
        console.error('Delete products failed:', error);
        return { success: false, error: error.message };
    }
}

export async function convertQuotationToInvoice(quotationId: string, paymentData: { paymentType: 'paid' | 'credit', receiptAccountId: string | null }) {
  try {
    const quotation = await prisma.salesQuotation.findUnique({
      where: { id: quotationId },
      include: { items: true }
    });

    if (!quotation) throw new Error('Quotation not found');
    if (quotation.status === 'Converted') throw new Error('Quotation already converted');

    // Reuse createSalesInvoice logic
    const invoiceData = {
      customerId: quotation.customerId,
      warehouseId: quotation.warehouseId || '',
      date: new Date().toISOString(),
      items: quotation.items.map(i => ({
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        total: i.total
      })),
      subtotal: quotation.totalAmount,
      taxAmount: quotation.taxAmount,
      discount: quotation.discount,
      netAmount: quotation.netAmount,
      status: paymentData.paymentType === 'paid' ? 'Paid' : 'Sent',
      paymentType: paymentData.paymentType,
      receiptAccountId: paymentData.receiptAccountId
    };

    const res = await createSalesInvoice(invoiceData);
    if (!res.success) throw new Error(res.error);

    // Link quotation to invoice
    await prisma.salesQuotation.update({
      where: { id: quotationId },
      data: { 
        status: 'Converted',
        convertedToInvoiceId: res.invoice.id
      }
    });

    revalidatePath('/sales');
    return { success: true, invoice: res.invoice };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
export async function translateText(text: string, from: 'ar' | 'en', to: 'ar' | 'en') {
  if (!text) return { text: '' };
  try {
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`);
    const data = await res.json();
    let translated = data[0][0][0];
    return { success: true, text: translated };
  } catch (error) {
    console.error('Translation failed', error);
    return { success: false, error: 'Translation failed' };
  }
}

export async function createProduct(data: {
  sku?: string;
  name: string;
  nameAr?: string;
  description?: string;
  category?: string;
  classification: string;
  unit: string;
  unitId?: string | null;
  costPrice: number;
  salePrice: number;
  reorderPoint: number;
  caloriesPer100g: number;
  expiryDate?: string | null;
  unitQuantity?: number;
  subUnitId?: string | null;
}) {
  try {
    const session = await getSession();
    if (!hasPermission(session?.user, 'MANAGE_INVENTORY')) {
      throw new Error('غير مصرح لك بإدارة المخزون');
    }

    let finalSku = data.sku;
    if (!finalSku) {
      const cls = data.classification;
      const count = await prisma.product.count({
        where: { classification: cls }
      });
      
      let prefix = 'PRD';
      if (cls === 'Raw Material') prefix = 'MAT';
      else if (cls === 'Semi-finished') prefix = 'SEMI';
      else if (cls === 'Finished Product') prefix = 'FIN';
      
      finalSku = `${prefix}-${(count + 1).toString().padStart(4, '0')}`;
    }

    const product = await prisma.product.create({
      data: {
        sku: finalSku,
        name: data.name,
        nameAr: data.nameAr || null,
        description: data.description || null,
        category: data.category || null,
        classification: data.classification,
        unit: data.unit,
        unitId: data.unitId || null,
        costPrice: data.costPrice,
        salePrice: data.salePrice,
        reorderPoint: data.reorderPoint,
        caloriesPer100g: data.caloriesPer100g,
        expiryDate: (data.expiryDate && data.expiryDate.trim() !== "") ? new Date(data.expiryDate) : null,
        unitQuantity: data.unitQuantity || 1,
        subUnitId: data.subUnitId || null,
      }
    });

    revalidatePath('/sales');
    return { success: true, product };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    const session = await getSession();
    if (!hasPermission(session?.user, 'MANAGE_INVENTORY')) {
      throw new Error('غير مصرح لك بإدارة المخزون');
    }

    const product = await prisma.$transaction(async (tx) => {
        const prod = await tx.product.update({
          where: { id },
          data: {
            sku: data.sku,
            name: data.name,
            nameAr: data.nameAr || null,
            description: data.description || null,
            category: data.category || null,
            classification: data.classification,
            unit: data.unit,
            unitId: data.unitId || null,
            costPrice: Number(data.costPrice) || 0,
            salePrice: Number(data.salePrice) || 0,
            reorderPoint: Number(data.reorderPoint) || 0,
            caloriesPer100g: Number(data.caloriesPer100g) || 0,
            expiryDate: (data.expiryDate && data.expiryDate.trim() !== "") ? new Date(data.expiryDate) : null,
            unitQuantity: Number(data.unitQuantity) || 1,
            subUnitId: data.subUnitId || null,
          }
        });

        // Cascading cost sync: If this is an ingredient, update recipes.
        await syncProductCostCascading(prod.id, tx);
        return prod;
    });

    revalidatePath('/sales');
    return { success: true, product };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(id: string, lang: string = 'ar') {
  try {
    const session = await getSession();
    if (!hasPermission(session?.user, 'MANAGE_INVENTORY')) {
      throw new Error('غير مصرح لك بحذف الأصناف');
    }

    // Check if product has transactions or is in a recipe
    const invoiceCount = await prisma.invoiceItem.count({ where: { productId: id } });
    if (invoiceCount > 0) throw new Error(lang === 'ar' ? 'لا يمكن حذف صنف مرتبط بمبيعات مسجلة' : 'Cannot delete item with sales transactions');

    const recipeCount = await prisma.costCenter.count({ where: { productId: id } });
    if (recipeCount > 0) throw new Error(lang === 'ar' ? 'هذا الصنف هو منتج نهائي لوصفة إنتاج، يرجى حذف الوصفة أولاً' : 'This item is a target for a recipe, delete recipe first');

    const ingredientCount = await prisma.costCenterItem.count({ where: { productId: id } });
    if (ingredientCount > 0) throw new Error(lang === 'ar' ? 'هذا الصنف مستخدم كمادة خام في وصفات إنتاج، يرجى إزالة الصنف من الوصفة أو حذفها' : 'This item is used as an ingredient in recipes');

    const orderCount = await prisma.productionOrder.count({ where: { productId: id } });
    if (orderCount > 0) throw new Error(lang === 'ar' ? 'هذا الصنف مرتبط بأوامر إنتاج سابقة' : 'Linked to past production orders');

    // Delete simple logs/stock
    await prisma.warehouseStock.deleteMany({ where: { productId: id } });
    await prisma.inventoryLog.deleteMany({ where: { productId: id } });

    await prisma.product.delete({ where: { id } });
    revalidatePath('/sales');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function bulkCreateProducts(productsData: any[]) {
  try {
    const session = await getSession();
    if (!hasPermission(session?.user, 'MANAGE_INVENTORY')) {
      throw new Error('غير مصرح لك بإدارة المخزون');
    }

    if (!productsData || productsData.length === 0) {
      throw new Error('الملف فارغ أو لا يحتوي على بيانات صالحة');
    }

    // Fetch all units once for name-to-id mapping
    const allUnits = await prisma.unitOfMeasure.findMany();
    const unitMap = new Map(allUnits.map(u => [u.name.toLowerCase(), u.id]));
    const unitMapAr = new Map(allUnits.filter(u => u.nameAr).map(u => [u.nameAr!.toLowerCase(), u.id]));

    const currentCount = await prisma.product.count();
    let created = 0;
    let updated = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (let i = 0; i < productsData.length; i++) {
      const p = productsData[i];

      // Skip empty rows
      if (!p.name && !p.nameAr) { skipped++; continue; }

      try {
        // Build SKU
        let sku = p.sku;
        if (!sku) {
          const prefix = p.classification === 'Raw Material' ? 'MAT' :
                         p.classification === 'Semi-finished' ? 'SEMI' :
                         p.classification === 'Finished Product' ? 'FIN' : 'PRD';
          sku = `${prefix}-${(currentCount + i + 1).toString().padStart(4, '0')}`;
        }

        // Resolve unitId from name
        const unitName = (p.unit || '').toLowerCase();
        const unitId = unitMap.get(unitName) || unitMapAr.get(unitName) || null;

        const subUnitName = (p.subUnit || '').toLowerCase();
        const subUnitId = unitMap.get(subUnitName) || unitMapAr.get(subUnitName) || null;

        // Check for duplicate SKU
        const existing = await prisma.product.findUnique({ where: { sku } });
        if (existing) {
          // Compare fields to see if update is needed
          const hasChanges = 
            (p.name && p.name !== existing.name) ||
            (p.nameAr && p.nameAr !== existing.nameAr) ||
            (p.category && p.category !== existing.category) ||
            (p.classification && p.classification !== existing.classification) ||
            (p.unit && p.unit !== existing.unit) ||
            (unitId !== existing.unitId) ||
            (subUnitId !== existing.subUnitId) ||
            (p.costPrice !== undefined && parseFloat(p.costPrice) !== existing.costPrice) ||
            (p.salePrice !== undefined && parseFloat(p.salePrice) !== existing.salePrice) ||
            (p.reorderPoint !== undefined && parseFloat(p.reorderPoint) !== existing.reorderPoint) ||
            (p.unitQuantity !== undefined && parseFloat(p.unitQuantity) !== existing.unitQuantity);

          if (hasChanges) {
            await prisma.product.update({
              where: { id: existing.id },
              data: {
                name: p.name || existing.name,
                nameAr: p.nameAr || existing.nameAr,
                category: p.category || existing.category,
                classification: p.classification || existing.classification,
                unit: p.unit || existing.unit,
                unitId: unitId || existing.unitId,
                subUnitId: subUnitId || existing.subUnitId,
                costPrice: p.costPrice !== undefined ? parseFloat(p.costPrice) : existing.costPrice,
                salePrice: p.salePrice !== undefined ? parseFloat(p.salePrice) : existing.salePrice,
                reorderPoint: p.reorderPoint !== undefined ? parseFloat(p.reorderPoint) : existing.reorderPoint,
                unitQuantity: p.unitQuantity !== undefined ? parseFloat(p.unitQuantity) : existing.unitQuantity,
              }
            });
            updated++;
          } else {
            skipped++;
          }
          continue;
        }

        await prisma.product.create({
          data: {
            sku,
            name: p.name || p.nameAr || 'Unnamed Item',
            nameAr: p.nameAr || null,
            category: p.category || null,
            classification: p.classification || 'Finished Product',
            unit: p.unit || 'Piece',
            unitId: unitId,
            subUnitId: subUnitId,
            costPrice: parseFloat(p.costPrice) || 0,
            salePrice: parseFloat(p.salePrice) || 0,
            stockQuantity: parseFloat(p.stockQuantity) || 0,
            reorderPoint: parseFloat(p.reorderPoint) || 0,
            unitQuantity: parseFloat(p.unitQuantity) || 1,
          }
        });
        created++;
      } catch (rowErr: any) {
        errors.push(`Row ${i + 2}: ${rowErr.message}`);
      }
    }

    revalidatePath('/sales');
    revalidatePath('/inventory');

    if (errors.length > 0 && created === 0 && updated === 0) {
      return { success: false, error: `فشل الاستيراد:\n${errors.slice(0, 5).join('\n')}` };
    }

    let message = `تم العمل على ${productsData.length} سجل: `;
    message += `إضافة ${created} صنف جديد. `;
    if (updated > 0) message += `تعديل ${updated} صنف موجود. `;
    message += `تخطى ${skipped} صنف مطابق تماماً. `;
    if (errors.length > 0) message += `وجود ${errors.length} خطأ.`;

    return { 
      success: true, 
      count: created + updated,
      message
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
