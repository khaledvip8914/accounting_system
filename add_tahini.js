const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const product = await prisma.product.create({
    data: {
      sku: 'Tahini-001',
      name: 'Tahini',
      nameAr: 'طحينة',
      classification: 'Raw Material',
      unit: 'Piece',
      costPrice: 15,
      salePrice: 25,
      reorderPoint: 5,
      caloriesPer100g: 0,
      unitQuantity: 1
    }
  });
  console.log('Added product:', product);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
}).finally(() => prisma.$disconnect());
