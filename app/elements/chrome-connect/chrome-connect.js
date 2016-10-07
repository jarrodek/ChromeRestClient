(function() {
  'use strict';
  Polymer({
    /**
     * Fires when error ocurred.
     *
     * @event error
     * @param {Object} An error object.
     */
    /**
     * Fires when message has been received.
     *
     * @event message
     * @param {Any} Message received from externall extension / app.
     */
    is: 'chrome-connect',
    properties: {
      // An ID of the extension to connect to.
      extensionId: String,
      // True if the app is connected to the external extension.
      connected: {
        type: Boolean,
        value: false,
        notify: true
      },
      // A port to another extension.
      port: {
        type: Object,
        readOnly: true
      },
      /**
       * A last message received from the external extension / app.
       */
      lastMessage: {
        type: Object,
        notify: true,
        readOnly: true
      },
      // External message handler function.
      _messageListener: {
        type: Function,
        value: function() {
          return this._processMessage.bind(this);
        }
      },
      // Allowed clients that the app will accept connection from.
      allowedClients: {
        type: Array,
        value: function() {
          return [
            'apcedakaoficjlofohhcmkkljehnmebp'
          ];
        },
        readOnly: true
      }
    },

    observers: [
      '_connect(extensionId)'
    ],

    attached: function() {
      this._extListener = this._processExternalMessage.bind(this);
      chrome.runtime.onMessageExternal.addListener(this._extListener);
    },

    detached: function() {
      chrome.runtime.onMessageExternal.removeListener(this._extListener);
    },

    // Attempt to connect to external extension.
    _connect: function(extensionId) {
      var port = chrome.runtime.connect(extensionId);
      var connected = true;
      port.onDisconnect.addListener(() => {
        connected = false;
        if (this.connected) {
          this.set('connected', false);
        }
        this._setPort(undefined);
        port.onMessage.removeListener(this._messageListener);
      });
      port.onMessage.addListener(this._messageListener);
      this.async(() => {
        // Still have connection so the extension is installed.
        if (connected) {
          this.set('connected', true);
        }
      }, 500); // Async so the connection can resolve itself.
      this._setPort(port);
    },

    /**
     * Sends message to external extension.
     * An error event will fire if trying to send a message on non existing port.
     * Port is not created if the extension / app that is trying to connect is not
     * installed or do not accept externall connections.
     *
     * @param {Any} msg Message to send. A message can contain any valid JSON object
     * (null, boolean, number, string, array, or object).
     */
    postMessage: function(msg) {
      var p = this.port;
      if (!p) {
        this.fire('error', new Error('Port is closed.'));
        return;
      }
      p.postMessage(msg);
    },

    _processMessage: function(msg) {
      this._setLastMessage(msg);
      this.fire('message', msg);
    },

    _processExternalMessage: function(message, sender) {
      if (this.allowedClients.indexOf(sender.id) === -1) {
        console.warn('Unauthorized connection.');
        return;
      }
      if (!message) {
        return;
      }
      if (message.loaded) {
        this._connect(this.extensionId);
      }
    }

  });
})();
