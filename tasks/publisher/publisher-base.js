const fs = require('fs-extra');
const cws = require('chrome-webstore-upload');

class PublisherBase {
  constructor(opts) {
    if (!opts.id) {
      throw new Error('Application CWS id not set.');
    }
    if (!opts.audience) {
      throw new Error('Target audience not set.');
    }
    this.appId = opts.id;
    this.audience = opts.audience;
    this.auth = {
      cid: process.env.CWS_CLIENT_ID,
      cs: process.env.CWS_CLIENT_SECRET,
      rt: process.env.CWS_REFRESH_TOKEN
    };
    if (!this.auth.cid) {
      throw new Error('CWS_CLIENT_ID is not set.');
    }
    if (!this.auth.cs) {
      throw new Error('CWS_CLIENT_SECRET is not set.');
    }
    if (!this.auth.rt) {
      throw new Error('CWS_REFRESH_TOKEN is not set.');
    }
  }

  get cwsClient() {
    if (!this.__cwsClient) {
      this.__cwsClient = cws({
        extensionId: this.appId,
        clientId: this.auth.cid,
        clientSecret: this.auth.cs,
        refreshToken: this.auth.rt
      });
    }
    return this.__cwsClient;
  }

  publish(bundleFile) {
    console.log('Authenticating...');
    return this.cwsClient.fetchToken()
    .then((at) => {
      this.auth.token = at;
      console.log('Ready. Uploading app to CWS.');
      return fs.readFile(bundleFile);
    })
    .then((buffer) => this.cwsClient.uploadExisting(buffer, this.auth.token))
    .then(() => {
      console.log('Application uploaded. Publishing to the audience.');
      return this.cwsClient.publish(this.audience, this.auth.token);
    });
  }
}

module.exports.PublisherBase = PublisherBase;
