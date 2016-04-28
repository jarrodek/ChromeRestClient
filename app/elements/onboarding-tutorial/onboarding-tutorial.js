(function() {
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
     * Use with combination with `auto`. It will do nothing if auto is not set.
     * @type {Number}
     */
    delay: {
      type: Number,
      value: 2000
    },
    /**
     * If true the tutorial will open itself automatically.
     * Use with combination with `delay`
     * @type {Boolean}
     */
    auto: Boolean,
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
    },
    /**
     * True when hide the pagination for tutorial pages.
     * @type {Boolean}
     */
    noPagination: Boolean,
    /**
     * Hide "previous" button
     */
    hidePrev: Boolean
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
    var boundHandler = this._childNodesChanged.bind(this);
    this._observer = Polymer.dom(this.$.content).observeNodes(boundHandler);

    if (!this.auto) {
      return;
    }
    if (this.delay) {
      this.async(() => {
        this.openTutorial();
      }, this.delay);
    } else {
      this.openTutorial();
    }
  },

  detached: function() {
    Polymer.dom(this.$.content).unobserveNodes(this._observer);
  },

  _childNodesChanged: function() {
    var children = Polymer.dom(this).getEffectiveChildNodes();
    children = children.filter((node) => node.nodeType === Node.ELEMENT_NODE);
    this.set('pages', children);
    if (this.pages.length === 1) {
      //hide controls
      this.noPagination = true;
      this.hidePrev = true;
    }
  },

  openTutorial: function() {
    this._getTutorialState()
    .then((state) => {
      if (state) {
        return;
      }
      this.open();
    });
  },

  _comnputeShowPrevious: function(selectedPage) {
    selectedPage = Number(selectedPage);
    return selectedPage > 0;
  },

  next: function() {
    if (this.lastPage) {
      arc.app.analytics.sendEvent('Onboarding', 'Passed', 'passed');
      this.completeTutorial();
      return;
    }
    this.$.pages.entryAnimation = 'slide-from-right-animation';
    this.$.pages.exitAnimation = 'slide-left-animation';
    this.$.pages.selectNext();
    arc.app.analytics.sendEvent('Onboarding', 'Page', 'Next');
  },

  prev: function() {
    this.$.pages.entryAnimation = 'slide-from-left-animation';
    this.$.pages.exitAnimation = 'slide-right-animation';
    this.$.pages.selectPrevious();
    arc.app.analytics.sendEvent('Onboarding', 'Page', 'Prev');
  },

  completeTutorial: function() {
    if (!this.id) {
      this.close();
      return;
    }
    this._saveTutorialPassed();
    this.close();
  },

  skip: function() {
    this.completeTutorial();
    arc.app.analytics.sendEvent('Onboarding', 'Skipped', 'skip');
  },

  _getTutorialState: function() {
    if (!this.id) {
      return Promise.resolve(false);
    }
    return new Promise((resolve) => {
      chrome.storage.sync.get('tutorials', (data) => {
        if (!('tutorials' in data)) {
          resolve(false);
          return;
        }
        var t = data.tutorials;
        if (!(t instanceof Array)) {
          resolve(false);
          return;
        }
        resolve(t.indexOf(this.id) !== -1);
      });
    });
  },

  _saveTutorialPassed: function() {
    if (!this.id) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      chrome.storage.sync.get('tutorials', (data) => {
        if (!('tutorials' in data)) {
          data.tutorials = [];
        }
        var t = data.tutorials;
        if (!(t instanceof Array)) {
          t = [];
        }
        if (t.indexOf(this.id) === -1) {
          t[t.length] = this.id;
        } else {
          t = t.filter((value, index, self) => {
            return self.indexOf(value) === index;
          });
        }
        chrome.storage.sync.set({tutorials: t}, () => {
          resolve();
        });
      });
    });
  },

  _comnputeNextLabel: function(lastPage) {
    return lastPage ? 'close' : 'next';
  },

  _comnputeLastPage: function(selectedPage, pages) {
    selectedPage = Number(selectedPage);
    return selectedPage === pages.length - 1;
  },

  _comnputeShowSkip: function(lastPage) {
    return lastPage ? false : true;
  }
});
})();
