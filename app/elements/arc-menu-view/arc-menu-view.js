(function() {
  Polymer({
    is: 'arc-menu-view',

    properties: {
      /**
       * Current route object.
       */
      route: String,
      /**
       * Apps base URL.
       */
      baseUrl: String,
      /**
       * Remove history from view if set to true.
       */
      noHistory: {
        type: Boolean,
        value: false
      },
      /** Is the app has been authorized by the user. */
      appAuthorized: {
        type: Boolean,
        value: false
      },
      /**
       * Display menu as there is a toast in the bottom displayed.
       */
      withToast: {
        type: Boolean,
        reflectToAttribute: true
      },

      selectedProject: String,
      isRequest: {
        type: Boolean,
        reflectToAttribute: true
      },
      // It will display a loader when set to true
      loading: Boolean,
      // True if the history quick access panel is opened.
      historyOpened: {
        type: Boolean,
        value: false
      },
      // True if the saved quick access panel is opened.
      savedOpened: {
        type: Boolean,
        value: false
      },
      // True if the projects list panel is opened.
      projectsOpened: {
        type: Boolean
      },
    },

    observers: [
      '_routeChanged(route)'
    ],

    _routeChanged: function(route) {
      this.isRequest = route === 'request';
    },

    _itemTap: function(e) {
      e.preventDefault();
      e.stopPropagation();

      e = Polymer.dom(e);
      var path = e.path;
      var place;
      while (true) {
        var _node = path.shift();
        if (_node && (_node === this || _node === document.body)) {
          break;
        } else if (_node && _node.dataset && _node.dataset.place) {
          place = _node.dataset.place;
          break;
        }
      }
      if (!place) {
        return;
      }
      if (place) {
        this.fire('navigate', {
          url: place
        });
      }
    },
    /**
     * Opens an issue tracker - new issue report.
     *
     */
    newIssueReport: function() {
      var os = arc.app.utils.osInfo;
      var message = 'Your description here\n\n';
      message += '## Expected outcome\nWhat should happen?\n\n';
      message += '## Actual outcome\nWhat happened?\n\n';
      /*jshint camelcase: false */
      // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
      message += `## Versions\nApp: ${chrome.runtime.getManifest().version_name}\n`;
      //jscs:enable requireCamelCaseOrUpperCaseIdentifiers
      /*jshint camelcase: true */
      message += `Chrome: ${navigator.appVersion.match(/Chrome\/((\d+\.?)+)/)[1]}\n`;
      message += `Platform: ${os.osName} (${os.osVersion})\n\n`;
      message += '## Steps to reproduce\n1. \n2. \n3. ';
      message = encodeURIComponent(message);
      window.open('https://github.com/jarrodek/ChromeRestClient/issues/new?body=' + message);
    },

    openNewWindow: function() {
      chrome.runtime.getBackgroundPage(function(bg) {
        bg.arc.bg.openWindow();
      });
    },

    _actionsMenuOpened: function() {
      this.$.actionsMenu.selected = -1;
    },

    _contextMenuAction: function(e) {
      var action = e.target.selectedItem.dataset.action;
      if (!action) {
        return;
      }
      switch (action) {
        case 'rate-review':
          var url = 'https://chrome.google.com/webstore/detail/hgmloofddffdnphfgcellkdfbfbjeloo/' +
            'reviews?utm_source=ARC';
          window.open(url);
          break;
        case 'new-app-window':
          chrome.runtime.getBackgroundPage(function(bg) {
            bg.arc.bg.openWindow();
          });
          break;
        case 'view-logs':
          var logViewer = document.querySelector('arc-log-viewer');
          if (!logViewer) {
            return;
          }
          logViewer.open();
          break;
        case 'about-view':
          this.fire('navigate', {
            url: '/about'
          });
          break;
      }
    },

    // Computes class for the toggle's button icon.
    _computeToggleIconClass: function(opened) {
      var clazz = 'toggle-icon';
      if (opened) {
        clazz += ' opened';
      }
      return clazz;
    },

    _toggleHistoryOpened: function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.historyOpened = !this.historyOpened;
    },

    _toggleSavedOpened: function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.savedOpened = !this.savedOpened;
    },

    _toggleProjectsOpened: function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.projectsOpened = !this.projectsOpened;
    }
  });
})();
