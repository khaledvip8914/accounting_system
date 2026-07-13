const { Client } = require('pg');

async function checkDB() {
  const credentials = {
    user: 'accounting_user',
    host: 'localhost',
    database: 'postgres', // Connect to default DB
    password: 'MyStrongPassword123',
    port: 5432,
  };

  const client = new Client(credentials);

  try {
    console.log('Attempting to connect to postgres database...');
    await client.connect();
    console.log('Connected to postgres database!');
    
    const res = await client.query("SELECT datname FROM pg_database WHERE datname = 'accounting_db'");
    if (res.rows.length > 0) {
      console.log('Database "accounting_db" exists.');
    } else {
      console.log('Database "accounting_db" DOES NOT EXIST.');
    }
    
    await client.end();
  } catch (err) {
    console.error('Connection Failed:', err.message);
  }
}

checkDB();
