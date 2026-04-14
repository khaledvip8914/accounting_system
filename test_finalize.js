const { PrismaClient } = require('./src/generated/client');
const prisma = new PrismaClient();

async function testFinalize() {
  const order = await prisma.productionOrder.findFirst({
    where: { status: 'Draft' },
    include: { items: true, product: true }
  });

  if (!order) {
    console.log('No draft orders found.');
    return;
  }

  try {
    await prisma.$transaction(async (tx) => {
        // 1. Update order status
        await tx.productionOrder.update({
            where: { id: order.id },
            data: { status: 'Completed' }
        });

        // 2. Increase stock for finished product
        const finishedProduct = await tx.product.findUnique({ 
            where: { id: order.productId },
            include: { unitRef: true }
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
                    unitName: finishedProduct?.unitRef?.nameAr || finishedProduct?.unitRef?.name || '---',
                    type: 'Production Output',
                    quantity: order.quantity,
                    referenceId: order.orderNumber,
                    description: `Production of ${order.product.sku}`
                }
            });
        }

        // 3. Decrease stock for raw materials
        for (const item of order.items) {
            const ingredient = await tx.product.findUnique({
                where: { id: item.productId },
                include: { unitRef: true }
            });

            await tx.product.update({
                where: { id: item.productId },
                data: { stockQuantity: { decrement: item.quantity } }
            });

            if (order.warehouseId) {
                await tx.warehouseStock.upsert({
                    where: { warehouseId_productId: { warehouseId: order.warehouseId, productId: item.productId } },
                    update: { quantity: { decrement: item.quantity } },
                    create: { warehouseId: order.warehouseId, productId: item.productId, quantity: -item.quantity }
                });

                await tx.inventoryLog.create({
                    data: {
                        productId: item.productId,
                        warehouseId: order.warehouseId,
                        unitName: (item.unitId ? await tx.unitOfMeasure.findUnique({ where: { id: item.unitId } }) : null)?.nameAr || ingredient?.unitRef?.nameAr || '---',
                        type: 'Production Usage',
                        quantity: -item.quantity,
                        referenceId: order.orderNumber,
                        description: `Consume for ${order.product.sku} production (#${order.orderNumber})`
                    }
                });
            }
        }
    });
    console.log('Finalize simulation passed with no errors!');
  } catch (e) {
    console.error('Simulation Failed with error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

testFinalize();
