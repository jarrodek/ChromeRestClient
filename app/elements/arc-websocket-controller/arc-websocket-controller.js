(function() {
'use strict';
/* global WebSocketMessage */
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
      value: false,
      observer: '_connectedChanged'
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
    },
    /**
     * Last used URL.
     */
    lastSocketUrl: {
      type: String
    },
    noRetry: Boolean,
    // True when the elemnt has been initialized.
    isReady: {
      type: Boolean,
      value: false
    },
    loadingHistory: {
      type: Boolean,
      value: false
    }
  },

  ready: function() {
    this.isReady = true;
    this.$.store.read();
  },

  onShow: function() {
    this._setPageTitle('Socket');
  },
  onHide: function() {
    this._setPageTitle('');
  },

  listeners: {
    'socket-url-change': '_onUrlChangeRequested'
  },

  /**
   * Message received handler.
   */
  _messageReceived: function(e) {
    var message = new WebSocketMessage({
      message: e.detail.data,
      direction: 'in'
    });
    this.push('messages', message);
  },

  _onDisconnected: function() {
    this._setConnecting(false);
    this._setConnected(false);
  },

  _onConnected: function() {
    this._setConnecting(false);
    this._setConnected(true);
  },

  _onError: function(e) {
    console.error(e.detail.error);
    this.fire('app-log', {
      'message': ['No support for given header.', e.detail.error],
      'level': 'error'
    });
    this._setConnecting(false);
    StatusNotification.notify({
      message: e.detail.error.message || 'Unknown error occured'
    });
  },

  _connect: function(e) {
    var url = e.detail.url;
    this.$.socket.url = url;
    this._setConnecting(true);
    this.$.socket.open();
    // this.lastSocketUrl = this.$.socket.url;
    this.fire('send-analytics', {
      type: 'event',
      category: 'Web sockets',
      action: 'Connect to socket'
    });
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
    this.$.socket.message = message.isBinary ? message.binaryData : message.message;
    this.$.socket.send();
    this.fire('send-analytics', {
      type: 'event',
      category: 'Web sockets',
      action: 'Send message'
    });
  },

  _downloadBinary: function(e) {
    var msg = e.detail.message;
    if (!msg || !msg.isBinary) {
      return;
    }
    this.fileSuggestedName = 'socket-message';
    this.exportContent = msg.binaryData;
    this.exportMime = 'application/octet-stream';
    this.exportData();
  },
  /**
   * Clear messages log output
   */
  clearMessages: function() {
    this.set('messages', []);
  },
  /**
   * Exporrt all messages to a file.
   */
  exportMessages: function() {
    this.fileSuggestedName = 'socket-messages';
    this.exportContent = this.messages;
    this.exportMime = 'json';
    this.exportData();
    this.fire('send-analytics', {
      type: 'event',
      category: 'Web sockets',
      action: 'Export messages to file'
    });
  },

  _restoredHandler: function() {
    // if (this.lastSocketUrl) {
    //   this.$.view.url = this.lastSocketUrl;
    // }
  },

  _autoReconnectChanged: function(e) {
    this.noRetry = !e.detail.value;
  },

  _connectedChanged: function(isConnected) {
    if (!isConnected) {
      return;
    }
    var url = this.lastSocketUrl;
    if (!url) {
      return;
    }
    var event = this.fire('websocket-url-history-read', {
      url: url
    }, {
      cancelable: true
    });
    event.detail.result.then((doc) => {
      if (!doc) {
        doc = {
          _id: url,
          cnt: 1,
          time: Date.now()
        };
      } else {
        doc.cnt++;
        doc.time = Date.now();
      }
      this.fire('websocket-url-history-changed', {
        item: doc
      }, {
        cancelable: true
      });
      this._appendHistoryItem(doc);
    });
  },

  _onUrlChangeRequested: function(e) {
    e.preventDefault();
    e.stopPropagation();
    var url = e.detail.url;
    this.lastSocketUrl = url;
    this._connect(e);
  },

  _canShowEmptyScreen: function(connected, hasHistoryData, loadingHistory) {
    return !connected && !hasHistoryData && !loadingHistory;
  },

  _appendHistoryItem: function(item) {
    var element = this.$$('websocket-history-view');
    if (!element) {
      return;
    }
    element.appendHistoryItem(item);
  }
});
})();
