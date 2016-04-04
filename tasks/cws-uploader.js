'use strict';

var authClient = require('./auth-client.js');
const fs = require('fs');
const https = require('https');

var CwsUploader = {
  scopes: ['https://www.googleapis.com/auth/chromewebstore'],
  _config: null,
  token: null,
  get config() {
    if (!CwsUploader._config) {
      CwsUploader._config = JSON.parse(fs.readFileSync('./tasks/cws-config.json', 'utf-8'));
    }
    return CwsUploader._config;
  },

  auth: () => {
    if (CwsUploader.token) {
      return Promise.resolve(CwsUploader.token);
    }
    return authClient
      .execute(CwsUploader.scopes)
      .then((ok) => {
        if (!ok) {
          throw new Error('User not authenticated');
        }
        //jscs:disable requireCamelCaseOrUpperCaseIdentifiers
        CwsUploader.token = authClient.oAuth2Client.credentials.access_token;
        //jscs:enable requireCamelCaseOrUpperCaseIdentifiers
      });
  },
  /**
   * Upload (update) an item to Chrome Web Store.
   * Call `CwsUploader.auth()` before calling this function.
   *
   * @param {String} file Path of the file to upload
   * @param {String} target Build target (canary, dev, beta, stable)
   */
  uploadItem: function(file, target) {
    var config = CwsUploader.config;
    if (target in config) {
      let id = config[target].id;
      let buffer = fs.readFileSync(file);
      return CwsUploader._uploadItem(buffer, id)
      .then((result) => {
        result = JSON.parse(result);
        if (result.uploadState === 'SUCCESS') {
          console.log('The item has been uploaded.');
        } else {
          throw new Error('Error uploading item to Chrome Web Store. ' + JSON.stringify(result));
        }
      });
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
          // console.log('CWS response', str);
          resolve(str);
        });
      });
      req.write(buffer);
      req.end();
      req.on('error', (e) => {
        console.error('CWS upload request error', e);
        reject(e);
      });
    });
  },
  /**
   * Publish a not published item in the CWS.
   */
  publishTarget: (target, audience) => {
    var config = CwsUploader.config;
    if (target in config) {
      let id = config[target].id;
      let publishTo;
      if (audience) {
        switch (audience) {
          case 'all': publishTo = 'default'; break;
          case 'testers': publishTo = 'trustedTesters'; break;
        }
      } else {
        publishTo = config[target].publishTo;
      }
      if (!publishTo) {
        return Promise.reject(new Error(`Audience "${publishTo}" is invalid.`));
      }
      return CwsUploader.auth().then(() => CwsUploader._publishItem(id, publishTo));
    } else {
      return Promise.reject(new Error(`${target} is invalid target.`));
    }
  },
  /**
   * Publish an item in Chrome Web Store.
   * Call `CwsUploader.auth()` before calling this function.
   *
   * @param {String} id Chrome Web Store item ID
   * @param {String?} audience Target audience to publish to. Possible values are 'default'
   * or 'trustedTesters'. Default to 'default'.
   */
  _publishItem: (id, audience) => {
    if (!audience) {
      return Promise.reject(new Error('The audience parameter is required.'));
    }
    if (['default', 'trustedTesters'].indexOf(audience) === -1) {
      return Promise.reject(new Error(`The "${audience}" is not valid value for the audience.`));
    }
    console.log('Publishing an item: %s for audience: %s', id, audience);
    return new Promise((resolve, reject) => {
      let options = {
        host: 'www.googleapis.com',
        path: `/chromewebstore/v1.1/items/${id}/publish?publishTarget=${audience}`,
        port: '443',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + CwsUploader.token,
          'Accept': '*/*',
          'x-goog-api-version': '2'
        }
      };
      let req = https.request(options, (response) => {
        let str = '';
        response.on('data', function(chunk) {
          str += chunk;
        });
        response.on('end', function() {
          str = JSON.parse(str);
          if (str.error) {
            let message;
            if (str.error.code) {
              message = 'Server error: ' + str.error.code + ' - ' + str.error.message;
            } else if (str.error.errors) {
              message = str.error.errors[0].message;
            } else {
              message = 'Unknown error ocurred.';
            }
            console.error(message);
            reject(message);
            return;
          }
          console.log('The item is now published.');
          resolve(str);
        });
      });
      req.end();
      req.on('error', (e) => {
        console.error('CWS publish request error', e);
        reject(e);
      });
    });
  }
};
module.exports = CwsUploader;
