const { PrismaClient } = require('../src/generated/client');
const prisma = new PrismaClient();

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        password: true // To check if it looks like a hash
      }
    });
    console.log('--- Users in Database ---');
    users.forEach(u => {
      const isHashed = u.password.startsWith('$2') || u.password.length > 40;
      console.log(`Username: ${u.username}, Role: ${u.role}, PasswordHashed: ${isHashed}`);
      if (!isHashed) {
        console.log(`  WARNING: User ${u.username} has a plain-text password or unknown hash format: [${u.password}]`);
      }
    });
    console.log('-------------------------');
  } catch (err) {
    console.error('Error listing users:', err);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();
