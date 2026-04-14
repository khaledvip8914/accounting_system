const { PrismaClient } = require('../src/generated/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function resetPasswords() {
  try {
    const password = 'admin'; 
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log(`Resetting admin and khaled to password: [${password}]`);
    
    await prisma.user.update({
      where: { username: 'admin' },
      data: { password: hashedPassword }
    });
    
    await prisma.user.update({
      where: { username: 'khaled' },
      data: { password: hashedPassword }
    });

    console.log('✅ Passwords updated to "admin"');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

resetPasswords();
