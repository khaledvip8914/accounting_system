const { PrismaClient } = require('../src/generated/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function resetPasswords() {
  try {
    const password = 'admin'; // Specific password to match what user might expect or just use a simple one
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log(`Setting password for 'admin' and 'khaled' to: [${password}]`);
    
    const admin = await prisma.user.update({
      where: { username: 'admin' },
      data: { password: hashedPassword }
    });
    console.log(`✅ Admin password reset successful.`);

    const khaled = await prisma.user.update({
      where: { username: 'khaled' },
      data: { password: hashedPassword }
    });
    console.log(`✅ Khaled password reset successful.`);

  } catch (err) {
    console.error('Error resetting passwords:', err);
  } finally {
    await prisma.$disconnect();
  }
}

resetPasswords();
