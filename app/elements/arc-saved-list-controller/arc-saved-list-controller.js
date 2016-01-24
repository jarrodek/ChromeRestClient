(function() {
  'use strict';

  Polymer({
    is: 'arc-saved-list-controller',
    behaviors: [
      ArcBehaviors.ArcControllerBehavior
    ],
    properties: {
      /**
       * List of requests
       */
      requests: Array,
      /**
       * If the view has requests
       */
      hasRequests: {
        type: Boolean,
        value: false,
        computed: '_computeHasRequests(requests)'
      }
    },
    onShow: function() {
      this.$.model.query();
    },
    onHide: function() {
      window.setTimeout(function(){
        this.requests = undefined;
      }.bind(this), 100);
    },
    /** Compute if the view has requests */
    _computeHasRequests: function(requests) {
      return !!requests;
    },

    _requestNameChanged: function(e) {
      var item = e.detail.item;
      this.$.saveModel.data = item;
    },
    /** User requested to clear all entries. */
    _clearSavedStore: function() {
      this.$.model.remove();
    },

    _dbError: function(e) {
      console.error('_dbError', e);
    }

  });
})();
