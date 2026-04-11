const { PrismaClient } = require('./src/generated/client_v4');
const prisma = new PrismaClient();

async function main() {
  const vouchers = await prisma.transactionVoucher.findMany({
    include: { primaryAccount: true, relatedAccount: true }
  });
  console.log(JSON.stringify(vouchers, null, 2));
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
