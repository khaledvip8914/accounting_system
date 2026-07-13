const { PrismaClient } = require('./src/generated/client_v8');

async function testPasswords() {
  const usernames = ['postgres', 'accounting_user', 'admin'];
  const passwords = [
    'admin', 'admin123', '123456', '123', '1234', '0000', 
    '0104689732', '0104689732Kh', '0104689732@Kh'
  ];

  for (const user of usernames) {
    for (const pass of passwords) {
      const url = `postgresql://${user}:${pass}@localhost:5432/accounting_db?schema=public`;
      const prisma = new PrismaClient({ datasources: { db: { url } } });
      try {
        await prisma.$connect();
        console.log(`\n✅ SUCCESS! Connection established with:`);
        console.log(`Username: ${user}`);
        console.log(`Password: ${pass}`);
        await prisma.$disconnect();
        process.exit(0);
      } catch (err) {
        process.stdout.write('.');
      } finally {
        await prisma.$disconnect();
      }
    }
  }
  console.log(`\n❌ Failed to connect with any of the provided passwords.`);
  process.exit(1);
}

testPasswords();
