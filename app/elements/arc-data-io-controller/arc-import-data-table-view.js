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
    // True if component has saved requests data
    hasSaved: {
      type: Boolean,
      computed: '_computeHasData(requests)'
    },
    // True if component has history data
    hasHistory: {
      type: Boolean,
      computed: '_computeHasData(history)'
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
  }
});
})();
