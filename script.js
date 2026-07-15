const { PrismaClient } = require('./src/generated/client_v8');
const prisma = new PrismaClient();
async function main() {
  const invs = await prisma.salesInvoice.findMany({
    orderBy: { createdAt: 'desc' },
    take: 3,
    select: { invoiceNumber: true, branchId: true, zatcaStatus: true, zatcaErrorLogs: true }
  });
  console.log(JSON.stringify(invs, null, 2));
}
main().catch(console.error).finally(()=>prisma.$disconnect());
