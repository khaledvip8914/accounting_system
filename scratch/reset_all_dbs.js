const { PrismaClient } = require('../src/generated/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function resetAllDbs() {
  const rootDir = 'C:\\Users\\sun\\.gemini\\antigravity\\scratch\\accounting_software';
  const password = 'admin';
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Hardcoded list of DB paths found
  const dbPaths = [
    path.join(rootDir, 'prisma', 'dev.db'),
    path.join(rootDir, '.next', 'standalone', 'prisma', 'dev.db'),
    path.join(rootDir, '.next', 'standalone', 'dist_final', 'prisma', 'dev.db'),
    path.join(rootDir, 'dist_final', 'prisma', 'dev.db')
  ];

  for (const dbPath of dbPaths) {
    if (fs.existsSync(dbPath)) {
      console.log(`Updating database at: ${dbPath}`);
      const dbUrl = `file:${dbPath.replace(/\\/g, '/')}`;
      const prisma = new PrismaClient({
        datasources: { db: { url: dbUrl } }
      });

      try {
        await prisma.user.updateMany({
          where: { username: 'admin' },
          data: { password: hashedPassword }
        });
        await prisma.user.updateMany({
          where: { username: 'khaled' },
          data: { password: hashedPassword }
        });
        
        // Also create a master user just in case
        await prisma.user.upsert({
          where: { username: 'master' },
          update: { password: hashedPassword },
          create: {
            username: 'master',
            password: hashedPassword,
            name: 'Master User',
            role: 'Admin'
          }
        });

        console.log(`  ✅ Success for ${dbPath}`);
      } catch (err) {
        console.error(`  ❌ Failed for ${dbPath}: ${err.message}`);
      } finally {
        await prisma.$disconnect();
      }
    } else {
      console.log(`Skipping non-existent DB: ${dbPath}`);
    }
  }
}

resetAllDbs();
