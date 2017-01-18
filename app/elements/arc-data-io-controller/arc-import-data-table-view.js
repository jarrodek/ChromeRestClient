(function() {
'use strict';

Polymer({
  is: 'arc-import-data-table-view',
  /**
   * Fired when the user perform an action import or cancel.
   *
   * @event import-action
   * @param {String} action An cation name. Either `import` or `cancel`.
   */
  properties: {
    /**
     * A project list to be associated with requests.
     */
    projects: Array,
    /**
     * A request objects array.
     */
    requests: Array,
    /**
     * A request history objects array.
     */
    history: Array,
    // List of the history URLs to import.
    urlHistory: Array,
    // List of websocket history URLs to import.
    websocketUrlHistory: Array,
    // List of variables to import
    variables: Array,
    headersSets: Array,
    authData: Array,
    cookies: Array,
    // True if component has saved requests data
    hasSaved: {
      type: Boolean,
      value: false,
      computed: '_computeHasData(requests)'
    },
    // True if component has history data
    hasHistory: {
      type: Boolean,
      value: false,
      computed: '_computeHasData(history)'
    },
    // Computed value, `true` if the `urlHistory` has data.
    hasUrlHistory: {
      type: Boolean,
      value: false,
      computed: '_computeHasData(urlHistory)'
    },
    hasWebsocketUrlHistory: {
      type: Boolean,
      value: false,
      computed: '_computeHasData(websocketUrlHistory)'
    },
    hasVariables: {
      type: Boolean,
      value: false,
      computed: '_computeHasData(variables)'
    },
    hasHeadersSets: {
      type: Boolean,
      value: false,
      computed: '_computeHasData(headersSets)'
    },
    hasAuthData: {
      type: Boolean,
      value: false,
      computed: '_computeHasData(authData)'
    },
    hasCookies: {
      type: Boolean,
      value: false,
      computed: '_computeHasData(cookies)'
    },
    exportTime: String,
    exportVersion: String,
    // True if the "saved" import section is opened
    savedOpened: {
      type: Boolean,
      value: false
    },
    // True if the "history" import section is opened
    historyOpened: {
      type: Boolean,
      value: false
    },
    // True if the "urls history" import section is opened
    urlHistoryOpened: {
      type: Boolean,
      value: false
    },
    // True if the "urls history" import section is opened
    websocketUrlHistoryOpened: {
      type: Boolean,
      value: false
    },
    variablesOpened: {
      type: Boolean,
      value: false
    },
    headersSetsOpened: {
      type: Boolean,
      value: false
    },
    authDataOpened: {
      type: Boolean,
      value: false
    },
    cookiesOpened: {
      type: Boolean,
      value: false
    }
  },
  /**
   * Compute if the current request have associated project to it and return it name.
   *
   * @param {Object} item a request object imported from the file.
   * @param {Array} projects A list of projects imported from the file.
   * @return {String} Project name or 'none' if not found.
   */
  _computeProjectName: function(item, projects) {
    var noop = 'none';
    if (!projects.length) {
      return noop;
    }

    if (!item.kind) {
      return this._computeProjectNameLegacy(item, projects);
    }

    if (item.kind === 'ARC#RequestData') {
      // new DB structure
      if (!item._referenceLegacyProject) {
        return noop;
      }
      var _p = projects.find((i) => i._referenceId === item._referenceLegacyProject);
      if (_p) {
        return _p.name;
      }
      return noop;
    }
    for (var i = 0, length = projects.length; i < length; i++) {
      if (projects[i].requestIds.indexOf(item.id) !== -1) {
        return projects[i].name;
      }
    }
    return noop;
  },
  /**
   * Do the same as `_computeProjectName` but for legacy project data.
   */
  _computeProjectNameLegacy: function(item, projects) {
    if (!item.project || isNaN(item.project)) {
      return 'none';
    }
    if (!projects.length) {
      return 'none';
    }
    for (var i = 0, length = projects.length; i < length; i++) {
      if (projects[i].id === item.project) {
        return projects[i].name;
      }
    }
    return 'none';
  },
  /**
   * Import button tapped.
   */
  importTap: function() {
    this.fire('import-action', {
      action: 'import'
    });
  },
  /**
   * Cancel button tapped.
   */
  cancelTap: function() {
    this.fire('import-action', {
      action: 'cancel'
    });
  },

  _computeHasData: function(arr) {
    return !!(arr && arr.length);
  },
  // Computes number of items in the array
  _countImport: function(data) {
    if (!data) {
      return 0;
    }
    return data.length;
  },

  _computeMetadataHidden: function(exportTime) {
    return !exportTime;
  },

  _computeCollapseLabel: function(opened) {
    return opened ? 'Hide' : 'Show';
  },

  // Computes class for the toggle's button icon.
  _computeToggleIconClass: function(opened) {
    var clazz = 'toggle-icon';
    if (opened) {
      clazz += ' opened';
    }
    return clazz;
  },

  _toggleSaved: function() {
    this.savedOpened = !this.savedOpened;
  },

  _toggleHistory: function() {
    this.historyOpened = !this.historyOpened;
  },

  _toggleUrlHistory: function() {
    this.urlHistoryOpened = !this.urlHistoryOpened;
  },

  _toggleWebsocketUrlHistory: function() {
    this.websocketUrlHistoryOpened = !this.websocketUrlHistoryOpened;
  },

  _toggleVariables: function() {
    this.variablesOpened = !this.variablesOpened;
  },

  _toggleHeadersSets: function() {
    this.headersSetsOpened = !this.headersSetsOpened;
  },

  _toggleAuthData: function() {
    this.authDataOpened = !this.authDataOpened;
  },

  _toggleCookies: function() {
    this.cookiesOpened = !this.cookiesOpened;
  }
});
})();
