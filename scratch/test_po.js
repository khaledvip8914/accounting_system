const { PrismaClient } = require('../src/generated/client');

async function getUnitWeightInGramsServer(qty, unitId, productId = null, db) {
  if (!unitId) return qty;
  const u = await db.unitOfMeasure.findUnique({ where: { id: unitId } });
  if (!u) return qty;
  const name = (u.name || '').toLowerCase().trim();
  const nameAr = (u.nameAr || '').trim();
  
  if (name === 'kilogram' || name === 'kg' || nameAr === 'كيلو' || nameAr === 'كجم') return qty * 1000;
  if (name === 'gram' || name === 'g' || name === 'gm' || nameAr === 'جرام' || nameAr === 'جم') return qty;
  if (name === 'liter' || name === 'ltr' || name === 'l' || nameAr === 'لتر') return qty * 1000;
  if (name === 'milliliter' || name === 'ml' || nameAr === 'ملي') return qty;
  
  if (name.includes('kilogram') || name.includes('كيلو')) return qty * 1000;
  if (name.includes('liter') || name.includes('لتر')) return qty * 1000;

  if (productId) {
      const prod = await db.product.findUnique({ where: { id: productId } });
      if (prod && unitId === prod.unitId && prod.subUnitId) {
          const subWeight = await getUnitWeightInGramsServer(1, prod.subUnitId, null, db);
          return qty * (prod.unitQuantity || 1) * subWeight;
      }
  }

  if (u.conversionFactor && u.conversionFactor > 1 && !name.includes('gram') && !name.includes('ml')) {
      return qty * u.conversionFactor;
  }
  return qty;
}

async function computeBaseUnitQty(usedQty, usedUnitId, productId, db) {
    const product = await db.product.findUnique({ where: { id: productId } });
    if (!product) return usedQty;
    const mainUnitWeightG = await getUnitWeightInGramsServer(1, product.unitId, productId, db);
    const usedUnitWeightG = await getUnitWeightInGramsServer(1, usedUnitId, productId, db);
    if (mainUnitWeightG > 0) {
        return (usedQty * usedUnitWeightG) / mainUnitWeightG;
    }
    return usedQty;
}

async function testFinalize() {
  const prisma = new PrismaClient({ datasources: { db: { url: 'file:../prisma/dev.db' } } });

  try {
    const recipe = await prisma.costCenter.findFirst({
      include: { items: true }
    });
    
    if (!recipe) { console.log("No recipe"); return; }
    
    const warehouse = await prisma.warehouse.findFirst();
    if (!warehouse) { console.log("No warehouse"); return; }

    const order = await prisma.productionOrder.create({
      data: {
        orderNumber: 'TEST-PO-002',
        productId: recipe.productId,
        quantity: 1,
        warehouseId: warehouse.id,
        items: {
          create: recipe.items.map(ri => ({
            productId: ri.productId,
            unitId: ri.unitId,
            quantity: ri.quantity,
            costPrice: ri.costPrice
          }))
        }
      },
      include: { items: true, product: true }
    });

    console.log(`Created PO: ${order.id}. Finalizing...`);

    await prisma.$transaction(async (tx) => {
      await tx.productionOrder.update({
          where: { id: order.id },
          data: { status: 'Completed' }
      });
      await tx.product.update({
          where: { id: order.productId },
          data: { stockQuantity: { increment: order.quantity } }
      });

      if (order.warehouseId) {
          await tx.warehouseStock.upsert({
              where: { warehouseId_productId: { warehouseId: order.warehouseId, productId: order.productId } },
              update: { quantity: { increment: order.quantity } },
              create: { warehouseId: order.warehouseId, productId: order.productId, quantity: order.quantity }
          });
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

      for (const item of order.items) {
          const ingredient = await tx.product.findUnique({
              where: { id: item.productId },
              include: { unitRef: true }
          });
          const baseUnitQty = await computeBaseUnitQty(item.quantity, item.unitId, item.productId, tx);
          await tx.product.update({
              where: { id: item.productId },
              data: { stockQuantity: { decrement: baseUnitQty } }
          });
          if (order.warehouseId) {
              await tx.warehouseStock.upsert({
                  where: { warehouseId_productId: { warehouseId: order.warehouseId, productId: item.productId } },
                  update: { quantity: { decrement: baseUnitQty } },
                  create: { warehouseId: order.warehouseId, productId: item.productId, quantity: -baseUnitQty }
              });
              await tx.inventoryLog.create({
                  data: {
                      productId: item.productId,
                      warehouseId: order.warehouseId,
                      type: 'Production Usage',
                      quantity: -baseUnitQty,
                      referenceId: order.orderNumber,
                      description: `Consume for ${order.product.sku} production (#${order.orderNumber})`
                  }
              });
          }
      }
    });

    console.log("Finalized!");
    await prisma.productionOrder.delete({ where: { id: order.id } });
  } catch (e) {
    console.error("ERROR DETECTED:", e);
  } finally {
    await prisma.$disconnect();
  }
}

testFinalize();
