// @ts-nocheck
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { username: 'admin' },
  });

  if (user) {
    console.log('✅ Admin user found');
    console.log('Username:', user.username);
    console.log('Hashed Password:', user.password);
    console.log('Length:', user.password.length);
    console.log('Is Hashed:', user.password.startsWith('$2a$') || user.password.startsWith('$2b$'));
  } else {
    console.log('❌ Admin user NOT found');
  }

  await prisma.$disconnect();
}

main();
