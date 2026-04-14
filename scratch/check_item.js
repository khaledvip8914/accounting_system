const { PrismaClient } = require('../src/generated/client');

async function checkItem() {
  const prisma = new PrismaClient({ datasources: { db: { url: 'file:../prisma/dev.db' } } });

  try {
    const productId = 'cmnnrz9tv001kvr50oih13aj2';
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { unitRef: true, subUnitRef: true }
    });
    console.log("PRODUCT:", product);

    // Get the PO-0002 items
    const po = await prisma.productionOrder.findUnique({
      where: { orderNumber: 'PO-0002' },
      include: { items: { include: { unit: true } } }
    });
    console.log("PRODUCTION ORDER ITEMS:", po?.items);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

checkItem();
