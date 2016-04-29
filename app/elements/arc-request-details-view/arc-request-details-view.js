(function() {
'use strict';

Polymer({
  is: 'arc-request-details-view',
  properties: {
    request: Object,
    isHistory: {
      type: Boolean,
      value: false
    },
    hasPayload: {
      type: Boolean,
      value: false
    },
    // true if drawer is opened.
    narrow: Boolean,
    selectedVersion: Number,
    entry: Object
  },

  observers: [
    '_computeSelectedVersion(isHistory, request.*)',
    '_computeEntry(selectedVersion)',
    '_computeHasPayload(entry)'
  ],

  _computeSelectedVersion: function(isHistory) {
    var request = this.request;
    if (!request) {
      return;
    }
    var index = null;
    if (!isHistory) {
      if (request.referenceEntry || request.referenceEntry === 0) {
        index = request.referenceEntry;
      } else {
        index = 0;
      }
    } else {
      index = request.har.entries.length - 1;
    }
    this.selectedVersion = index;
  },

  _computeEntry: function(selectedVersion) {
    var entry = this.request.har.entries[selectedVersion];
    this.entry = entry;
  },

  _computeHasPayload: function(entry) {
    this.hasPayload = !!this._payloadValue(entry);
  },

  _payloadValue(entry) {
    if (!entry || !entry.request) {
      return false;
    }
    return entry.request.postData.text;
  },

  arrayItem: function(change, index, path) {
    return this.get(path, change.base[index]);
  },

  _computeHeaders: function(entry) {
    if (!entry) {
      return '(no headers)';
    }
    var hd = entry.request.headers;
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
  },

  _navigateItem: function() {
    var url;
    if (this.isHistory) {
      url = 'request/history/' + this.request.id + '/' + this.selectedVersion;
    } else {
      url = 'request/saved/' + this.request.id + '/' + this.selectedVersion;
    }
    arc.app.router.redirect(url);
  },
});
})();
