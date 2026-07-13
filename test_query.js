const { PrismaClient } = require('./src/generated/client_v8');

async function testQuery() {
  const prisma = new PrismaClient();
  try {
    const invoices = await prisma.salesInvoice.findMany({ take: 1 });
    console.log("Success! Found invoices:", invoices.length);
  } catch (err) {
    console.error("Query Error:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

testQuery();
