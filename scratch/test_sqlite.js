const { PrismaClient } = require('../src/generated/client_v8');

async function test() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: 'file:../prisma/dev.db',
      },
    },
  });

  try {
    console.log('Testing SQLite connection...');
    const accounts = await prisma.account.findMany({ take: 5 });
    console.log('SQLite connection successful!');
    console.log('Accounts found:', accounts.length);
    process.exit(0);
  } catch (err) {
    console.error('SQLite Error:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

test();
