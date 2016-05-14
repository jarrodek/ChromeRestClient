(function() {

  'use strict';
  Polymer({
    is: 'arc-xhr-request',

    behaviors: [
      ArcBehaviors.ArcRequestBehavior
    ],

    properties: {
      request: Object
    },

    run: function() {
      if (!this.$.ext.connected) {
        this.fire('error', {
          message: 'ARC extension is not installed.',
          code: 900
        });
        return null;
      }
      this.getRequestTimeout()
      .then(() => this._prepareRequest())
      .catch((e) => {
        this.fire('error', {
          message: e.message
        });
        return null;
      })
      .then((init) => {
        if (!init) {
          this.fire('error', {
            message: 'The request object could not be initialized'
          });
          return null;
        }
        this.$.ext.postMessage({
          'payload': 'proxy-xhr',
          'request': init
        });
      });
    },

    _prepareRequest: function() {
      return new Promise((resolve) => {
        var init = {
          method: this.request.method,
          url: this.request.url,
          payload: this.request.payload,
          timeout: this.timeout
        };
        if (this.request.headers) {
          init.headers = arc.app.headers.toJSON(this.request.headers);
        }
        init.timeout = this.timeout;
        if (this.request.files && this.request.files.length > 0) {
          this.serializeFiles(this.request.files).then((files) => {
            init.files = files;
            resolve(init);
          });
        } else {
          resolve(init);
        }
      });
    },

    _onExternalMessage: function(e) {
      var msg = e.detail;
      if (!msg || !msg.payload) {
        return;
      }
      if (msg.payload === 'proxy-xhr') {
        delete msg.payload;
        this._processResponse(msg);
      }
    },

    _processResponse: function(msg) {
      console.log(msg);
      
    }
  });
})();
