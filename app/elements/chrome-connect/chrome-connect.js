/**
 * `chrome-connect
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class ChromeConnect extends Polymer.Element {
  static get is() {
    return 'chrome-connect';
  }
  static get properties() {
    return {
      // An ID of the extension to connect to.
      extensionId: {type: String, observer: 'connect'},
      /**
       * True if the app is connected to the external extension.
       * Connection is tested asynchrously so this property changes with a delay.
       */
      connected: {
        type: Boolean,
        value: false,
        notify: true
      },
      /**
       * Opened port to another extension.
       */
      port: {
        type: Object,
        readOnly: true
      },
      /**
       * The latest message received from the external extension / app.
       */
      lastMessage: {
        type: Object,
        notify: true,
        readOnly: true
      },
      // External message handler function.
      _messageListener: Object,
      /**
       * List of allowed clients to connect to this application / extension.
       * It must be an array of client IDs (extensions IDs).
       */
      allowedClients: Array
    };
  }

  constructor() {
    super();
    this._messageListener = this._processMessage.bind(this);
    this._extListener = this._processExternalMessage.bind(this);
    this._disconnectListener = this._disconnectedHandler.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    chrome.runtime.onMessageExternal.addListener(this._extListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    chrome.runtime.onMessageExternal.removeListener(this._extListener);
  }

  // Attempt to connect to external extension.
  connect(extensionId) {
    if (!extensionId) {
      return;
    }
    const port = chrome.runtime.connect(extensionId);
    this._setPort(port);
    this._connectionTest = true;
    port.onDisconnect.addListener(this._disconnectListener);
    port.onMessage.addListener(this._messageListener);
    setTimeout(() => {
      // If connected the extension is installed.
      if (this._connectionTest) {
        this.set('connected', true);
      }
    }, 50);
  }
  // Handler foir the disconnected event.
  _disconnectedHandler() {
    this._connectionTest = false;
    if (this.connected) {
      this.set('connected', false);
    }
    const port = this.port;
    if (port) {
      port.onMessage.removeListener(this._messageListener);
      port.onDisconnect.removeListener(this._disconnectListener);
      this._setPort(undefined);
    }
  }
  /**
   * Sends message to external extension.
   * An error event will fire if trying to send a message on non existing port.``
   * Port is not created if the extension / app that is trying to connect is not
   * installed or do not accept externall connections.
   *
   * @param {Any} msg Message to send. A message can contain any valid JSON object
   * (null, boolean, number, string, array, or object).
   */
  postMessage(msg) {
    const p = this.port;
    if (!p) {
      const err = new Error('Port is closed.');
      this.dispatchEvent(new CustomEvent('error', {
        detail: err
      }));
      throw err;
    }
    p.postMessage(msg);
  }

  _processMessage(msg) {
    this._setLastMessage(msg);
    this.dispatchEvent(new CustomEvent('message', {
      detail: msg
    }));
  }

  _processExternalMessage(message, sender) {
    if (!this.allowedClients || this.allowedClients.indexOf(sender.id) === -1) {
      return;
    }
    if (sender.id === this.extensionId && !this.connected) {
      this.connect(this.extensionId);
    }
  }
}
window.customElements.define(ChromeConnect.is, ChromeConnect);
