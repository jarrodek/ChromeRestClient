'use strict';
const fs = require('fs');
const http = require('http');
const https = require('https');
const app = require('express')();

class TestServer {
  constructor() {
    this.credentials = {
      key: fs.readFileSync('./tests/certs/server.key', 'utf8'),
      cert: fs.readFileSync('./tests/certs/server.crt', 'utf8')
    };

    this.setHandlers();
    this.createServer();
  }

  createServer() {
    var httpServer = http.createServer(app);
    var httpsServer = https.createServer(this.credentials, app);
    httpServer.listen(80, () => {
      console.log('HTTP started.');
    });
    httpsServer.listen(443, () => {
      console.log('HTTPS started.');
    });
  }

  setHandlers() {
    this._setMain();
  }

  _setMain() {
    app.get('/', (req, res) => {
      res.send('Hello World!');
    });
  }
}

module.exports = {
  create: () => {
    new TestServer();
  }
};
