Polymer({
  is: 'arc-request-details-view',
  properties: {
    request: Object,
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
    var hd = request.har.entries[0].request.headers;
    if (!hd) {
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
