'use strict';

Polymer({
  is: 'onboarding-tutorial',
  properties: {
    /**
     * Name of the tutorial.
     * It will be used to identify this instance of the tutorial and will not show it if the user
     * has already seen it.
     *
     * @type {String}
     */
    name: String,
    /**
     * Delay tutorial show after attaching this element to the DOM.
     *
     * @type {Number}
     */
    delay: {
      type: Number,
      value: 2000
    },

    pages: {
      type: Array,
      value: []
    },
    selectedPage: {
      type: Number,
      value: 0
    },
    withBackdrop: {
      type: Boolean,
      value: true
    },
    previousEnabled: {
      type: Boolean,
      computed: '_comnputeShowPrevious(selectedPage)'
    },
    lastPage: {
      type: Boolean,
      computed: '_comnputeLastPage(selectedPage, pages)'
    },
    nextLabel: {
      type: String,
      computed: '_comnputeNextLabel(lastPage)'
    },
    showSkip: {
      type: Boolean,
      computed: '_comnputeShowSkip(lastPage)'
    }
  },
  behaviors: [
    Polymer.IronOverlayBehavior,
    Polymer.IronResizableBehavior
  ],
  hostAttributes: {
    'role': 'dialog',
    'tabindex': '-1'
  },
  attached: function() {
    var effectiveChildren = Polymer.dom(this).getEffectiveChildNodes();
    for (let i = effectiveChildren.length - 1; i >= 0; i--) {
      let node = effectiveChildren[i];
      if (node.nodeType === 3) {
        effectiveChildren.splice(i, 1);
      }
    }
    this.pages = effectiveChildren;
    this.open();
  },
  _comnputeShowPrevious: function(selectedPage) {
    return selectedPage > 0;
  },

  next: function() {
    this.$.pages.entryAnimation = 'slide-from-right-animation';
    this.$.pages.exitAnimation = 'slide-left-animation';
    this.$.pages.selectNext();
  },
  prev: function() {
    this.$.pages.entryAnimation = 'slide-from-left-animation';
    this.$.pages.exitAnimation = 'slide-right-animation';
    this.$.pages.selectPrevious();
  },

  _comnputeNextLabel: function(lastPage) {
    return lastPage ? 'close' : 'next';
  },

  _comnputeLastPage: function(selectedPage, pages) {
    return selectedPage === pages.length - 1 ? true : false;
  },

  _comnputeShowSkip: function(lastPage) {
    return lastPage ? false : true;
  }
});
