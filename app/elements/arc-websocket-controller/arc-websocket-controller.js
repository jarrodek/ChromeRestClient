'use strict';

Polymer({
  is: 'arc-websocket-controller',
  behaviors: [
    ArcBehaviors.ArcControllerBehavior,
    ArcBehaviors.ArcFileExportBehavior
  ],
  properties: {
    /**
     * True if &lt;web-socket&gt; is trying to connect to the remote server.
     */
    connecting: {
      type: Boolean,
      readOnly: true,
      value: false
    },
    /**
     * True if the socket is connected.
     */
    connected: {
      type: Boolean,
      readOnly: true,
      value: false
    },
    /**
     * Tru if the socket is disconnected (`connect` is false) but the component is trying to
     * reconnect.
     */
    retrying: Boolean,
    /**
     * A list of messages sent to and received from the server.
     *
     * @type {Array}
     */
    messages: {
      type: Array,
      value: [],
      notify: true
    }
  },
  _messageReceived: function(e) {
    var message = new WebSocketMessage({
      message: e.detail.data,
      direction: 'in'
    });
    this.push('messages', message);
    console.log(message);
  },

  _onDisconnected: function() {
    console.log('disconnected');
    this._setConnecting(false);
    this._setConnected(false);
  },

  _onConnected: function() {
    console.log('_onConnected');
    this._setConnecting(false);
    this._setConnected(true);
  },

  _onError: function(e) {
    console.error(e.detail.error);
    this._setConnecting(false);
  },

  _connect: function(e) {
    var url = e.detail.url;
    this.$.socket.url = url;
    this._setConnecting(true);
    this.$.socket.open();
  },

  _disconnect: function() {
    this.$.socket.close();
  },

  _send: function(e) {
    var message = new WebSocketMessage({
      message: e.detail.message,
      direction: 'out'
    });
    this.push('messages', message);
    this.$.socket.message = message.message;
    this.$.socket.send();
  }
});
