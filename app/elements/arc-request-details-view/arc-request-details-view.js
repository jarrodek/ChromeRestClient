(function() {
'use strict';

Polymer({
  is: 'arc-request-details-view',
  properties: {
    request: Object,
    isHistory: Boolean,
    _hasPayload: {
      type: Boolean,
      value: false,
      computed: '_computeHasPayload(request)'
    }
  },

  _computeHasPayload: function(request) {
    return request.har.entries[0].request.postData.text;
  },

  arrayItem: function(change, index, path) {
    return this.get(path, change.base[index]);
  },

  _computeHeaders: function(request) {
    var entries = request.har.entries;
    var hd;
    if (entries && entries.length > 0) {
      let index = 0;
      if (this.isHistory) {
        index = entries.length - 1;
      }
      hd = request.har.entries[index].request.headers;
    }
    if (!hd || hd.length === 0) {
      return '(no headers)';
    }
    var res = '';
    hd.forEach((header) => {
      res += header.name + ': ' + header.value + '\n';
    });
    return res;
  },

  closeDrawer: function() {
    this.fire('close');
  }
});
})();
