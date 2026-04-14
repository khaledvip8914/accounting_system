const { PrismaClient } = require('../src/generated/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
      }
    } else {
      if (file === 'dev.db') {
        arrayOfFiles.push(path.join(dirPath, file));
      }
    }
  });

  return arrayOfFiles;
}

async function resetAllDbs() {
  const rootDir = 'C:\\Users\\sun\\.gemini\\antigravity\\scratch\\accounting_software';
  const dbFiles = getAllFiles(rootDir);
  console.log('Found following DB files:', dbFiles);

  const password = 'admin';
  const hashedPassword = await bcrypt.hash(password, 10);

  for (const dbPath of dbFiles) {
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
  }
}

resetAllDbs();
