const { PrismaClient } = require('../src/generated/client_v8');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Create Role if it doesn't exist
    const adminRole = await prisma.role.upsert({
      where: { name: 'Admin' },
      update: {},
      create: {
        name: 'Admin',
        permissions: JSON.stringify({ all: true })
      }
    });

    const user = await prisma.user.upsert({
      where: { username: 'master' },
      update: {
        password: hashedPassword,
        roleId: adminRole.id
      },
      create: {
        username: 'master',
        password: hashedPassword,
        role: 'Admin',
        roleId: adminRole.id,
        name: 'Master Admin'
      }
    });
    
    console.log('✅ Master user created/updated:', user.username);
    console.log('Password set to: admin123');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
