const { PrismaClient } = require('./src/generated/client_v8');
const prisma = new PrismaClient();

async function main() {
  const branches = await prisma.branch.findMany();
  console.log('Branches:', branches);
  const mainBranch = branches.find(b => b.isMain) || branches[0];
  if (mainBranch) {
    await prisma.product.updateMany({
      where: { branchId: null },
      data: { branchId: mainBranch.id }
    });
    console.log('Updated products to branch', mainBranch.name);
  }
  await prisma.$disconnect();
}

main().catch(console.error);
