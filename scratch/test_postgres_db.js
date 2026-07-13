const { PrismaClient } = require('../src/generated/client_v8');

async function test() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: 'postgresql://accounting_user:MyStrongPassword123@localhost:5432/postgres?schema=public',
      },
    },
  });

  try {
    console.log('Testing connection to "postgres" database...');
    await prisma.$connect();
    console.log('Connection successful!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

test();
