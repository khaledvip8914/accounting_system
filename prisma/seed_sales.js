const { PrismaClient } = require('../src/generated/client_v4');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Sales & Inventory data...');

  // 1. Create Accounts if not exists (initially we reset the db, so we need these)
  const accounts = [
    { code: '1101', name: 'Sales Revenue', nameAr: 'إيرادات المبيعات', type: 'Revenue' },
    { code: '1201', name: 'Accounts Receivable', nameAr: 'ذمم مدينة - عملاء', type: 'Asset' },
    { code: '1301', name: 'Inventory', nameAr: 'المخزون', type: 'Asset' },
    { code: '5101', name: 'Cost of Goods Sold', nameAr: 'تكلفة البضاعة المباعة', type: 'Expense' },
    { code: '1102', name: 'Cash', nameAr: 'الصندوق', type: 'Asset' },
  ];

  for (const acc of accounts) {
    await prisma.account.upsert({
      where: { code: acc.code },
      update: {},
      create: acc,
    });
  }

  // 2. Create Customers
  const customers = [
    { code: 'C001', name: 'Global Tech Solutions', nameAr: 'حلول التقنية العالمية', email: 'info@globaltech.com', phone: '0501234567', balance: 5000 },
    { code: 'C002', name: 'Al-Noor Trading', nameAr: 'النور للتجارة', email: 'sales@alnoor.sa', phone: '0559876543', balance: 0 },
  ];

  for (const c of customers) {
    await prisma.customer.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    });
  }

  // 3. Create Products
  const products = [
    { sku: 'ITM-001', name: 'Latte Espresso Machine', nameAr: 'ماكينة قهوة لاتيه', unit: 'pc', costPrice: 1200, salePrice: 1850, stockQuantity: 25, reorderPoint: 5 },
    { sku: 'ITM-002', name: 'Premium Coffee Beans (1kg)', nameAr: 'حبوب قهوة مختصة (1كجم)', unit: 'kg', costPrice: 45, salePrice: 85, stockQuantity: 120, reorderPoint: 20 },
    { sku: 'ITM-003', name: 'Paper Cups (Pack 50)', nameAr: 'أكواب ورقية (عبوة 50)', unit: 'pack', costPrice: 12, salePrice: 25, stockQuantity: 3, reorderPoint: 10 },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: p,
    });
  }

  // 4. Create Suppliers
  const suppliers = [
    { code: 'S001', name: 'Al-Hamed Coffee Roasters', nameAr: 'محامص الحامد للقهوة', email: 'procure@alhamed.com', phone: '0511122233', balance: 0 },
    { code: 'S002', name: 'Packaging Pro Co.', nameAr: 'شركة التغليف الاحترافية', email: 'order@packpro.sa', phone: '0566677788', balance: 1500 },
  ];

  for (const s of suppliers) {
    await prisma.supplier.upsert({
      where: { code: s.code },
      update: {},
      create: s,
    });
  }

  // 5. Create Warehouses
  const warehouses = [
    { code: 'WH1', name: 'Main Warehouse', nameAr: 'المستودع الرئيسي', location: 'Industrial Area' },
    { code: 'WH2', name: 'Showroom Store', nameAr: 'مستودع المعرض', location: 'Downtown' },
  ];

  for (const w of warehouses) {
    await prisma.warehouse.upsert({
      where: { code: w.code },
      update: {},
      create: w,
    });
  }

  console.log('Seed completed successfully with Warehouses!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
