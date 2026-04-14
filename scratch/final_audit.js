const { PrismaClient } = require('../src/generated/client');
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

async function finalAudit() {
  const rootDir = 'C:\\Users\\sun\\.gemini\\antigravity\\scratch\\accounting_software';
  const dbFiles = getAllFiles(rootDir);
  
  for (const dbPath of dbFiles) {
    console.log(`Auditing: ${dbPath}`);
    const dbUrl = `file:${dbPath.replace(/\\/g, '/')}`;
    const prisma = new PrismaClient({ datasources: { db: { url: dbUrl } } });

    try {
      const pCount = await prisma.product.count();
      const sCount = await prisma.salesInvoice.count();
      const accCount = await prisma.account.count();
      const uCount = await prisma.user.count();
      console.log(`  Products: ${pCount}, Sales: ${sCount}, Accounts: ${accCount}, Users: ${uCount}`);
    } catch (err) {
      console.error(`  ❌ Failed: ${err.message}`);
    } finally {
      await prisma.$disconnect();
    }
  }
}

finalAudit();
