(function() {
  'use strict';
  Polymer({
    is: 'request-details-drawer',
    properties: {
      request: Object,
      // If true the view will not display "saved" item properties.
      isHistory: {
        type: Boolean,
        value: false
      },
      // If true, curent request has payload.
      hasPayload: {
        type: Boolean,
        computed: '_computeHasPayload(request.payload)'
      },
      // true if drawer is opened.
      narrow: Boolean
    },

    hostAttributes: {
      'drawer': true
    },

    _computeHasPayload: function(payload) {
      return !!payload;
    },

    _computeHeaders: function(headers) {
      if (!headers || !headers.length) {
        return '(no headers)';
      }
      return headers;
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
      this.fire('request-details-drawer-open', {
        item: this.request
      });
    }
  });
})();
