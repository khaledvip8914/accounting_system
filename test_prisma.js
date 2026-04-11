const { prisma } = require('./src/lib/db');

async function test() {
  try {
    const invoices = await prisma.salesInvoice.findMany();
    console.log('Invoices found:', invoices.length);
    process.exit(0);
  } catch (err) {
    console.error('Prisma Error:', err.message);
    process.exit(1);
  }
}

test();
