const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const skulist = ['FIN-0001', 'FIN-0002', 'MAT-0073'];
  for (const sku of skulist) {
    const product = await prisma.product.findUnique({ where: { sku } });
    if (!product) {
      console.log(`${sku}: Not found`);
      continue;
    }
    const id = product.id;
    const invoiceCount = await prisma.invoiceItem.count({ where: { productId: id } });
    const recipeCount = await prisma.costCenter.count({ where: { productId: id } });
    const ingredientCount = await prisma.costCenterItem.count({ where: { productId: id } });
    const orderCount = await prisma.productionOrder.count({ where: { productId: id } });
    const stCount = await prisma.stockTransferItem.count({ where: { productId: id } });
    const purchaseCount = await prisma.purchaseItem.count({ where: { productId: id } });

    console.log(`${sku} (${product.name}):`);
    console.log(`  Invoices: ${invoiceCount}`);
    console.log(`  Recipes (Target): ${recipeCount}`);
    console.log(`  Ingredient usage: ${ingredientCount}`);
    console.log(`  Production Orders: ${orderCount}`);
    console.log(`  Stock Transfers: ${stCount}`);
    console.log(`  Purchases: ${purchaseCount}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
