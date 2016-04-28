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
    },
    // true if drawer is opened.
    narrow: Boolean
  },

  _computeHasPayload: function(request) {
    return !!this._payloadValue(request);
  },

  _payloadValue(request) {
    if (!request) {
      return false;
    }
    var entries = request.har.entries;
    if (!entries || entries.length === 0) {
      return false;
    }
    var _request;
    if (!this.isHistory) {
      if (request.referenceEntry || request.referenceEntry === 0) {
        _request = entries[request.referenceEntry].request;
      } else {
        _request = entries[0].request; // take the first one.
      }
    } else {
      _request = entries[entries.length - 1].request; // take the last one.
    }
    return _request.postData.text;
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
  },

  _headerTransformed: function(e) {
    if (this.narrow) {
      return;
    }
    var value = e.detail.top + 'px';
    var style = Polymer.dom(this).node.style;
    style.setProperty('top', value);
    style.setProperty('height', `calc(100% - ${value})`, 'important');
  }
});
})();
