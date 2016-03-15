'use strict';

var authClient = require('./auth-client.js');
const fs = require('fs');
const https = require('https');

var CwsUploader = {
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
    return authClient
      .execute(CwsUploader.scopes)
      .then((ok) => {
        if (!ok) {
          throw new Error('User not authenticated');
        }
        CwsUploader.token = authClient.oAuth2Client.credentials.access_token;
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
        path: `/upload/chromewebstore/v1.1/items/${id}`, //?key=${CwsUploader.apiKey}
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
          console.log('CWS response', str);
          resolve(str);
        });
      });
      req.write(buffer);
      req.end();
      req.on('error', (e) => {
        console.error('CWS request error', e);
        reject(e);
      });
    });
  }
};
module.exports = CwsUploader;
