const { PrismaClient } = require('../src/generated/client');
const prisma = new PrismaClient();

async function fullAudit() {
  try {
    const tables = [
      'Customer', 'Product', 'SalesInvoice', 'PurchaseInvoice', 
      'Warehouse', 'Account', 'JournalVoucher', 'ProductionOrder'
    ];
    
    console.log('--- Full Audit of prisma/dev.db ---');
    for (const t of tables) {
      try {
        const count = await prisma[t.charAt(0).toLowerCase() + t.slice(1)].count();
        console.log(`${t}: ${count}`);
      } catch (e) {
        console.log(`${t}: ERROR [${e.message.substring(0, 50)}]`);
      }
    }
  } catch (err) {
    console.error('Audit failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

fullAudit();
