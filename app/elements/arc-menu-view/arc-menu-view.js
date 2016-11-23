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
       * A list of projects
       */
      projects: Array,
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

      hasProjects: {
        type: Boolean,
        computed: '_computeHasProjects(projects.length)'
      },

      selectedProject: String,
      isRequest: {
        type: Boolean,
        reflectToAttribute: true
      },
      // It will display a loader when set to true
      loading: Boolean
    },

    observers: [
      'selectedProjectChanged(selectedProject)',
      '_routeChanged(route)'
    ],

    _routeChanged: function(route) {
      this.isRequest = route === 'request';
    },

    _computeHasProjects: function(length) {
      return !!length;
    },

    _itemTap: function(e) {
      e = Polymer.dom(e);
      var place = e.localTarget.dataset.place;
      if (place) {
        this.fire('navigate', {
          url: place
        });
      }
    },

    /**
     * Sort projects by name.
     */
    computeSort: function() {
      return function(a, b) {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        if (a.name === b.name) {
          return 0;
        }
      };
    },
    /**
     * Request app authorization.
     * Can be calle only if the user hasn't authorized the app.
     */
    _onAuth: function() {
      this.fire('authorize-requested');
    },
    /**
     * Request to sign out from the app.
     */
    _onSignOut: function() {
      this.fire('signout-requested');
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
      }
    },

    _computeProjectSelected: function(pId, selected) {
      return pId === selected;
    },

    selectedProjectChanged: function(selectedProject) {
      if (!selectedProject) {
        return;
      }
      if (!this.$.projectsSubmenu.opened) {
        this.$.projectsSubmenu.opened = true;
      }
    }
  });
})();
