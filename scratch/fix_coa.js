const { PrismaClient } = require('../src/generated/client_v7');
const prisma = new PrismaClient();

async function fixCOA() {
  console.log('--- Fixing Chart of Accounts ---');

  // 1. Fixing Nature based on Type
  const accounts = await prisma.account.findMany();
  for (const acc of accounts) {
    let correctNature = (['Asset', 'Expense'].includes(acc.type)) ? 'Debit' : 'Credit';
    
    // Exception: Accumulated Depreciation (1510) is a Contra-Asset, should be Credit
    if (acc.code === '1510') correctNature = 'Credit';
    // Exception: Sales Returns (4200) is a Contra-Revenue, should be Debit
    if (acc.code === '4200') correctNature = 'Debit';

    if (acc.nature !== correctNature) {
       console.log(`Updating ${acc.code} (${acc.name}): ${acc.nature} -> ${correctNature}`);
       await prisma.account.update({
         where: { id: acc.id },
         data: { nature: correctNature }
       });
    }
  }

  // 2. Add Missing Critical Accounts (Advances & Penalties)
  const roots = await prisma.account.findMany({ where: { parentId: null } });
  const assetRoot = roots.find(r => r.type === 'Asset');
  const revenueRoot = roots.find(r => r.type === 'Revenue');
  const expenseRoot = roots.find(r => r.type === 'Expense');

  const newAccounts = [
    { 
      code: '1205', 
      name: 'Advances to Employees', 
      nameAr: 'سلف الموظفين', 
      type: 'Asset', 
      parentId: assetRoot?.id, 
      nature: 'Debit', 
      description: 'المبالغ التي تم صرفها للموظفين كسلف مستحقة السداد' 
    },
    { 
      code: '4400', 
      name: 'Penalties Income', 
      nameAr: 'إيرادات الجزاءات', 
      type: 'Revenue', 
      parentId: revenueRoot?.id, 
      nature: 'Credit', 
      description: 'الإيرادات المحققة من الجزاءات والخصومات على الموظفين' 
    }
  ];

  for (const n of newAccounts) {
    const exists = await prisma.account.findFirst({ where: { code: n.code } });
    if (!exists) {
       console.log(`Adding missing account: ${n.code} - ${n.nameAr}`);
       await prisma.account.create({ data: n });
    }
  }

  // 3. Update Descriptions
  const standardDescriptions = {
    '1000': 'النقدية المتوفرة في صناديق الشركة',
    '1020': 'رصيد الشركة في البنك الرئيسي',
    '1200': 'المبالغ المستحقة على العملاء السحب على المكشوف',
    '1300': 'قيمة البضاعة المخزنة في المستودعات',
    '2000': 'المبالغ المستحقة للموردين مقابل مشتريات آجلة',
    '2100': 'الرواتب المحتسبة للموظفين والتي لم تصرف بعد',
    '4000': 'إجمالي مبيعات السلع والمنتجات',
    '6000': 'إجمالي الرواتب والأجور الشهرية للموظفين'
  };

  for (const [code, desc] of Object.entries(standardDescriptions)) {
     await prisma.account.updateMany({
        where: { code },
        data: { description: desc }
     });
  }

  console.log('--- COA Fix Complete ---');
  process.exit(0);
}

fixCOA();
