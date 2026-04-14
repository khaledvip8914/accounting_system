const { PrismaClient } = require('../src/generated/client');

async function checkPo() {
  const prisma = new PrismaClient({ datasources: { db: { url: 'file:../prisma/dev.db' } } });
  try {
    const po = await prisma.productionOrder.findUnique({
      where: { orderNumber: 'PO-0002' }
    });
    console.log("PO-0002:", po);
  } catch (err) { } finally { await prisma.$disconnect(); }
}
checkPo();
