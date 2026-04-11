const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanup() {
  try {
    console.log('--- Cleaning up Sales Quotations ---');
    
    // 1. Delete all SalesQuotations (CASCADE will delete QuotationItems)
    const delQuo = await prisma.salesQuotation.deleteMany({});
    console.log(`Deleted ${delQuo.count} Sales Quotations`);

    // 2. Identify the products the user wants to delete
    // Products mentioned: 'مكينة قهوة لاتيه', 'حبوب قهوة مختصة'
    // They are likely 'PRD-0001', 'PRD-0002' or similar. 
    // I'll search for products with those names or SKUs if I can.
    
    const productsToDelete = await prisma.product.findMany({
      where: {
        OR: [
          { nameAr: { contains: 'قهوة' } },
          { name: { contains: 'Coffee' } }
        ]
      }
    });

    console.log(`Found ${productsToDelete.length} products to potentially delete:`);
    productsToDelete.forEach(p => console.log(`- ${p.sku}: ${p.nameAr || p.name}`));

    // 3. Delete the specific products if they are free from other dependencies (Invoices, Production)
    for (const p of productsToDelete) {
        try {
            await prisma.product.delete({ where: { id: p.id } });
            console.log(`Successfully deleted product: ${p.sku}`);
        } catch (err) {
            console.log(`COULD NOT delete product ${p.sku}: it might be linked to Invoices, Recipes or Production Orders.`);
        }
    }

  } catch (error) {
    console.error('CRITICAL ERROR:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanup();
