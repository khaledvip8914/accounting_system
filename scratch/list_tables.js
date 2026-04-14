const { PrismaClient } = require('../src/generated/client');
const prisma = new PrismaClient();

async function listTables() {
  try {
    const result = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table'`;
    console.log('Tables in DB:', result);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

listTables();
