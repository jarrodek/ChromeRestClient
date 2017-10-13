const net = require('net');
const server = net.createServer((c) => {
  // 'connection' listener
  console.log('client connected');

  c.on('data', (data) => {
    console.log('Buffer length: ', data.length);
    console.log(data.toString('utf8'));
  });

  c.on('end', () => {
    console.log('client disconnected');
  });
  c.write('hello\r\n');
  c.pipe(c);
});
server.on('error', (err) => {
  throw err;
});
server.listen(8080, () => {
  console.log('server bound');
});
