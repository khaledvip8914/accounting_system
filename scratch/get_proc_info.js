const { execSync } = require('child_process');

try {
  const output = execSync('wmic process where processid=20976 get commandline').toString();
  console.log('Process Info:', output);
} catch (err) {
  console.error('Error:', err.message);
}
