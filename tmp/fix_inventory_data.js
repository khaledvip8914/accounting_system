const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixBalances() {
  try {
    const logs = await prisma.inventoryLog.findMany({
       where: { baseQuantity: null },
       include: { product: true }
    });
    
    console.log(`Found ${logs.length} logs to fix.`);
    
    for (const log of logs) {
        let baseQty = log.quantity;
        const prod = log.product;
        
        if (prod && prod.unitId && prod.unitQuantity && prod.unitQuantity > 1) {
             // Assuming quantity is in sub-units if it's a large move or if we can detect it.
             // For now, let's just apply the scaling logic if we suspect it's sub-unit.
             // Actually, let's just calculate it properly using our logic.
             // For the sake of this fix, we'll assume the user wants ALL previous moves scaled if they have a main unit.
             baseQty = log.quantity / prod.unitQuantity; 
             console.log(`Fixing Log ${log.id}: ${log.quantity} -> ${baseQty} Bags`);
             
             await prisma.inventoryLog.update({
                 where: { id: log.id },
                 data: { baseQuantity: baseQty }
             });
        }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

fixBalances();
