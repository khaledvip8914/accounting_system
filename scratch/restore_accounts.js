const { PrismaClient } = require('../src/generated/client_v7');
const path = require('path');

async function restore() {
  console.log('--- Starting COA Restoration ---');
  
  // 1. Connect to Source DB (Old backup)
  const sourcePrisma = new PrismaClient({
    datasources: {
      db: {
        url: `file:${path.resolve(__dirname, '../dist_final/prisma/dev.db')}`
      }
    }
  });

  // 2. Connect to Target DB (Current)
  const targetPrisma = new PrismaClient({
    datasources: {
      db: {
        url: `file:${path.resolve(__dirname, '../prisma/dev.db')}`
      }
    }
  });

  try {
    console.log('Reading accounts from source...');
    const sourceAccounts = await sourcePrisma.account.findMany();
    console.log(`Found ${sourceAccounts.length} accounts in source.`);

    console.log('Clearing existing accounts in target...');
    await targetPrisma.account.deleteMany({});
    
    // Sort accounts to ensure parents are created before children (though cuid might be fine, but better safe)
    // Actually, we'll just insert everything. Since we have the IDs, we can disable fk checks if needed, 
    // but SQLite is fine with batch insert as long as order is okay.
    // We'll insert in order of depth or just batch.
    
    console.log('Inserting accounts into target...');
    // We insert top-level first (parentId is null)
    const roots = sourceAccounts.filter(a => !a.parentId);
    const children = sourceAccounts.filter(a => a.parentId);

    for (const acc of roots) {
       await targetPrisma.account.create({ data: acc });
    }
    
    // For children, we might have multiple levels. We'll iterate until all are done.
    let remaining = children;
    while (remaining.length > 0) {
       const initialCount = remaining.length;
       const nextBatch = [];
       for (const acc of remaining) {
          try {
             await targetPrisma.account.create({ data: acc });
          } catch (e) {
             nextBatch.push(acc);
          }
       }
       remaining = nextBatch;
       if (remaining.length === initialCount) {
          console.error('Stuck! Circular or missing parents for:', remaining.map(a => a.name));
          break;
       }
    }

    console.log('--- Restoration Complete ---');
  } catch (err) {
    console.error('Restoration failed:', err);
  } finally {
    await sourcePrisma.$disconnect();
    await targetPrisma.$disconnect();
  }
}

restore();
