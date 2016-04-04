Polymer({
  /**
   * Fired when online state changed.
   *
   * @event network-state
   * @param {Boolean} online The state of the network.
   */
  is: 'network-state',
  properties: {
    // True when online, false when offline.
    online: {
      type: Boolean,
      readOnly: true,
      notify: true,
      value: function() {
        return navigator.onLine;
      }
    }
  },

  attached: function() {
    this.listen(window, 'offline', '_onOffline');
    this.listen(window, 'online', '_onOnline');
    this.fire('network-state', {
      online: this.online
    });
  },

  detached: function() {
    this.unlisten(window, 'offline', '_onOffline');
    this.unlisten(window, 'online', '_onOnline');
  },

  _onOnline: function() {
    this._setOnline(true);
    this.fire('network-state', {
      online: true
    });
  },

  _onOffline: function() {
    this._setOnline(false);
    this.fire('network-state', {
      online: false
    });
  },

});
