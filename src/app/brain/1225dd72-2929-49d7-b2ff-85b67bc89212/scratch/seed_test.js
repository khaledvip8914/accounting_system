const path = require('path');
const { PrismaClient } = require(path.join(process.cwd(), 'src/generated/client_v8'));
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  // 1. Create Default System Company
  const systemCompany = await prisma.company.upsert({
    where: { id: 'default' },
    update: { name: 'نظام المحاسبة المركزي' },
    create: {
      id: 'default',
      name: 'نظام المحاسبة المركزي',
      subscriptionStatus: 'Active',
    },
  });

  // 2. Create SuperAdmin User
  const superAdmin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
        password: hashedPassword,
        companyId: 'default',
        role: 'SuperAdmin'
    },
    create: {
      username: 'admin',
      email: 'admin@system.com',
      password: hashedPassword,
      name: 'المسؤول الأعلى',
      role: 'SuperAdmin',
      companyId: 'default',
      emailVerified: new Date(),
    },
  });

  console.log('✅ System ready for testing!');
  console.log('SuperAdmin Login: admin / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
