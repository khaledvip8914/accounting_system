const { PrismaClient } = require('../src/generated/client_v7');
const prisma = new PrismaClient();

async function check() {
  const accounts = await prisma.account.findMany({ include: { parent: true }, orderBy: { code: 'asc' } });
  accounts.forEach(acc => {
    console.log(`${acc.code.padEnd(10)} | ${acc.nameAr.padEnd(25)} | Parent: ${(acc.parent ? acc.parent.nameAr : 'MAIN').padEnd(15)} | Nature: ${acc.nature}`);
  });
  process.exit(0);
}

check();
