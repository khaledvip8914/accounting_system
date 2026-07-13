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
      
      // Update getAuthContext to return the full user object under the 'permissions' key
      content = content.replace(/permissions:\s*session\.user\.permissions/g, "permissions: session.user");

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated getAuthContext in ${fullPath}`);
      }
    }
  }
}

processDirectory(path.join(process.cwd(), 'src'));
