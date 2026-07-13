// No pg module needed, using PrismaClient instead
// Actually I'll use the generated prisma client's internal engine if I can, 
// but it's easier to just use a script that doesn't rely on Prisma for a quick check.
// Oh wait, I don't have 'pg' in package.json.

// I'll use Prisma with a different URL.
const { PrismaClient } = require('../src/generated/client_v8');

async function test(user, pass) {
  const url = `postgresql://${user}:${pass}@localhost:5432/accounting_db?schema=public`;
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: url,
      },
    },
  });

  try {
    console.log(`Testing with user: ${user}...`);
    await prisma.$connect();
    console.log(`SUCCESS with user: ${user}`);
    return true;
  } catch (err) {
    console.log(`FAILED with user: ${user}: ${err.message}`);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

async function run() {
  await test('postgres', 'MyStrongPassword123');
  await test('postgres', 'postgres');
  await test('accounting_user', 'MyStrongPassword123');
}

run();
