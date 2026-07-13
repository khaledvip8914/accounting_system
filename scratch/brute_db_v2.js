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
    console.log(`Testing with user: ${user} and password: [${pass}]...`);
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
  await test('postgres', '');
  await test('accounting_user', '');
  await test('postgres', '123456');
  await test('postgres', 'password');
}

run();
