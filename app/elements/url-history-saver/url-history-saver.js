(function() {
  'use strict';

  Polymer({
    is: 'url-history-saver',

    properties: {
      url: String
    },

    observers: [
      'store(url)'
    ],

    store: function(url) {
      if (!url) {
        return;
      }
      var event = this.fire('url-history-object-read', {
        url: url
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
        this.fire('url-history-object-change', {
          item: doc
        });
        this.url = null;
      });
    }
  });
})();
