const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function fix() {
  await prisma.account.updateMany({
    where: { code: '2100-PEN' },
    data: { code: '2110', nameAr: 'صندوق جزاءات الموظفين', description: 'مخصصات وجزاءات الموظفين' }
  });
  await prisma.account.updateMany({
    where: { code: '1150-PEN' },
    data: { code: '1151', nameAr: 'ذمم جزاءات الموظفين', description: 'مستحقات جزاءات على الموظفين' }
  });
  console.log('Fixed accounts');
}
fix().finally(() => prisma.$disconnect());
