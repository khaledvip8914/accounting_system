const { PrismaClient } = require('../src/generated/client_v7');

async function main() {
  const prisma = new PrismaClient();
  try {
    const userCount = await prisma.user.count();
    console.log('Successfully connected to SQLite database.');
    console.log('User count:', userCount);
    process.exit(0);
  } catch (err) {
    console.error('Failed to connect to database:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
