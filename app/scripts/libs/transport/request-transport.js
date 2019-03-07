import {ChromeProxyTransport} from './proxy-transport.js';
import {SocketTransport} from './socket-transport.js';
export class ArcChromeTransport {
  constructor() {
    // Host data handlers
    this._ruleUpdated = this._ruleUpdated.bind(this);
    this._ruleDeleted = this._ruleDeleted.bind(this);
    // Transport control
    this._transportHandler = this._transportHandler.bind(this);
    this._abortHandler = this._abortHandler.bind(this);
    // Local properties
    this._connections = {};
  }

  observe() {
    window.addEventListener('transport-request', this._transportHandler);
    window.addEventListener('abort-api-request', this._abortHandler);
    window.addEventListener('host-rules-changed', this._ruleUpdated);
    window.addEventListener('host-rules-deleted', this._ruleDeleted);
  }

  _transportHandler(e) {
    let appConfig;
    return this._readConfig()
    .then((cnf) => {
      appConfig = cnf;
      if (!window.ARC_USE_PROXY) {
        return this._readHosts();
      }
    })
    .then((hosts) => {
      if (window.ARC_USE_PROXY) {
        this.proxyRequest(e.detail, appConfig);
      } else {
        this.socketRequest(e.detail, appConfig, hosts);
      }
    });
  }

  proxyRequest(request, appConfig) {
    const runner = new ChromeProxyTransport(request);
    this._connections[request.id] = runner;
    runner.run(appConfig);
  }

  socketRequest(request, appConfig, hosts) {
    const runner = new SocketTransport(request);
    this._connections[request.id] = runner;
    runner.run(appConfig, hosts);
  }

  /**
   * Reads application hosts configuration and returns it.
   * It returns empty array of hosts couldn't be read.
   * @return {Promise<Array>}
   */
  _readHosts() {
    if (this.hosts !== undefined) {
      return Promise.resolve(this.hosts);
    }
    const e = new CustomEvent('host-rules-list', {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {}
    });
    document.body.dispatchEvent(e);
    if (!e.defaultPrevented) {
      this.hosts = [];
      return Promise.resolve(this.hosts);
    }
    return e.detail.result
    .then((rules) => {
      this.hosts = rules || [];
      return rules;
    });
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

  /**
   * Updates a rule from the `host-rules-changed` custom event.
   * The event should contain `rule` property on the event's detail object
   * containing the rule object.
   * @param {CustomEvent} e
   */
  _ruleUpdated(e) {
    if (e.cancelable || !this.hosts) {
      // Don't update rules if there's no local hosts array. Let the component
      // ask for all rules first.
      return;
    }
    const updatedValue = e.detail.rule;
    const index = this.hosts.findIndex((item) => item._id === updatedValue._id);
    if (index === -1) {
      this.hosts.push(updatedValue);
    } else {
      this.hosts[index] = updatedValue;
    }
  }
  /**
   * Deletes the rule from the `host-rules-deleted` custom event.
   * The event should contain `rule` property on the event's detail object
   * containing the rule object.
   *
   * @param {CustomEvent} e
   */
  _ruleDeleted(e) {
    if (e.cancelable) {
      return;
    }
    if (!this.hosts || !this.hosts.length) {
      return;
    }
    const id = e.detail.id;
    const index = this.hosts.findIndex((item) => item._id === id);
    if (index === -1) {
      return;
    }
    this.hosts.splice(index, 1);
  }
}
