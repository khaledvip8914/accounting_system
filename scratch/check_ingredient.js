const { PrismaClient } = require('../src/generated/client');

async function checkIngredient() {
  const prisma = new PrismaClient({ datasources: { db: { url: 'file:../prisma/dev.db' } } });
  try {
    const prod = await prisma.product.findUnique({
      where: { id: 'cmnlexgf5004ovrqgmmy6tn3v' },
      include: { unitRef: true, subUnitRef: true }
    });
    console.log("INGREDIENT PRODUCT:", JSON.stringify(prod, null, 2));
  } catch (err) { } finally { await prisma.$disconnect(); }
}
checkIngredient();
