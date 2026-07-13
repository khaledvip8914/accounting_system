const { PrismaClient } = require('./src/generated/client_v8');
const prisma = new PrismaClient();

async function main() {
  await prisma.category.updateMany({ data: { branchId: null } });
  await prisma.unitOfMeasure.updateMany({ data: { branchId: null } });
  await prisma.costCenter.updateMany({ data: { branchId: null } });
  await prisma.productionOrder.updateMany({ data: { branchId: null } });
  await prisma.disposalVoucher.updateMany({ data: { branchId: null } });
  console.log('Reverted all related entities to branchId null (MAIN branch)');
  await prisma.$disconnect();
}

main().catch(console.error);
