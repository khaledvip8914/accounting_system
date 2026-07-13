const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
const db = new sqlite3.Database(dbPath);

db.get("SELECT count(*) as count FROM Account", (err, row) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Accounts in SQLite:', row.count);
  }
  db.close();
});
