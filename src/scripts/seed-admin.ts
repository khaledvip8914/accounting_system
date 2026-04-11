// @ts-nocheck
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const user = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      name: 'Administrator',
      role: 'Admin',
      email: 'admin@nexaccount.com'
    }
  });
  
  console.log('✅ Admin user created successfully!');
  console.log('Username: admin');
  console.log('Password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding admin user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
