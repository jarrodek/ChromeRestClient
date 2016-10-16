(function() {
  'use strict';

  Polymer({
    is: 'url-history-saver',

    properties: {
      url: String,
      data: Object
    },

    observers: [
      'store(url)'
    ],

    store: function(url) {
      if (!url) {
        return;
      }
      this.$.doc.transactionsComplete
      .then(() => {
        if (this.data) {
          if (!this.data.cnt) {
            this.data.cnt = 0;
          }
          this.data.cnt++;
          this.data.time = Date.now();
          this.$.doc.save();
        }
      })
      .catch((e) => {
        if (e.status === 404) {
          this.data = {
            _id: url,
            cnt: 1,
            time: Date.now()
          };
          this.$.doc.save();
        } else {
          this.fire('app-log', {'message': ['Saving url history', e], 'level': 'error'});
          arc.app.analytics.sendException('UrlHistory:' + JSON.stringify(e), true);
        }
      });
    }
  });
})();
