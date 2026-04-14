const { PrismaClient } = require('../src/generated/client_v7');
const prisma = new PrismaClient();

async function reorganizeAssets() {
  console.log('--- Reorganizing Assets into Current and Fixed ---');

  try {
    // 1. Clear existing accounts to start fresh
    await prisma.journalEntry.deleteMany({});
    await prisma.account.deleteMany({});

    // 2. Base Categories
    const assetRoot = await prisma.account.create({ data: { code: '1', name: 'Assets', nameAr: 'الأصول', type: 'Asset', nature: 'Debit' } });
    const liabilityRoot = await prisma.account.create({ data: { code: '2', name: 'Liabilities', nameAr: 'الخصوم', type: 'Liability', nature: 'Credit' } });
    const equityRoot = await prisma.account.create({ data: { code: '3', name: 'Equity', nameAr: 'حقوق الملكية', type: 'Equity', nature: 'Credit' } });
    const revenueRoot = await prisma.account.create({ data: { code: '4', name: 'Revenue', nameAr: 'الإيرادات', type: 'Revenue', nature: 'Credit' } });
    const expenseRoot = await prisma.account.create({ data: { code: '5', name: 'Expenses', nameAr: 'المصروفات', type: 'Expense', nature: 'Debit' } });

    // 3. Asset Sub-Categories
    const currentAsset = await prisma.account.create({ 
      data: { code: '11', name: 'Current Assets', nameAr: 'الأصول المتداولة', type: 'Asset', parentId: assetRoot.id, nature: 'Debit', description: 'الأصول التي يمكن تحويلها إلى نقد خلال سنة مالية واحدة' } 
    });
    const fixedAsset = await prisma.account.create({ 
      data: { code: '12', name: 'Fixed Assets', nameAr: 'الأصول الثابتة', type: 'Asset', parentId: assetRoot.id, nature: 'Debit', description: 'الأصول طويلة الأجل المستخدمة في تشغيل النشاط وغير معدة للبيع' } 
    });

    // 4. Detailed Accounts
    const detailed = [
      // Current Assets (11xx)
      { code: '1100', name: 'Cash on Hand', nameAr: 'النقدية بالصندوق', type: 'Asset', parentId: currentAsset.id, nature: 'Debit', description: 'النقد الموجود فعلياً في خزينة الشركة' },
      { code: '1110', name: 'Petty Cash', nameAr: 'العهد النقدية', type: 'Asset', parentId: currentAsset.id, nature: 'Debit', description: 'المبالغ النقدية لدى الموظفين للمصروفات الصغيرة' },
      { code: '1120', name: 'Main Bank Account', nameAr: 'حساب البنك الرئيسي', type: 'Asset', parentId: currentAsset.id, nature: 'Debit', description: 'الرصيد النقدي في الحساب البنكي الأساسي لدى البنك' },
      { code: '1130', name: 'Accounts Receivable', nameAr: 'حسابات العملاء (ذمم)', type: 'Asset', parentId: currentAsset.id, nature: 'Debit', description: 'الأرصدة المدينة المستحقة على العملاء مقابل مبيعات آجلة' },
      { code: '1135', name: 'Advances to Employees', nameAr: 'سلف الموظفين', type: 'Asset', parentId: currentAsset.id, nature: 'Debit', description: 'قيمة السلف والعهد الشخصية الممنوحة للموظفين' },
      { code: '1140', name: 'Inventory', nameAr: 'المخزون', type: 'Asset', parentId: currentAsset.id, nature: 'Debit', description: 'قيمة البضائع والمواد المخزنة القابلة للبيع' },
      { code: '1150', name: 'VAT Receivable (Input Tax)', nameAr: 'ضريبة القيمة المضافة المدفوعة', type: 'Asset', parentId: currentAsset.id, nature: 'Debit', description: 'قيمة الضريبة على المشتريات القابلة للاسترداد من الدولة' },
      
      // Fixed Assets (12xx)
      { code: '1200', name: 'Machinery & Equipment', nameAr: 'آلات ومعدات', type: 'Asset', parentId: fixedAsset.id, nature: 'Debit', description: 'قيمة الأصول الثابتة من آلات ومعدات ووسائل إنتاج' },
      { code: '1210', name: 'Office Furniture', nameAr: 'أثاث ومعدات مكاتب', type: 'Asset', parentId: fixedAsset.id, nature: 'Debit', description: 'الأصول الثابتة المستخدمة في المكاتب الإدارية' },
      { code: '1220', name: 'Vehicles', nameAr: 'سيارات ووسائل نقل', type: 'Asset', parentId: fixedAsset.id, nature: 'Debit', description: 'السيارات والشاحنات المملوكة للشركة' },
      { code: '1299', name: 'Accumulated Depreciation', nameAr: 'مجمع الإهلاك', type: 'Asset', parentId: fixedAsset.id, nature: 'Credit', description: 'إجمالي قيمة استهلاك الأصول الثابتة عبر الزمن' },

      // Other Categories (Briefly)
      { code: '2100', name: 'Accounts Payable', nameAr: 'حسابات الموردين (ذمم)', type: 'Liability', parentId: liabilityRoot.id, nature: 'Credit', description: 'الالتزامات المالية للموردين مقابل مشتريات آجلة' },
      { code: '2110', name: 'Accrued Salaries', nameAr: 'رواتب مستحقة', type: 'Liability', parentId: liabilityRoot.id, nature: 'Credit' },
      { code: '2120', name: 'VAT Payable (Output Tax)', nameAr: 'ضريبة القيمة المضافة المحصلة', type: 'Liability', parentId: liabilityRoot.id, nature: 'Credit' },
      
      { code: '3100', name: 'Capital', nameAr: 'رأس المال', type: 'Equity', parentId: equityRoot.id, nature: 'Credit' },
      { code: '3200', name: 'Retained Earnings', nameAr: 'الأرباح المبقاة', type: 'Equity', parentId: equityRoot.id, nature: 'Credit' },

      { code: '4000', name: 'Sales Revenue', nameAr: 'إيرادات المبيعات', type: 'Revenue', parentId: revenueRoot.id, nature: 'Credit' },
      { code: '4400', name: 'Penalties Income', nameAr: 'إيرادات الجزاءات', type: 'Revenue', parentId: revenueRoot.id, nature: 'Credit' },

      { code: '5000', name: 'Cost of Goods Sold', nameAr: 'تكلفة البضاعة المباعة', type: 'Expense', parentId: expenseRoot.id, nature: 'Debit' },
      { code: '6000', name: 'Salaries and Wages', nameAr: 'رواتب وأجور', type: 'Expense', parentId: expenseRoot.id, nature: 'Debit' }
    ];

    await prisma.account.createMany({ data: detailed });

    console.log('--- Assets Reorganization Complete ---');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

reorganizeAssets();
