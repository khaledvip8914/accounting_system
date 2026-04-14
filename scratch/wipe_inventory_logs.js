const { PrismaClient } = require('../src/generated/client');
const fs = require('fs');
const path = require('path');

async function resetInventory(dbPath) {
  console.log(`\n🔄 Resetting database at: ${dbPath}`);
  if (!fs.existsSync(dbPath)) {
    console.log(`⚠️ Database not found at ${dbPath}`);
    return;
  }

  const prisma = new PrismaClient({ datasources: { db: { url: `file:${dbPath}` } } });

  try {
    // 1. Delete all logs
    const deletedLogs = await prisma.inventoryLog.deleteMany({});
    console.log(`✅ Deleted ${deletedLogs.count} inventory logs.`);

    // 2. Clear Warehouse Stock
    const deletedWS = await prisma.warehouseStock.deleteMany({});
    console.log(`✅ Deleted ${deletedWS.count} warehouse stock records.`);

    // 3. Clear Invoices/Orders
    await prisma.purchaseItem.deleteMany({});
    await prisma.purchaseInvoice.deleteMany({});
    await prisma.productionOrderItem.deleteMany({});
    await prisma.productionOrder.deleteMany({});
    await prisma.invoiceItem.deleteMany({});
    await prisma.salesInvoice.deleteMany({});

    // 4. Reset Product quantities
    const products = await prisma.product.updateMany({
      data: {
        stockQuantity: 0,
        costPrice: 0
      }
    });
    console.log(`✅ Reset stock quantity for ${products.count} products.`);

    // Verify
    const sample = await prisma.product.findMany({ 
        where: { stockQuantity: { not: 0 } }
    });
    
    if (sample.length > 0) {
        console.log(`❌ WARNING: ${sample.length} products still have non-zero stock!`);
    } else {
        console.log('✨ All products successfully zeroed.');
    }

  } catch (err) {
    console.error(`❌ Failed: ${err.message}`);
  } finally {
    await prisma.$disconnect();
  }
}

async function runAll() {
    // Update main db
    await resetInventory(path.join(__dirname, '../prisma/dev.db'));
    // Update standalone db
    await resetInventory(path.join(__dirname, '../.next/standalone/prisma/dev.db'));
}

runAll();
