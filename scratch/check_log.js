const { PrismaClient } = require('../src/generated/client');

async function checkLog() {
  const prisma = new PrismaClient({ datasources: { db: { url: 'file:../prisma/dev.db' } } });
  try {
    const logs = await prisma.inventoryLog.findMany({
      where: { referenceId: 'PO-0002' }
    });
    console.log(logs);
  } catch (err) { } finally { await prisma.$disconnect(); }
}
checkLog();
