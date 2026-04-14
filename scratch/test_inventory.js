const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/inventory',
  method: 'GET',
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  let data = '';
  res.on('data', (d) => { data += d });
  res.on('end', () => console.log('Response truncated to 500 chars:', data.slice(0, 500)));
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});
req.end();
