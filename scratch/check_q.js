const { PrismaClient } = require('../src/generated/client');
const prisma = new PrismaClient();

async function checkQuotations() {
  try {
    const count = await prisma.salesQuotation.count();
    console.log('SalesQuotation count:', count);
    if (count > 0) {
      const all = await prisma.salesQuotation.findMany();
      console.log('Quotations:', all.map(q => q.quotationNumber));
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkQuotations();
