(function() {

  'use strict';
  Polymer({
    is: 'arc-xhr-request',

    behaviors: [
      ArcBehaviors.ArcRequestBehavior
    ],

    properties: {
      request: Object,
      // If true the request has been aborted and the response shouldn't be reported.
      aborted: Boolean,
      // Set by chrome-connect element. 
      connected: {
        type: Boolean,
        notify: true
      }
    },

    run: function() {
      this.aborted = false;
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
      if (this.aborted) {
        return;
      }
      if (msg.log && msg.log.length) {
        msg.log.forEach((log) => console.log(log));
      }
      if (msg.error) {
        var detail = {
          request: {
            xhr: true
          },
          response: {
            error: {
              message: msg.message || 'Unknown error in connection.'
            }
          }
        };
        this.fire('ready', detail);
        return;
      }
      var response = msg.response;
      var h = arc.app.headers.toJSON(response.headers);
      var list = {};
      h.forEach((item) => list[item.name] = item.value);
      var hObj;
      try {
        hObj = new Headers(list);
      } catch (e) {
        let msg = 'Hi!. I was unable to create a Headers object. This sucks but the issue report ';
        msg += 'should be reported to the Chromium project guys.';
        console.log(msg);
        hObj = new Headers();
      }
      response._headers = hObj;
      response.headers = h;
      response.redirects = [];
      response.ok = true;
      response.auth = {};
      response.stats = response.stats;

      var ct = hObj.get('content-type');
      var cl = Number(hObj.get('content-length'));
      if (cl && cl === 0) {
        response.body = '';
      } else if (ct && ct.indexOf('json') !== -1) {
        try {
          response.body = JSON.parse(response.response);
        } catch (e) {
          response.body = response.response;
        }
      } else {
        response.body = response.response;
      }
      delete response.response;
      var detail = {
        request: {
          xhr: true
        },
        response: response
      };
      this.fire('ready', detail);
    },

    abort: function() {
      this.aborted = true;
    }
  });
})();
