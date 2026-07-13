const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    }
    process.env[key] = value;
  }
});

console.log('Loaded DATABASE_URL:', process.env.DATABASE_URL);

const { PrismaClient } = require('../src/generated/client_v8');
const prisma = new PrismaClient();

async function test() {
  try {
    console.log('Testing connection...');
    await prisma.$connect();
    console.log('SUCCESS!');
    process.exit(0);
  } catch (err) {
    console.error('FAILED:', err.message);
    process.exit(1);
  }
}

test();
