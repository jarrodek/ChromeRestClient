'use strict';

const google = require('googleapis');
const fs = require('fs');
const https = require('https');

var CwsUploader = {

  clientConfigFile: '/home/jarrod/Documents/CWS-Builder-ServiceAccount/' +
    'chromerestclient-5d1a9822cb24.json',
  _key: null,
  clientEmail: null,
  scopes: ['https://www.googleapis.com/auth/chromewebstore'],
  token: null,

  _getConfig: () => {
    return new Promise((resolve, reject) => {
      fs.readFile(CwsUploader.clientConfigFile, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        data = JSON.parse(data);
        resolve(data);
      });
    });
  },

  auth: () => {
    return CwsUploader._getConfig()
      .then((config) => CwsUploader._setup(config))
      .then(() => CwsUploader._authorize())
      .then((tokens) => {
        CwsUploader.token = tokens.access_token;
      });
  },

  _setup: (config) => {
    // console.log(config);
    CwsUploader._key = config.private_key;
    CwsUploader.clientEmail = config.client_email;
    CwsUploader.apiKey = config.api_key;
    CwsUploader.authClient = new google.auth.JWT(
      CwsUploader.clientEmail,
      null,
      CwsUploader._key,
      CwsUploader.scopes,
      'jarrodek@gmail.com'); //
  },

  _authorize: function() {
    return new Promise((resolve, reject) => {
      CwsUploader.authClient.authorize(function(err, tokens) {
        // console.log(err, tokens);
        if (err) {
          reject(err);
          return;
        }
        resolve(tokens);
      });
    });
  },

  uploadItem: function(file, target) {
    var config = fs.readFileSync('./tasks/cws-config.json', 'utf-8');
    config = JSON.parse(config);
    if (target in config) {
      let id = config[target].id;
      let buffer = fs.readFileSync(file);
      return CwsUploader._uploadItem(buffer, id);
    } else {
      return Promise.reject(new Error(`${target} is invalid target.`));
    }
  },

  _uploadItem: (buffer, id) => {
    return new Promise((resolve, reject) => {
      let options = {
        host: 'www.googleapis.com',
        path: `/upload/chromewebstore/v1.1/items/${id}?key=${CwsUploader.apiKey}`,
        port: '443',
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + CwsUploader.token,
          'Content-Type': 'application/zip',
          'Accept': '*/*',
          'Content-Length': buffer.length + '',
          'x-goog-api-version': '2'
        }
      };
      let req = https.request(options, (response) => {
        let str = '';
        response.on('data', function(chunk) {
          str += chunk;
        });

        response.on('end', function() {
          console.log(str);
          resolve(str);
        });
      });
      req.write(buffer);
      req.end();
      req.on('error', (e) => {
        console.error(e);
        reject(e);
      });
    });
  }
};
module.exports = CwsUploader;
