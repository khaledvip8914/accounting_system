const { PrismaClient } = require('../src/generated/client_v8');

async function test() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: 'postgresql://accounting_user:MyStrongPassword123@127.0.0.1:5432/accounting_db?schema=public',
      },
    },
  });

  try {
    console.log('Testing connection with 127.0.0.1...');
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
