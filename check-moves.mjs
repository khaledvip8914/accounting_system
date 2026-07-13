import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PrismaClient } = require('./src/generated/client_v8/index.js');

const p = new PrismaClient();
const moves = await p.employeeFinancialMove.findMany({
  orderBy: { createdAt: 'desc' },
  take: 10,
  select: { id: true, type: true, amount: true, status: true, createdAt: true, companyId: true }
});
console.log('Total moves:', moves.length);
console.log(JSON.stringify(moves, null, 2));
await p.$disconnect();
