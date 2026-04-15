const { PrismaClient } = require('../src/generated/client_v8');
const prisma = new PrismaClient();

async function main() {
  try {
    const userCount = await prisma.user.count();
    console.log('Successfully connected to DB. User count:', userCount);
    await prisma.$disconnect();
  } catch (e) {
    console.error('Failed to connect to DB:', e);
    process.exit(1);
  }
}

main();
