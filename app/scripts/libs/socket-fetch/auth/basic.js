/**
 * NTLM authorization method.
 */
export class BasicAuth {
  constructor(opts) {
    this.uid = opts.username;
    this.passwd = opts.password;
  }

  getHash() {
    const str = `${this.uid}:${this.passwd}`;
    return btoa(str);
  }
}
