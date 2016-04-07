'use strict';
const fs = require('fs');
const http = require('http');
const https = require('https');
const basicAuth = require('basic-auth');
const app = require('express')();
const bodyParser = require('body-parser');
const multer = require('multer'); // v1.0.5
const upload = multer(); // for parsing multipart/form-data

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
//app.use(bodyParser.raw());

class TestServer {
  constructor() {
    this.credentials = {
      key: fs.readFileSync('./tests/certs/server.key', 'utf8'),
      cert: fs.readFileSync('./tests/certs/server.crt', 'utf8')
    };
    app.disable('x-powered-by');
    // app.disable('etag');
    this.setHandlers();
    this.createServer();
  }

  basicAuth(req, res, next) {
    var user = basicAuth(req);
    if (!user || !user.name || !user.pass) {
      return this.unauthorized(res);
    }
    if (user.name === 'test' && user.pass === 'test') {
      return next();
    } else {
      return this.unauthorized(res);
    }
  }

  /**
   * To be called when the user is not basic authenticated.
   */
  unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required (test:test)');
    return res.sendStatus(401);
  }

  createServer() {
    var httpServer = http.createServer(app);
    var httpsServer = https.createServer(this.credentials, app);
    // httpServer.listen(80, () => {
    //   console.log('HTTP started (80).');
    // });
    httpServer.listen(8080, () => {
      console.log('HTTP started (8080).');
    });
    // httpsServer.listen(443, () => {
    //   console.log('HTTPS started (443).');
    // });
    httpsServer.listen(3000, () => {
      console.log('HTTPS started (3000).');
    });
  }

  setHandlers() {
    this._setMain();
    this._setBasicAuth();
    this._setMeta();
    this._setJson();
    this._setXML();
    this._setCookie();
    this._setPost();
    this._setPut();
    this._setDelete();
  }

  _setMain() {
    app.get('/', (req, res) => {
      // res.removeHeader('Date');
      // res.removeHeader('Connection');
      // res.removeHeader('Content-Length');
      // res.removeHeader('Transfer-Encoding');
      // res.end();
      res.set('Content-Type', 'text/html');
      res.send('<h1>Hello World!</h1>');
    });
  }

  _setBasicAuth() {
    app.get('/auth', this.basicAuth.bind(this), (req, res) => {
      res.set('Content-Type', 'text/html');
      res.send('<h1>You are authenticated</h1>');
    });
  }

  _setMeta() {
    app.get('/meta', (req, res) => {
      // res.status(200).send('OK');
      res.set('Content-Type', 'text/html');
      res.set('Link', '</.meta>; rel=meta');
      res.send('<h1>You should see  </.meta>; rel=meta in the Link header  </h1>');
    });
  }

  _setJson() {
    app.get('/json', (req, res) => {
      var json = fs.readFileSync('./tasks/test-data/json1.json', 'utf8');
      // res.status(200).send('OK');
      res.set('Content-Type', 'application/json');
      res.send(json);
    });
  }

  _setXML() {
    app.get('/xml', (req, res) => {
      var json = fs.readFileSync('./tasks/test-data/xml1.xml', 'utf8');
      // res.status(200).send('OK');
      res.set('Content-Type', 'application/xml');
      res.send(json);
    });
    app.get('/xml2', (req, res) => {
      var json = fs.readFileSync('./tasks/test-data/xml2.xml', 'utf8');
      // res.status(200).send('OK');
      res.set('Content-Type', 'application/xml');
      res.send(json);
    });
    app.get('/xml3', (req, res) => {
      var json = fs.readFileSync('./tasks/test-data/xml3.xml', 'utf8');
      // res.status(200).send('OK');
      res.set('Content-Type', 'application/xml');
      res.send(json);
    });
  }

  _setCookie() {
    app.get('/cookie', (req, res) => {
      var Chance = require('chance');
      var chance = new Chance();
      for (var i = 0; i < 10; i++) {
        var value = chance.string({length: chance.integer({min: 10, max: 100})});
        var opts = {};
        if (chance.bool()) {
          opts.expires = 0;
        }
        if (chance.bool()) {
          opts.httpOnly = true;
        }
        if (chance.bool()) {
          opts.domain = chance.domain();
        }
        res.cookie(chance.word(), value, opts);
      }
      res.set('Content-Type', 'text/html');
      res.send('<h1>Cookies are set</h1>');
    });
  }

  _setPost() {
    app.post('/', upload.array(), (req, res) => {
      var response = Object.assign({}, {
        'body': req.body,
        'query': req.query
      });
      // console.log(req.body, req.query);
      // console.log(req.headers);
      // console.log(req);
      res.set('Content-Type', 'application/json');
      res.send(response);
    });
  }

  _setPut() {
    app.put('/', (req, res) => {
      res.send('PUT request to homepage');
    });
  }

  _setDelete() {
    app.delete('/', (req, res) => {
      res.send('DELETE request to homepage');
    });
  }
}

module.exports = {
  create: () => {
    new TestServer();
  }
};
