const { PrismaClient } = require('../src/generated/client_v7');
const prisma = new PrismaClient();

async function fixCodes() {
  console.log('--- Fixing Codes for Consistency ---');
  
  // Update Accounts Payable to 2000 if it exists
  const ap = await prisma.account.findFirst({ where: { code: '2100', nameAr: 'حسابات الموردين (ذمم)' } });
  if (ap) {
     await prisma.account.update({ where: { id: ap.id }, data: { code: '2000' } });
  }

  // Update Accrued Salaries to 2100 if it exists with other code
  const as = await prisma.account.findFirst({ where: { code: '2110', nameAr: 'رواتب مستحقة' } });
  if (as) {
     await prisma.account.update({ where: { id: as.id }, data: { code: '2100' } });
  }

  console.log('--- Codes Fixed ---');
  process.exit(0);
}

fixCodes();
