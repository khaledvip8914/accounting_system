const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetAdmin() {
  console.log('🔄 جاري البحث عن حساب الآدمن وتحديثه...');
  
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const user = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      password: hashedPassword,
      companyId: 'default',
      role: 'Admin'
    },
    create: {
      username: 'admin',
      password: hashedPassword,
      name: 'Administrator',
      role: 'Admin',
      companyId: 'default',
      email: 'admin@qaydx.com'
    }
  });

  console.log('✅ تم إعادة تعيين بيانات الآدمن بنجاح!');
  console.log('-----------------------------------');
  console.log('معرف النظام (Company ID): default');
  console.log('اسم المستخدم (Username): admin');
  console.log('كلمة المرور (Password): admin123');
  console.log('-----------------------------------');
}

resetAdmin()
  .catch(e => {
    console.error('❌ حدث خطأ:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
