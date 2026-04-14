const { PrismaClient } = require('../src/generated/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function createMasterUser() {
  try {
    const username = 'master';
    const password = 'masterpassword';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await prisma.user.upsert({
      where: { username },
      update: { password: hashedPassword },
      create: {
        username,
        password: hashedPassword,
        name: 'Master User',
        role: 'Admin'
      }
    });

    console.log(`✅ User 'master' created with password 'masterpassword'`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

createMasterUser();
