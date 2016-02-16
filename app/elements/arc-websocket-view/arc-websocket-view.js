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
     * Hide messages input if true.
     *
     * @type {Boolean}
     */
    hideMessages: {
      type: Boolean,
      value: true,
      readOnly: true
    },
    /**
     * Hide logged message when true
     *
     * @type {Boolean}
     */
    hideLog: {
      type: Boolean,
      value: true,
      readOnly: true,
      computed: '_computeHideLog(messages.*)'
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
    /**
     * A file to be send.
     */
    file: Object,
    /** List of messages to display */
    messages: Array,
    /** True when send file button is enabled. */
    fileSendEnabled: {
      type: Boolean,
      value: false,
      computed: '_computeButtonVisible(file)'
    },
    /** True when send message button is enabled. */
    messageSendEnabled: {
      type: Boolean,
      value: false,
      computed: '_computeButtonVisible(message)'
    },
    /**
     * Currently selected tab.
     */
    selectedTab: {
      type: Number,
      value: 1
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
  /**
   * Handler for disconnect button clicked.
   */
  _disconnect: function() {
    this.fire('disconnect-requested');
  },
  /**
   * Send a string message.
   */
  _sendMessage: function() {
    if ((typeof this.message === 'string') && this.message.trim() === '') {
      return;
    }
    this.fire('send-requested', {
      message: this.message
    });
    this.message = '';
  },
  /**
   * Send a file message
   */
  _sendFileMessage: function() {
    if (!this.file) {
      return;
    }
    this.fire('send-requested', {
      message: this.file
    });
    this.file = null;
    this.$.fileDrop.reset();
  },
  /**
   * Called when socket connection state has changed.
   */
  _connectionStateChanged: function() {
    if (this.connected) {
      this._setHideMessages(false);
      this.selectedTab = 0;
    } else {
      this._setHideMessages(true);
    }
  },
  /**
   * A handler for file-drop element result. Called when file has changed.
   */
  _onFile: function(e) {
    this.file = e.detail.file;
  },
  /**
   * This function in responsible for parding a Date object to HH:mm:ss string.
   */
  _computeTime: function(date) {
    var options = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    };
    return new Intl.DateTimeFormat(undefined, options).format(date);
  },
  /**
   * Sort messages in a log so  newest are on top.
   */
  _sortMessages: function(a, b) {
    if (a.time > b.time) {
      return -1;
    }
    if (a.time < b.time) {
      return 1;
    }
    return 0;
  },
  /**
   * Compute if send button should be visible.
   *
   * @param {Any} obj If anything is passed to the function it should return true.
   * @return {Boolean} True if file is available.
   */
  _computeButtonVisible: function(obj) {
    return !!obj;
  },
  /**
   * This function if called from the view. It will compute if the welcome section should be
   * visible ni the UI.
   *
   * @param {Boolean} connected
   * @param {Boolean} connecting
   * @param {Boolean} retrying
   * @return {Boolean} True if all of parameters are falsy.
   */
  _computeInitialInfoVisible: function(connected, connecting, retrying) {
    return !connected && !connecting && !retrying;
  },
  /** Compute if log panel should be hidden. */
  _computeHideLog: function() {
    return !(this.messages && this.messages.length);
  },

  _downloadBinnary: function(e) {
    var item = this.$.logList.itemForElement(e.target);
    this.fire('message-download', {
      message: item
    });
  },

  _clearMessages: function() {
    this.fire('clear-messages');
  },

  _exportMessages: function() {
    this.fire('messages-download');
  }
});
