const http = require('http');

const loginData = JSON.stringify({
  username: 'master',
  password: 'admin'
});

const loginOptions = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

const req1 = http.request(loginOptions, (res1) => {
  let cookies = res1.headers['set-cookie'];
  if (!cookies) return console.log('No cookies, login failed. Status:', res1.statusCode);

  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

  const invOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/inventory',
    method: 'GET',
    headers: {
      'Cookie': cookieHeader
    }
  };

  const req2 = http.request(invOptions, (res2) => {
    let data = '';
    res2.on('data', d => data += d);
    res2.on('end', () => console.log('Inventory Status:', res2.statusCode));
  });
  req2.end();
});

req1.on('error', e => console.error(e));
req1.write(loginData);
req1.end();
