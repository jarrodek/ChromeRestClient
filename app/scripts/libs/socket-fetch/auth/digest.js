/**
 * NTLM authorization method.
 */
export class DigestAuth {
  constructor(opts) {
    // Login to authorize with
    this.uid = opts.uid || opts.username || undefined;
    // Password to authorize with
    this.passwd = opts.passwd || opts.password || undefined;
    this.method = 'digest';
    this.url = opts.url;
    this.httpMethod = opts.httpMethod;
    this.scheme = opts.scheme;
    this.nonce = opts.nonce;
    this.realm = opts.realm;
    this.qop = opts.qop;
    this.opaque = opts.opaque;
    this.nc = opts.nc || 1;
    this.cnonce = opts.cnonce;
  }

  generateCnonce() {
    const characters = 'abcdef0123456789';
    let token = '';
    for (let i = 0; i < 16; i++) {
      let randNum = Math.round(Math.random() * characters.length);
      token += characters.substr(randNum, 1);
    }
    this.cnonce = token;
  }

  getAuthHeader() {
    if (!this.uid || !this.passwd || !this.realm || !this.httpMethod || !this.url ||
      !this.nonce) {
      return null;
    }
    const response = this.formulateResponse();
    let h = '';
    h += this.scheme + ' ';
    h += 'username="' + this.uid + '", ';
    h += 'realm="' + this.realm + '", ';
    h += 'nonce="' + this.nonce + '", ';
    h += 'uri="' + this.url + '", ';
    h += 'response="' + response + '", ';
    h += 'opaque="' + this.opaque + '", ';
    h += 'qop=' + this.qop + ', ';
    h += 'nc=' + ('00000000' + this.nc).slice(-8) + ', ';
    h += 'cnonce="' + this.cnonce + '"';
    return h;
  }

  formulateResponse() {
    /* global CryptoJS */
    const HA1 = CryptoJS.MD5(this.uid + ':' + this.realm + ':' + this.passwd).toString();
    const HA2 = CryptoJS.MD5(this.httpMethod + ':' + this.url).toString();
    let response = CryptoJS.MD5(HA1 + ':' +
        this.nonce + ':' +
        ('00000000' + this.nc).slice(-8) + ':' +
        this.cnonce + ':' +
        this.qop + ':' + HA2).toString();
    return response;
  }
}
