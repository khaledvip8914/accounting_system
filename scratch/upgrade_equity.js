
const { PrismaClient } = require('../src/generated/client_v8');
const prisma = new PrismaClient();

async function main() {
  console.log('Upgrading Equity structure in Chart of Accounts...');

  // 1. Find Equity Root
  const equityRoot = await prisma.account.findUnique({ where: { code: '3' } });
  if (!equityRoot) {
    console.error('Equity root (code 3) not found. Please seed the COA first.');
    return;
  }

  // 2. Define Sub-parents
  const subParents = [
    { code: '31', name: 'Capital', nameAr: 'رأس المال', type: 'Equity', parentId: equityRoot.id, nature: 'Credit' },
    { code: '32', name: 'Reserves', nameAr: 'الاحتياطيات', type: 'Equity', parentId: equityRoot.id, nature: 'Credit' },
    { code: '33', name: 'Partners Current Accounts', nameAr: 'جاري الشركاء / الملاك', type: 'Equity', parentId: equityRoot.id, nature: 'Credit' },
    { code: '34', name: 'Retained Earnings (or Losses)', nameAr: 'الأرباح المبقاة (أو الخسائر)', type: 'Equity', parentId: equityRoot.id, nature: 'Credit' },
    { code: '35', name: 'Treasury Shares', nameAr: 'أسهم الخزانة', type: 'Equity', parentId: equityRoot.id, nature: 'Debit', description: 'أسهم تشتريها الشركة من السوق وتقلل من حقوق الملكية' }
  ];

  const parentMap = new Map();

  for (const sp of subParents) {
    let acc = await prisma.account.findUnique({ where: { code: sp.code } });
    if (!acc) {
      acc = await prisma.account.create({ data: sp });
      console.log(`Created parent: ${sp.nameAr} (${sp.code})`);
    } else {
      console.log(`Parent already exists: ${sp.nameAr} (${sp.code})`);
    }
    parentMap.set(sp.code, acc.id);
  }

  // 3. Define Specific accounts
  const specificAccounts = [
    { code: '3101', name: 'Registered Capital', nameAr: 'رأس المال المسجل', type: 'Equity', parentId: parentMap.get('31'), nature: 'Credit' },
    { code: '3102', name: 'Paid-in Capital', nameAr: 'رأس المال المدفوع', type: 'Equity', parentId: parentMap.get('31'), nature: 'Credit' },
    { code: '3201', name: 'Statutory Reserve', nameAr: 'الاحتياطي النظامي', type: 'Equity', parentId: parentMap.get('32'), nature: 'Credit' },
    { code: '3202', name: 'General Reserve', nameAr: 'الاحتياطي العام', type: 'Equity', parentId: parentMap.get('32'), nature: 'Credit' },
    { code: '3301', name: 'Partner Current Account 1', nameAr: 'جاري الشريك (1)', type: 'Equity', parentId: parentMap.get('33'), nature: 'Credit' },
    { code: '3401', name: 'Retained Earnings', nameAr: 'أرباح محتجزة', type: 'Equity', parentId: parentMap.get('34'), nature: 'Credit' },
    { code: '3402', name: 'Current Year Profit/Loss', nameAr: 'أرباح وخسائر العام الحالي', type: 'Equity', parentId: parentMap.get('34'), nature: 'Credit' },
    { code: '3501', name: 'Treasury Shares (at cost)', nameAr: 'أسهم الخزانة (بالتكلفة)', type: 'Equity', parentId: parentMap.get('35'), nature: 'Debit' }
  ];

  for (const sa of specificAccounts) {
    const existing = await prisma.account.findUnique({ where: { code: sa.code } });
    if (!existing) {
      await prisma.account.create({ data: sa });
      console.log(`Created account: ${sa.nameAr} (${sa.code})`);
    } else {
      console.log(`Account already exists: ${sa.nameAr} (${sa.code})`);
    }
  }

  console.log('Equity upgrade complete!');
}

main().finally(() => prisma.$disconnect());
