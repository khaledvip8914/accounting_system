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

async function auditDbs() {
  const rootDir = 'C:\\Users\\sun\\.gemini\\antigravity\\scratch\\accounting_software';
  const dbFiles = getAllFiles(rootDir);
  
  for (const dbPath of dbFiles) {
    console.log(`Auditing DB: ${dbPath}`);
    const dbUrl = `file:${dbPath.replace(/\\/g, '/')}`;
    const prisma = new PrismaClient({
      datasources: { db: { url: dbUrl } }
    });

    try {
      const userCount = await prisma.user.count();
      const productCount = await prisma.product.count();
      const salesCount = await prisma.salesInvoice.count();
      const warehouseCount = await prisma.warehouse ? await prisma.warehouse.count() : 0;
      
      console.log(`  Users: ${userCount}, Products: ${productCount}, Sales: ${salesCount}, Warehouses: ${warehouseCount}`);
    } catch (err) {
      console.error(`  ❌ Failed: ${err.message}`);
    } finally {
      await prisma.$disconnect();
    }
  }
}

auditDbs();
