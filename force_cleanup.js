const { PrismaClient } = require('./src/generated/client');
const prisma = new PrismaClient();

async function forceCleanupLogs() {
  console.log('--- Starting Forced Cleanup ---');
  try {
    // 1. Delete any inventory log that is NOT a Sale, Purchase, or Stock Transfer.
    // This will catch ALL old production logs regardless of their Arabic/English names.
    const logsToDelete = await prisma.inventoryLog.findMany({
      where: {
        NOT: [
          { type: 'Sale' },
          { type: 'Purchase' },
          { type: 'Stock Transfer' }
        ]
      }
    });

    const idsToDelete = logsToDelete.map(l => l.id);

    if (idsToDelete.length > 0) {
      const res = await prisma.inventoryLog.deleteMany({
        where: { id: { in: idsToDelete } }
      });
      console.log(`Force deleted ${res.count} old production/unknown logs.`);
    } else {
      console.log('No orphaned logs found.');
    }

    // 2. Recalculate balances
    const allProducts = await prisma.product.findMany();
    
    for (const product of allProducts) {
       const logs = await prisma.inventoryLog.findMany({
         where: { productId: product.id }
       });
       
       const correctStock = logs.reduce((sum, log) => sum + (log.quantity || 0), 0);
       
       if (product.stockQuantity !== correctStock) {
           await prisma.product.update({
               where: { id: product.id },
               data: { stockQuantity: correctStock }
           });
           console.log(`Fixed Product [${product.sku}] stock to: ${correctStock}`);
       }
    }

    console.log('--- Forced Cleanup Complete ---');
  } catch (err) {
    console.error('Error during forced cleanup:', err);
  } finally {
    await prisma.$disconnect();
  }
}

forceCleanupLogs();
