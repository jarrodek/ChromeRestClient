export class ChromeProxyTransport {
  constructor(request) {
    this.aborted = false;
    this.connected = false;
    this.request = request;
    this.requestId = request.id;
  }

  run(appConfig) {
    const opts = this._prepareRequestOptions(this.request, appConfig);
    return this._prepareRequest(this.request, opts);
  }

  _prepareRequestOptions(request, opts) {
    const rConfig = Object.assign({}, request.config || {});
    opts = Object.assign({}, opts || {});
    opts = Object.assign(rConfig, opts);
    if (opts.timeout) {
      if (opts.timeout < 120) {
        opts.timeout = opts.timeout * 1000;
      }
    } else {
      opts.timeout = 0;
    }
    return opts;
  }
}
