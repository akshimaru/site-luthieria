const http = require('http');

const options = {
  host: 'localhost',
  port: process.env.PORT || 3000,
  path: '/',
  timeout: 2000
};

const request = http.request(options, (res) => {
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    console.log(`Health check failed: HTTP ${res.statusCode}`);
    process.exit(1);
  }
});

request.on('error', (err) => {
  console.log(`Health check failed: ${err.message}`);
  process.exit(1);
});

request.on('timeout', () => {
  console.log('Health check failed: timeout');
  request.destroy();
  process.exit(1);
});

request.end();
