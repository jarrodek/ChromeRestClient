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
      }
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
    }
  });
})();
