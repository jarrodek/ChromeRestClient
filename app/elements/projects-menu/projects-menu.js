Polymer({
  is: 'projects-menu',

  properties: {
    /**
     * Currently selected item on a history items list.
     * @type {Number}
     */
    selectedItem: {
      type: Number,
      value: 0
    },
    /**
     * History items found in the datastore.
     */
    items: Array,

    hasItems: {
      type: Boolean,
      value: false,
      computed: '_computeHasItems(items.*)'
    },

    isAttached: Boolean,

    querying: {
      type: Boolean,
      readOnly: true
    },

    // current query options
    queryOptions: {
      type: Object,
      readOnly: true,
      value: function() {
        return {
          limit: 25,
          descending: true,
          // jscs:disable
          include_docs: true
          // jscs:enable
        };
      }
    },

    opened: {
      type: Boolean,
      value: false
    },

    selectedProject: String,
    route: String,
    baseUrl: String,
  },

  observers: [
    '_queryDataOnOpen(opened)',
    '_projectsListChanged(items.*)',
    'selectedProjectChanged(selectedProject)'
  ],

  listeners: {
    'tap': 'acceptSelection'
  },

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
    delete this.queryOptions.startkey;
    delete this.queryOptions.skip;
    this._setQuerying(false);
    this.set('items', []);
    this.$.selector.selected = -1;
  },

  _queryDataOnOpen: function(opened) {
    if (opened && (!this.items || !this.items.length)) {
      this._makeQuery();
      return;
    }
  },

  /**
   * Refresh projects list and display new list.
   */
  refreshProjects: function() {
    this.reset();
    this._makeQuery();
  },

  /**
   * Highlight previous suggestion
   */
  selectPrevious: function() {
    if (!this.opened) {
      return;
    }
    this.$.selector.selectPrevious();
    this.ensureItemVisible(false);
  },
  /**
   * Highlight next suggestion
   */
  selectNext: function() {
    if (!this.opened) {
      return;
    }
    this.$.selector.selectNext();
    this.ensureItemVisible(true);
  },
  /**
   * Ensure that the selected item is visible in the scroller.
   * When there is more elements to show than space available (height)
   * then some elements will be hidden. When the user use arrows to navigate
   * the selection may get out from the screen. This function ensures that
   * currently selected element is visible.
   *
   * @param {Boolean} bottom If trully it will ensure that the element is
   * visible at the bottom of the container. On the top otherwise.
   */
  ensureItemVisible: function(bottom) {
    if (!this.opened) {
      return;
    }
    var container = this.scrollTarget;
    var index = this.$.selector.selected;
    if (bottom && index === 0) {
      this.scroll(0);
      return;
    }
    var toMove;
    if (!bottom && index === this.suggestions.length - 1) {
      toMove = container.scrollHeight - container.offsetHeight;
      this.scroll(0, toMove);
      return;
    }
    var item = this.$.selector.selectedItem;
    var containerOffsetHeight = bottom ? container.offsetHeight : 0;
    var itemOffsetHeight = bottom ? item.offsetHeight : 0;
    var visible = containerOffsetHeight + container.scrollTop;
    var treshold = item.offsetTop + itemOffsetHeight;
    if (bottom && treshold > visible) {
      toMove = item.offsetHeight + item.offsetTop - container.offsetHeight;
      this.scroll(0, toMove);
    } else if (!bottom && visible > treshold) {
      this.scroll(0, treshold);
    }
  },
  /**
   * Accepts currently selected suggestion and enters it into a text field.
   */
  acceptSelection: function(e) {
    if (!this.opened) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    var path = e.path;
    var place;
    while (path.length) {
      var elm = path.shift();
      if (elm.nodeType !== 1) {
        continue;
      }
      if (elm.dataset && elm.dataset.place) {
        place = elm.dataset.place;
        break;
      }
    }
    if (!place) {
      return;
    }
    page(place);
  },

  _makeQuery: function() {
    this.debounce('legacy-projects-load-page', this._loadPage, 10);
  },

  _getDb: function() {
    return new PouchDB('legacy-projects');
  },

  _loadPage: function() {
    var db = this._getDb();
    this._setQuerying(true);
    if (!this.items) {
      this.set('items', []);
    }
    if (!this.opened) {
      this.opened = true;
    }
    db.allDocs(this.queryOptions)
    .then((response) => {
      if (response && response.rows.length > 0) {
        this.queryOptions.startkey = response.rows[response.rows.length - 1].key;
        this.queryOptions.skip = 1;
        response = response.rows.map((i) => i.doc);
        response = this._processResults(response);
        response.forEach((item) => {
          this.push('items', item);
        });
      }
      this._setQuerying(false);
    })
    .catch((e) => {
      this._setQuerying(false);
      this.fire('app-log', {
        message: ['Query history', e],
        level: 'error'
      });
      console.error('Query history', e);
    });
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

  _computeMethodClass: function(method) {
    if (!method) {
      return;
    }
    method = method.toLowerCase();
    var clazz = 'method ';
    switch (method) {
      case 'get':
      case 'post':
      case 'put':
      case 'delete':
      case 'patch':
        clazz += method;
        break;
    }
    return clazz;
  },

  _scrollHandler: function() {
    if (this.querying || !this.opened) {
      return;
    }
    var elm = this;
    if (!elm) {
      return;
    }
    var delta = elm.scrollHeight - (elm.scrollTop + elm.offsetHeight);
    if (delta < 120) {
      this._makeQuery();
    }
  },

  _updateProject: function(e, detail) {
    var p = detail.project;
    p.id = p._id;
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
    db.close().then(function() {
      console.log('The legacy-projects database has been closed.');
    });
  },

  _projectsListChanged: function(record) {
    if (!record || !record.base) {
      return;
    }
    if (record.path !== 'items.splices') {
      // Only when adding to the list
      return;
    }
    // Debounce the work since it will be called on each item insert (which is in a loop).
    this.debounce('items-list-changed-handler', function() {
      let items = this.items;
      if (!items || !items.length) {
        return;
      }
      var projectIds = items.map((item) => {
        return item._id;
      });
      this._findEmptyProjects(projectIds);
    }.bind(this), 200);

  },
  /**
   * The function will iterate over the request object keys and check
   * if projects has any request that exists.
   * If it doesn't exists it will mark it as a project without request.
   *
   * @param {Array<String>} projectIds A list of project IDs.
   */
  _findEmptyProjects: function(projectIds) {
    this.debounce('find-empty-projects', function() {
      if (!this._processEmptyWorker) {
        var blob = new Blob([this.$.emptyProjectsProcess.textContent]);
        this._processEmptyWorkerUrl = window.URL.createObjectURL(blob);
        this._processEmptyWorker = new Worker(this._processEmptyWorkerUrl);
        this._processEmptyWorker.onmessage =
          this._processWorkerResponse.bind(this);
      }
      this._processEmptyWorker.postMessage({
        projects: projectIds
      });
    }, 1500);
  },
  // Processes the response form the web worker.
  _processWorkerResponse: function(e) {
    var data = e.data;
    if (data.error) {
      return console.error(data.message);
    }
    this._setEmptyProjects(data.result);
  },
  // Updates the list of items and sets the `isEmpty` property.
  _setEmptyProjects: function(ids) {
    if (!ids || !ids.length) {
      return;
    }
    var list = this.items;
    list.forEach((item, i) => {
      if (ids.indexOf(item.id) !== -1) {
        this.set(['items', i, 'isEmpty'], true);
      }
    });
  },

  _computeHasItems: function(record) {
    if (!record || !record.base || !record.base.length) {
      return false;
    }
    return true;
  },

  _computeProjectSelected: function(pId, selected) {
    return pId === selected;
  },

  selectedProjectChanged: function(selectedProject) {
    if (!selectedProject) {
      return;
    }
    if (!this.opened) {
      this.opened = true;
    }
  },

  _computeShowEmptyMessage: function(hasItems, querying) {
    return !hasItems && !querying;
  }

});
