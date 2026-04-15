const { PrismaClient } = require('../src/generated/client_v8');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  try {
    const hashedPassword = await bcrypt.hash('admin', 10);
    
    const user = await prisma.user.update({
      where: { username: 'master' },
      data: {
        password: hashedPassword
      }
    });
    
    console.log('✅ Password updated for user:', user.username);
    console.log('New password set to: admin');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
