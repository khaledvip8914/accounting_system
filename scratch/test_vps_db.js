const { PrismaClient } = require('../src/generated/client_v8');

async function test() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: 'postgresql://accounting_user:MyStrongPassword123@129.121.99.249:5432/accounting_db?schema=public',
      },
    },
  });

  try {
    console.log('Testing connection to VPS database...');
    await prisma.$connect();
    console.log('SUCCESS!');
    process.exit(0);
  } catch (err) {
    console.error('FAILED:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

test();
