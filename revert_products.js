const { PrismaClient } = require('./src/generated/client_v8');
const prisma = new PrismaClient();

async function main() {
  await prisma.product.updateMany({
    data: { branchId: null }
  });
  console.log('Reverted all products to branchId null (MAIN branch)');
  await prisma.$disconnect();
}

main().catch(console.error);
