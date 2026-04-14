const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    where: { classification: 'Raw Material' },
    select: { name: true, sku: true, unitId: true, subUnitId: true, unitQuantity: true, costPrice: true },
    take: 10
  });
  const units = await prisma.unitOfMeasure.findMany();
  const unitMap = new Map(units.map(u => [u.id, u.nameAr || u.name]));

  console.log('--- Raw Materials ---');
  products.forEach(p => {
    console.log(`${p.sku} | Unit: ${unitMap.get(p.unitId)} | SubUnit: ${unitMap.get(p.subUnitId)} | Qty: ${p.unitQuantity}`);
  });

  console.log('\n--- Units ---');
  units.forEach(u => {
    console.log(`${u.id}: ${u.name} / ${u.nameAr}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
