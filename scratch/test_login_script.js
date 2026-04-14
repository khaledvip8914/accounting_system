const { PrismaClient } = require('../src/generated/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function testLogin(username, password) {
  try {
    console.log(`Testing login for [${username}] with password [${password}]`);
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      console.log('❌ User NOT found in database.');
      return;
    }

    console.log(`✅ User found. Stored Hash: ${user.password}`);
    const match = await bcrypt.compare(password, user.password);
    
    if (match) {
      console.log('✅ Password matches!');
    } else {
      console.log('❌ Password DOES NOT match.');
    }

  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    await prisma.$disconnect();
  }
}

// Test both admin and khaled with 'admin'
testLogin('admin', 'admin');
testLogin('khaled', 'admin');
