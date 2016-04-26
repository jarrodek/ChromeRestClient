'use strict';
const fs = require('fs');
const http = require('http');
const https = require('https');
const basicAuth = require('basic-auth');
const app = require('express')();
const bodyParser = require('body-parser');
const multer = require('multer'); // v1.0.5
const upload = multer(); // for parsing multipart/form-data
// const coBusboy = require('co-busboy');
// var Busboy = require('busboy');
const cookieParser = require('cookie-parser');
const busboy = require('connect-busboy');

app.use(cookieParser());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
  extended: true
})); // for parsing application/x-www-form-urlencoded
app.use(busboy());
app.use(function(req, res, next) {
  if (!req.is('multipart/*') || !req.busboy) {
    next();
    return;
  }
  req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding +
    ', mimetype: ' + mimetype);
    file.on('data', function(data) {
      console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
    });
    file.on('end', function() {
      console.log('File [' + fieldname + '] Finished');
    });
  });
  req.busboy.on('field', function(fieldname, val
  /*, fieldnameTruncated, valTruncated, encoding, mimetype*/) {
    console.log('Field [' + fieldname + ']: value: ' + val);
  });
  req.busboy.on('finish', function() {
    next();
  });
  req.pipe(req.busboy);
});
// app.use(function* (next) {
//   console.log('Next function called');
//   if (!this.request.is('multipart/*')) {
//     return yield next;
//   }
//   console.log('Processing multipart request');
//   var parts = coBusboy(this);
//   var part
//   while (part = yield parts) {
//     if (part.length) {
//       // arrays are busboy fields
//       console.log('key: ' + part[0]);
//       console.log('value: ' + part[1]);
//     } else {
//       // otherwise, it's a stream
//       console.log('It\'s a stream');
//       //part.pipe(fs.createWriteStream('some file.txt'))
//     }
//   }
//   console.log('and we are done parsing the form!');
// });

class TestServer {
  constructor() {
    this.credentials = {
      key: fs.readFileSync('./tests/certs/server1.key', 'utf8'),
      cert: fs.readFileSync('./tests/certs/server1.crt', 'utf8')
    };
    this.post = 8081;
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
    httpServer.listen(this.post, () => {
      console.log('HTTP started (' + this.post + ').');
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
    this._setMultipard();
    this._setRedirect();
    this._setErrors();
    this._setEmptyResponses();
  }

  _setMain() {
    app.get('/', (req, res) => {
      // res.removeHeader('Date');
      // res.removeHeader('Connection');
      // res.removeHeader('Content-Length');
      // res.removeHeader('Transfer-Encoding');
      // res.end();
      res.set('Content-Type', 'text/html');
      if (req.secure) {
        res.send('<h1>SSL connection made</h1>');
      } else {
        res.send('<h1>Non SSL connection made</h1>');
      }
    });

    app.delete('/', (req, res) => {
      res.sendStatus(204);
    });

    app.get('/no-response', (req, res) => {
      // res.sendStatus(204);
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
    app.get('/json/2', (req, res) => {
      var json = fs.readFileSync('./tasks/test-data/json2.json', 'utf8');
      // res.status(200).send('OK');
      res.set('Content-Type', 'application/json');
      res.send(json);
    });
    app.get('/json/error', (req, res) => {
      var json = fs.readFileSync('./tasks/test-data/json1.json', 'utf8');
      res.set('Content-Type', 'application/json');
      json = '[Eroor]: An error occured' + json;
      res.send(json);
    });
    app.get('/json/html', (req, res) => {
      var json = fs.readFileSync('./tasks/test-data/json1.json', 'utf8');
      res.set('Content-Type', 'text/html');
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
    //set random cookies
    app.get('/cookies/random', (req, res) => {
      var Chance = require('chance');
      var chance = new Chance();
      for (var i = 0; i < 10; i++) {
        var value = chance.string({
          length: chance.integer({
            min: 10,
            max: 100
          })
        });
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
      res.cookie('rememberme', '1', {
        maxAge: 900000,
        httpOnly: true,
        domain: 'localhost',
        path: '/cookie',
        secure: true
      });
      res.set('Content-Type', 'text/html');
      res.send('<h1>Cookies are set</h1>');
    });
    //set cookies getting param keys as cookie name and param value as cookie value.
    app.get('/cookies/set', (req, res) => {
      let params = req.query;
      console.log('Dumping params');
      console.log(params);
      for (let key in params) {
        res.cookie(key, params[key], {
          path: '/'
        });
      }
      res.redirect('/cookies');
    });
    //list cookies
    app.get('/cookies', function(req, res) {
      let resp = {
        cookies: req.cookies
      };
      res.set('Content-Type', 'application/json');
      res.send(resp);
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

  _setMultipard() {
    app.post('/post', (req, res) => {
      console.log('Calling /post');
      console.log(req.body, req.query);
      res.set('Connection', 'close');
      res.set('Content-Type', 'text/html');
      res.send('Post with success');
      // var busboy = new Busboy({
      //   headers: req.headers
      // });
      // busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      //   console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' +
      //   encoding + ', mimetype: ' + mimetype);
      //   file.on('data', function(data) {
      //     console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
      //   });
      //   file.on('end', function() {
      //     console.log('File [' + fieldname + '] Finished');
      //   });
      // });
      // busboy.on('field', function(fieldname, val, fieldnameTruncated,
      //  valTruncated, encoding, mimetype) {
      //   console.log('Field [' + fieldname + ']: value: ' + inspect(val));
      // });
      // busboy.on('finish', function() {
      //   console.log('Done parsing form!');
      //   res.writeHead(303, {
      //     Connection: 'close',
      //     Location: '/'
      //   });
      //   res.end();
      // });
      // req.pipe(busboy);

      // console.log(req.headers);
      // console.log(req);
      // res.set('Content-Type', 'application/json');
      // res.send(response);
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

  _setRedirect() {
    app.get('/fake-redirect', (req, res) => {
      res.status(200);
      res.set('Location', 'http://localhost:' + this.post + '/redirect/dest');
      res.set('Content-Type', 'application/json');
      res.set('Content-Length', 0);
      res.end();
      // res.redirect('/relative-redirect/step-1');
    });
    app.get('/relative-redirect', (req, res) => {
      res.redirect('/relative-redirect/step-1');
    });
    app.get('/relative-redirect/step-1', (req, res) => {
      res.redirect('/relative-redirect/step-2');
    });
    app.get('/relative-redirect/step-2', (req, res) => {
      res.redirect('/redirect/dest');
    });
    app.get('/redirect', (req, res) => {
      res.redirect('http://localhost:' + this.post + '/redirect/dest');
    });
    app.get('/redirect/dest', (req, res) => {
      res.set('Content-Type', 'text/html');
      res.send('<h1>You have been redirected</h1>');
    });
  }

  _setErrors() {
    app.get('/not-found', (req, res) => {
      res.status(404).end();
    });
    app.get('/status-error', (req, res) => {
      res.status(604).end();
    });
  }

  _setEmptyResponses() {
    app.all('/empty', (req, res) => {
      var defaultStatus = 200;
      var status = req.params.status;
      if (status) {
        status = Number(status);
        if (status !== status) {
          status = defaultStatus;
        }
      } else {
        status = defaultStatus;
      }
      res.removeHeader('Date');
      res.removeHeader('Connection');
      res.removeHeader('Content-Length');
      res.removeHeader('Transfer-Encoding');
      res.status(status).end();
    });
  }
}

module.exports = {
  create: () => {
    new TestServer();
  }
};
