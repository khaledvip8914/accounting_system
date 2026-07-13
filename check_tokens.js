const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { resetToken: { not: null } },
    select: { email: true, resetToken: true, resetTokenExpiry: true }
  });
  console.log("Users with tokens:", users);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
