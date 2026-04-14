const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkLogs() {
  try {
    const logs = await prisma.inventoryLog.findMany({
      include: {
        product: true
      }
    });
    console.log(`Total logs found: ${logs.length}`);
    if (logs.length > 0) {
      console.log('Sample Log Product IDs:', logs.map(l => l.productId).slice(0, 5));
    }
    
    const products = await prisma.product.findMany({
       where: { nameAr: { contains: 'طحين' } }
    });
    console.log('Products matching Tahini:', products.map(p => ({ id: p.id, nameAr: p.nameAr, sku: p.sku })));
    
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

checkLogs();
