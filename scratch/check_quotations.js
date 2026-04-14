const { PrismaClient } = require('../src/generated/client');
const prisma = new PrismaClient();

async function checkQuotations() {
  try {
    const qCount = await prisma.salesQuotation.count();
    console.log('SalesQuotation count:', qCount);
    
    if (qCount > 0) {
      const qs = await prisma.salesQuotation.findMany({ take: 5 });
      console.log('First 5 quotations:', qs.map(q => q.quotationNumber));
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkQuotations();
