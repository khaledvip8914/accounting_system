
const { PrismaClient } = require('../src/generated/client_v8');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: { roleRef: true }
  });
  
  console.log('All Users:');
  users.forEach(u => {
    console.log(`- ${u.username} (ID: ${u.id}, Role: ${u.role})`);
  });
}

main().finally(() => prisma.$disconnect());
