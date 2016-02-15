Polymer({
  is: 'arc-websocket-view',

  properties: {
    /**
     * Remote URL.
     *
     * @type {String}
     */
    url: {
      type: String,
      value: 'ws://echo.websocket.org',
      observer: '_urlChanged',
      notify: true
    },
    /**
     * If true the connect button is disabled.
     *
     * @type {Boolean}
     */
    connectDisabled: {
      type: Boolean,
      value: true,
      readOnly: true
    },
    /** True if socket is connecting */
    connecting: {
      type: Boolean,
      value: false
    },
    /** True if socket is connected to the remote server. */
    connected: {
      type: Boolean,
      value: false
    },
    /** True if socket is trying to reconnect after loosing the connection. */
    retrying: {
      type: Boolean,
      value: false
    },
    /**
     * Hide messages input and logs field if true.
     *
     * @type {Boolean}
     */
    hideMessages: {
      type: Boolean,
      value: true,
      readOnly: true
    },
    /**
     * A message to be send to the server.
     *
     * @type {String}
     */
    message: {
      type: String,
      value: '',
      notify: true
    },
    /** List of messages to display */
    messages: Array,
    selectedTab: {
      type: Number,
      value: 0
    }
  },

  observers: [
    '_connectionStateChanged(connecting,connected,retrying)'
  ],
  /**
   * Called when the remote URL has changed.
   * Will set a state of `connectDisabled` attribute.
   */
  _urlChanged: function() {
    if (String(this.url).trim() === '') {
      this._setConnectDisabled(true);
    } else {
      this._setConnectDisabled(false);
    }
  },
  /**
   * A user clicked on the connect button.
   */
  _connect: function() {
    if (this.url.trim() === '') {
      this.emptyAddress.open();
      return;
    }
    this.fire('connect-requested', {
      url: this.url
    });
  },

  _disconnect: function() {
    this.fire('disconnect-requested');
  },

  _sendMessage: function() {
    if ((typeof this.message === 'string') && this.message.trim() === '') {
      return;
    }
    this.fire('send-requested', {
      message: this.message
    });
    this.message = '';
    this.$.fileDrop.reset();
  },

  _connectionStateChanged: function() {
    if (this.connected) {
      this._setHideMessages(false);
    } else {
      this._setHideMessages(true);
    }
  },

  _onFile: function(e) {
    this.message = e.detail.file;
  },

  _computeTime: function(date) {
    var options = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    };
    return new Intl.DateTimeFormat(undefined, options).format(date);
  },

  _sortMessages: function(a, b) {
    if (a.time > b.time) {
      return -1;
    }
    if (a.time < b.time) {
      return 1;
    }
    return 0;
  }
});
