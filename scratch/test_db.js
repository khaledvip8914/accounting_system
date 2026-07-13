const { PrismaClient } = require('../src/generated/client_v8');
const prisma = new PrismaClient();

async function test() {
  try {
    console.log('Testing database connection...');
    const accounts = await prisma.account.findMany({ take: 5 });
    console.log('Database connection successful.');
    console.log('Accounts found:', accounts.length);
    if (accounts.length > 0) {
        console.log('Sample accounts:', accounts.map(a => a.code));
    }
    process.exit(0);
  } catch (err) {
    console.error('Database Connection Error:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

test();
