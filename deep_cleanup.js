const { PrismaClient } = require('./src/generated/client');
const prisma = new PrismaClient();

async function deepCleanup() {
  console.log('--- Starting Deep Cleanup ---');
  try {
    // 1. Delete all orphan or production-related inventory logs
    const deletedLogs = await prisma.inventoryLog.deleteMany({
      where: {
        OR: [
          { type: { contains: 'Production' } },
          { description: { contains: 'Production' } },
          { description: { contains: 'Consume' } }
        ]
      }
    });
    console.log(`Deleted ${deletedLogs.count} production-related inventory logs.`);

    // 2. Recalculate true stock balances based on remaining valid logs!
    // This will fix any negative balances that lingered.
    const allProducts = await prisma.product.findMany();
    
    for (const product of allProducts) {
       // Get all remaining true logs (Purchases, Sales, etc.)
       const logs = await prisma.inventoryLog.findMany({
         where: { productId: product.id }
       });
       
       const correctStock = logs.reduce((sum, log) => sum + (log.quantity || 0), 0);
       
       if (product.stockQuantity !== correctStock) {
           await prisma.product.update({
               where: { id: product.id },
               data: { stockQuantity: correctStock }
           });
           console.log(`Updated Product [${product.sku}] stock to: ${correctStock}`);
       }
    }

    console.log('--- Deep Cleanup Complete ---');
  } catch (err) {
    console.error('Error during cleanup:', err);
  } finally {
    await prisma.$disconnect();
  }
}

deepCleanup();
