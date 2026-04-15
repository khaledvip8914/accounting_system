
const { PrismaClient } = require('../src/generated/client_v8');
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findUnique({
    where: { username: 'admin' },
    include: { roleRef: true }
  });
  
  console.log('Admin User Info:');
  console.log('ID:', admin.id);
  console.log('Role:', admin.role);
  console.log('RoleId:', admin.roleId);
  console.log('Permissions (User):', admin.permissions);
  if (admin.roleRef) {
    console.log('Permissions (Role):', admin.roleRef.permissions);
  } else {
    console.log('No Role Reference found!');
  }
}

main().finally(() => prisma.$disconnect());
