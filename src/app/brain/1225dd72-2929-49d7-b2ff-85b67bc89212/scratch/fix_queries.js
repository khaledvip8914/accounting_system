const fs = require('fs');
const path = require('path');

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!fullPath.includes('node_modules') && !fullPath.includes('.next')) {
        processDirectory(fullPath);
      }
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      // Replace findUnique({ where: { code: ... } }) with findFirst({ where: { companyId, code: ... } })
      // For accounts
      content = content.replace(/findUnique\(\{\s*where:\s*\{\s*code:\s*('[^']+'|`[^`]+`|[a-zA-Z0-9_]+)\s*\}\s*\}\)/g, "findFirst({ where: { companyId, code: $1 } })");
      
      // For sku
      content = content.replace(/findUnique\(\{\s*where:\s*\{\s*sku:?\s*([^}]+)\s*\}\s*\}\)/g, "findFirst({ where: { companyId, sku: $1 } })");

      // For invoiceNumber
      content = content.replace(/findUnique\(\{\s*where:\s*\{\s*invoiceNumber:?\s*([^}]+)\s*\}\s*\}\)/g, "findFirst({ where: { companyId, invoiceNumber: $1 } })");

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(path.join(process.cwd(), 'src'));
console.log('All queries updated successfully.');
