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

async function zeroInventory() {
  const rootDir = 'C:\\Users\\sun\\.gemini\\antigravity\\scratch\\accounting_software';
  const dbFiles = getAllFiles(rootDir);
  
  for (const dbPath of dbFiles) {
    console.log(`Setting stock to 0 in: ${dbPath}`);
    const dbUrl = `file:${dbPath.replace(/\\/g, '/')}`;
    const prisma = new PrismaClient({ datasources: { db: { url: dbUrl } } });

    try {
      // Set all Product stockQuantity to 0
      const prodResult = await prisma.product.updateMany({
        data: { stockQuantity: 0 }
      });
      
      // Set all WarehouseStock quantity to 0
      const whResult = await prisma.warehouseStock.updateMany({
        data: { quantity: 0 }
      });

      console.log(`  ✅ Done. Updated ${prodResult.count} products and ${whResult.count} warehouse stocks.`);
    } catch (err) {
      console.error(`  ❌ Failed: ${err.message}`);
    } finally {
      await prisma.$disconnect();
    }
  }
}

zeroInventory();
