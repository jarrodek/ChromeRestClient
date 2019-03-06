import {ChromeProxyTransport} from './proxy-transport.js';
export class ArcChromeTransport {
  constructor() {
    this._transportHandler = this._transportHandler.bind(this);
    this._abortHandler = this._abortHandler.bind(this);
    this._connections = {};
  }

  observe() {
    window.addEventListener('transport-request', this._transportHandler);
    window.addEventListener('abort-api-request', this._abortHandler);
  }

  _transportHandler(e) {
    return this._readConfig()
    .then((cnf) => {
      if (window.ARC_USE_PROXY) {
        this.proxyRequest(e.detail, cnf);
      } else {
        this.socketRequest(e.detail, cnf);
      }
    });
  }

  proxyRequest(request, appConfig) {
    const runner = new ChromeProxyTransport(request);
    this._connections[request.id] = runner;
    runner.run(appConfig);
  }

  socketRequest(request, appConfig) {

  }

  onProxyMessage(e) {
    console.log(e);
  }

  _abortHandler(e) {
    const id = e.detail.id;
    const info = this._connections[id];
    if (!info) {
      return;
    }
    e.preventDefault();
    info.connection.abort();
    info.aborted = true;
  }

  _readConfig() {
    const e = new CustomEvent('settings-read', {
      bubbles: true,
      detail: {}
    });
    document.body.dispatchEvent(e);
    return e.detail.result;
  }
}
