Polymer({
  is: 'projects-menu',

  behaviors: [
    ArcBehaviors.MenuListBehavior
  ],

  properties: {
    // current query options
    queryOptions: {
      type: Object,
      readOnly: true,
      value: function() {
        return {
          // jscs:disable
          include_docs: true
          // jscs:enable
        };
      }
    },
    includeDocs: {
      type: Boolean,
      value: true
    },
    selectedProject: String,
    /**
     * Route parameters
     */
    routeParams: Object
  },

  observers: [
    'selectedProjectChanged(selectedProject)'
  ],

  attached: function() {
    this.listen(window, 'project-object-deleted', '_projectDeleted');
    this.listen(window, 'project-object-changed', '_updateProject');
    this.listen(window, 'selected-project', '_updateProjectSelection');
    this.listen(window, 'datastrores-destroyed', '_onDatabaseDestroy');
    this.listen(window, 'data-imported', 'refreshProjects');
  },

  detached: function() {
    this.unlisten(window, 'project-object-deleted', '_projectDeleted');
    this.unlisten(window, 'project-object-changed', '_updateProject');
    this.unlisten(window, 'selected-project', '_updateProjectSelection');
    this.unlisten(window, 'datastrores-destroyed', '_onDatabaseDestroy');
    this.unlisten(window, 'data-imported', 'refreshProjects');
  },

  reset: function() {
    if (!this.queryOptions) {
      return; // not ready
    }
    this._setQuerying(false);
    this.set('items', []);
  },

  _resetOnClosed: function(opened) {
    if (opened && (!this.items || !this.items.length)) {
      this._makeQuery();
      return;
    } else if (opened) {
      // this.$.list.notifyResize();
    }
  },

  /**
   * Refresh projects list and display new list.
   */
  refreshProjects: function() {
    // this.reset();
    delete this.queryOptions.startkey;
    delete this.queryOptions.skip;
    this._setQuerying(false);
    this.set('items', []);
    this.set('selectedItemIndex', -1);
    this._makeQuery();
  },

  /**
   * Accepts currently selected suggestion and enters it into a text field.
   */
  _acceptSelection: function(e) {
    if (!this.opened) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    var path = e.path;
    var place;
    var toggleOpenAction = false;
    var elm;
    while (path.length) {
      elm = path.shift();
      if (elm.nodeType !== 1) {
        continue;
      }

      if (elm.dataset) {
        if (elm.dataset.place) {
          place = elm.dataset.place;
          break;
        } else if (elm.dataset.open) {
          toggleOpenAction = true;
          break;
        }
      }
    }
    if (!place && !toggleOpenAction) {
      return;
    }
    if (toggleOpenAction) {
      return this._toggle(elm);
    }
    page(place);
  },

  _toggle: function(elm) {
    var list = elm.querySelector('projects-menu-requests');
    list.opened = !list.opened;
  },

  _getDb: function() {
    return new PouchDB('legacy-projects');
  },

  _processResults: function(res) {
    res.sort((a, b) => {
      if (a.order === b.order) {
        return 0;
      }
      if (a.order > b.order) {
        return 1;
      }
      if (a.order < b.order) {
        return -1;
      }
    });
    return res;
  },

  _scrollHandler: function() {},

  _updateProject: function(e, detail) {
    var p = detail.project;
    if (!this.items || !this.items.length) {
      this.push('items', p);
      return;
    }
    var index = this.items.findIndex((i) => i._id === p._id);
    if (index === -1) {
      this.push('items', p);
      return;
    }
    this.set('items.' + index + '.name', p.name);
    this.set('items.' + index + '.order', p.order);
  },
  /**
   * Remove project from the UI as a reaction to `project-object-deleted` event.
   */
  _projectDeleted: function(e) {
    var id = e.detail.id;
    var list = this.items;
    var index = list.findIndex((item) => item._id === id);
    if (index === -1) {
      return;
    }
    this.splice('items', index, 1);
  },

  _updateProjectSelection: function(e, detail) {
    this.set('selectedProject', detail.id);
  },

  _onDatabaseDestroy: function(e) {
    var databases = e.detail.datastores;
    if (!databases || !databases.length) {
      return;
    }
    if (databases.indexOf('legacy-projects') === -1) {
      return;
    }
    this.set('items', []);
    var db = this._getDb();
    db.close();
  },

  _computeProjectSelected: function(pId, selected) {
    return pId === selected;
  },

  selectedProjectChanged: function(selectedProject) {
    if (!selectedProject && selectedProject !== null) {
      this.set('selectedProject', null);
    }
    if (!selectedProject) {
      return;
    }
    if (!this.opened) {
      this.set('opened', true);
    }
  }
});
