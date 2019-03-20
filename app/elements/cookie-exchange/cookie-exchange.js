/* global ArcBehaviors */
class CookieExchange extends ArcBehaviors.HeadersParserBehavior(Polymer.Element) {
  static get template() {
    return Polymer.html`<style>:host {display: none;}</style>
    <chrome-connect id="sync"
      extension-id="[[externalId]]"
      connected="{{connected}}"
      on-message="_processMessage"></chrome-connect>`;
  }
  static get properties() {
    return {
      // An id of the extension to connect to.
      externalId: String,
      // True if the app is connected to the external extension.
      connected: {type: Boolean, observer: '_setCookieCache'},
      /**
       * Map of cookies received from the Cookie exchange extension.
       */
      cookies: Object
    };
  }

  constructor() {
    super();
    this._handleRequest = this._handleRequest.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('before-request', this._handleRequest);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('before-request', this._handleRequest);
  }

  // When connected, refresh cookie cache.
  _setCookieCache(connected) {
    if (!connected) {
      this.cookies = undefined;
      return;
    }
    this.$.sync.postMessage({
      payload: 'get-cookies'
    });
  }
  // Process a message returned by the port.
  _processMessage(e) {
    const {payload} = e.detail;
    if (!payload) {
      return;
    }
    switch (payload) {
      case 'cookie-changed':
        this.$.sync.postMessage({
          payload: 'get-cookies'
        });
        break;
      case 'get-cookies':
        this.cookies = e.detail.cookies;
        break;
    }
  }
  // The `before-request` handler. Calls the `applyCookies` on `detail` object.
  _handleRequest(e) {
    this.applyCookies(e.detail);
  }
  /**
   * Applies cached cookies to the request object.
   * @param {Object} request A request object.
   * @return {Object} The same request object with cookies applied to it.
   */
  applyCookies(request) {
    if (!this.cookies) {
      return request;
    }
    const host = this._computeHost(request.url);
    if (!host) {
      return request;
    }
    const str = this._buildCookieString(this.cookies, host);
    if (!str) {
      return request;
    }
    const headers = this.headersToJSON(request.headers);
    const index = headers.findIndex((header) => header.name.toLowerCase() === 'cookie');
    if (index === -1) {
      headers.push({
        name: 'cookie',
        value: str
      });
    } else {
      headers[index].value = headers[index].value + '; ' + str;
    }
    request.headers = this.headersToString(headers);
    return request;
  }
  /**
   * Computes a host name from the URL.
   * @param {String} url A URL of a resource.
   * @return {String|undefined} A host name (lowercase) or undefined if the URL is
   * empty, invalid or without host information.
   */
  _computeHost(url) {
    if (!url) {
      return;
    }
    let u;
    try {
      u = new URL(url);
    } catch (e) {
      return;
    }
    const host = u.hostname;
    if (!host) {
      return;
    }
    return host.toLowerCase();
  }
  /**
   * Builds a `cookie` header string to be send with the request.
   * @param {Object} cookies Map of cookies returned by the extension. Keys are
   * domain names for the cookies. Value is an array of cookies.
   * @param {String} host Request host name
   * @return {String} A cookie header string. Empty string if there's no
   * matching cookies information for the host.
   */
  _buildCookieString(cookies, host) {
    let str = '';
    if (!cookies || !Object.keys(cookies).length || !host) {
      return str;
    }
    const cookieFn = (cookie) => {
      if (str) {
        str += '; ';
      }
      str += cookie.name + '=' + cookie.value;
    };
    for (let domain in cookies) {
      if (domain.toLowerCase().indexOf(host) !== -1) {
        cookies[domain].forEach(cookieFn);
        break;
      }
    }
    return str;
  }
}
window.customElements.define('cookie-exchange', CookieExchange);
