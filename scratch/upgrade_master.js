
const { PrismaClient } = require('../src/generated/client_v8');
const prisma = new PrismaClient();

const ALL_PERMISSIONS = {
  quotations: ['view', 'create', 'edit', 'delete'],
  invoices: ['view', 'create', 'edit', 'delete'],
  production: ['view', 'create', 'edit', 'delete'],
  inventory: ['view', 'create', 'edit', 'delete'],
  purchases: ['view', 'create', 'edit', 'delete'],
  accounting: ['view', 'create', 'edit', 'delete'],
  hr: ['view', 'create', 'edit', 'delete'],
  settings: ['view', 'create', 'edit', 'delete'],
  reports: ['view', 'create', 'edit', 'delete'],
  contacts: ['view', 'create', 'edit', 'delete']
};

async function main() {
  console.log('Ensuring Master Admin role has all permissions...');
  
  // 1. Update/Create 'Admin' role
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: { 
      permissions: JSON.stringify(ALL_PERMISSIONS) 
    },
    create: { 
      name: 'Admin',
      permissions: JSON.stringify(ALL_PERMISSIONS) 
    }
  });

  console.log('Admin Role updated:', adminRole.name);

  // 2. Ensure any user named 'master' or with 'Admin' role is updated
  const updated = await prisma.user.updateMany({
    where: { 
      OR: [
        { username: 'master' },
        { username: 'admin' },
        { role: 'Admin' }
      ]
    },
    data: {
      roleId: adminRole.id,
      permissions: JSON.stringify(ALL_PERMISSIONS)
    }
  });

  console.log('Updated users:', updated.count);
}

main().finally(() => prisma.$disconnect());
