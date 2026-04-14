const { PrismaClient } = require('../src/generated/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const count = await prisma.salesInvoice.count();
    console.log('SalesInvoice count in prisma/dev.db:', count);
    
    const invoices = await prisma.salesInvoice.findMany({ take: 5 });
    console.log('First 5 invoices:', invoices.map(i => i.invoiceNumber));

    const products = await prisma.product.count();
    console.log('Product count:', products);

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
