(function() {
  'use strict';
  Polymer({
    is: 'url-history-model',

    attached: function() {
      this.listen(document, 'url-history-object-change', '_handleChange');
      this.listen(document, 'url-history-object-read', '_handleRead');
      this.listen(document, 'url-history-object-query', '_handleQuery');
    },

    detached: function() {
      this.unlisten(document, 'url-history-object-change', '_handleChange');
      this.unlisten(document, 'url-history-object-read', '_handleRead');
      this.unlisten(document, 'url-history-object-query', '_handleQuery');
    },

    _getDb: function() {
      return new PouchDB('url-history', {
        // jscs:disable
        revs_limit: 100
        // jscs:enable
      });
    },

    _handleRead: function(e, detail) {
      e.preventDefault();
      e.stopPropagation();

      if (!detail.url) {
        e.detail.error = true;
        e.detail.message = 'You must set url';
        return;
      }

      var db = this._getDb();
      e.detail.result = db.get(detail.url)
      .catch((e) => {
        if (e.status === 404) {
          return null;
        }
        this._handleException(e);
      });
    },

    _handleChange: function(e, detail) {
      e.preventDefault();
      e.stopPropagation();

      if (!detail.item) {
        e.detail.error = true;
        e.detail.message = 'You must set url history object';
        return;
      }
      var db = this._getDb();
      e.detail.result = db.put(detail.item)
      .then((insertResult) => {
        detail.item._rev = insertResult.rev;
        this.fire('url-history-object-changed', {
          item: detail.item
        });
        return detail.item;
      })
      .catch((e) => this._handleException(e));
    },

    _handleQuery: function(e, detail) {
      e.preventDefault();
      e.stopPropagation();
      var q = detail.q;
      if (!q) {
        e.detail.error = true;
        e.detail.message = 'You must set query parameter';
        return;
      }

      var db = this._getDb();
      e.detail.result = db.allDocs()
      .then((r) => {
        return r.rows.filter((i) => i.id.indexOf(q) !== -1).map((i) => db.get(i.id));
      })
      .then((r) => Promise.all(r))
      .then((r) => {
        r = r.map((i) => {
          let d = new Date(i.time);
          d.setHours(0);
          d.setMinutes(0);
          d.setSeconds(0);
          d.setMilliseconds(0);
          i._time = d.getTime();
          return i;
        });
        return r.sort(this._sortFunction);
      })
      .catch((e) => this._handleException(e));
    },

    _sortFunction: function(a, b) {
      var aTime = a._time;
      var bTime = b._time;
      var aCnt = a.cnt;
      var bCnt = b.cnt;

      if (aTime > bTime) {
        return 1;
      }

      if (aTime === bTime) {
        if (aCnt > bCnt) {
          return 1;
        }
        if (aCnt < bCnt) {
          return -1;
        }
        return 0;
      }

      return -1;
    },

    _handleException: function(e) {
      this.fire('app-log', {
        'message': ['Url history model', e],
        'level': 'error'
      });
      console.error('Url history model', e);
      var message;
      if (e instanceof Error) {
        message = e.message;
      } else {
        message = JSON.stringify(e);
      }
      this.fire('send-analytics', {
        type: 'exception',
        description: message,
        fatal: true
      });
      throw e;
    }
  });
})();
