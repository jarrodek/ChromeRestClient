(function() {
'use strict';
/**
@license
Copyright 2016 Pawel Psztyc, The ARC team

Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
window.ArcBehaviors = window.ArcBehaviors || {};
/**
 * The `MenuListBehavior` contains common methods for menu quick lists views.
 *
 * The view renders list of history, saved and projects.
 *
 * The element is responsible for making a query to the databse. However it doesn't know
 * which database it should query. So the elements implementing this behavior must also
 * implement the `_getDb` function which returns a handler to the PolunchDb handler or populate the
 * `items` array by their own. In this case override the `_makeQuery` function which
 * will be called when the data are requested. Remember to manage the pagination by yourself.
 *
 * Element must implement the `_acceptSelection` function which will be called when the element was
 * tapped, clicked, key entered or any other method acceptable by accessibility. The value of
 * selected item should be in: `this.items[this.selectedItemIndex];`
 *
 * The list that keeps the data must sets the `selectedItemIndex` property to currently selected
 * index.
 *
 * @polymerBehavior ArcBehaviors.MenuListBehavior
 */
window.ArcBehaviors.MenuListBehaviorImpl = {
  properties: {
    /**
     * Currently selected item's index on items list.
     */
    selectedItemIndex: {
      type: Number,
      value: 0
    },
    /**
     * A target for the scroll.
     * Should be this element. When the scroll will be near the end it will ask to load more
     * results.
     * The behavior implements `_scrollHandler` function from `Polymer.IronScrollTargetBehavior`
     * behavior. It takes the `scrollTarget` and computes if the call to the `_makeQuery` function
     * is needed.
     */
    scrollTarget: {
      type: Object,
      value: function() {
        return this;
      }
    },
    /**
     * History items found in the datastore.
     */
    items: Array,
    // Computed value, true if the `items` property has values.
    hasItems: {
      type: Boolean,
      value: false,
      computed: '_computeHasItems(items.*)'
    },
    // True when the element is attached to DOM.
    isAttached: Boolean,
    // True when the element is querying the database for the data.
    querying: {
      type: Boolean,
      value: true,
      readOnly: true
    },
    /**
     * Database query options for pagination.
     * Override this value to change the query options like limit of the results in one call.
     *
     * This is query options passed to the PouchDB `allDocs` function. Note that it will not
     * set `include_docs` option. A conviniet shortcut is to set the the `includeDocs` property
     * and the directive will be added automatically.
     */
    queryOptions: {
      type: Object,
      readOnly: true,
      value: function() {
        return {
          limit: 25,
          descending: true
        };
      }
    },
    /**
     * If set it will add the `include_docs` directive to the PouchDB database query options.
     */
    includeDocs: Boolean,
    /**
     * Should be set to true by parent element if this element has been opened.
     */
    opened: {
      type: Boolean,
      notify: true,
      value: false
    },
    /**
     * Computed value. True means that the query ended and there's no results.
     * It is set to false when there are items or query is running.
     */
    dataUnavailable: {
      type: Boolean,
      value: false,
      computed: '_computeDataUnavailable(hasItems, querying)'
    }
  },

  observers: [
    '_updateQueryOptions(includeDocs, queryOptions)',
    '_resetOnClosed(opened)',
    '_notifyList(opened)',
    '_notifyList(hasItems)',
    '_notifyList(querying)'
  ],

  listeners: {
    'tap': '_acceptSelection'
  },

  /**
   * This function will be called automatically when both `queryOptions` and `includeDocs`
   * are set or changed. By default the `includeDocs` property is not set so it won't be called
   * until set.
   *
   * Updates the `queryOptions` to set the `include_docs` directive if `includeDocs` is set.
   */
  _updateQueryOptions: function(includeDocs) {
    // jscs:disable
    if (includeDocs) {
      this.queryOptions.include_docs = true;
    } else {
      delete this.queryOptions.include_docs;
    }
    // jscs:enable
  },
  /**
   * Resets the state of the variables.
   */
  reset: function() {
    if (!this.queryOptions) {
      return; // not ready
    }
    delete this.queryOptions.startkey;
    delete this.queryOptions.skip;
    this._setQuerying(false);
    this.set('items', []);
    this.set('selectedItemIndex', -1);
  },
  /**
   * By default the element will clean up the data when it's closed (by calling `reset()` function).
   * To prevent this behavior override this function.
   * Also this function calls the `_makeQuery` when the element is opened.
   */
  _resetOnClosed: function(opened) {
    if (opened) {
      this._makeQuery();
      return;
    }
    this.reset();
  },
  /**
   * Call it to refresh the data from the datastore.
   * It will reset query options, clear items and make a query.
   */
  refresh: function() {
    this.reset();
    this._makeQuery();
  },
  /**
   * Called every time the element changed it's scroll position. It will call the `_makeQuery`
   * function when there's less than 120px left to scroll. (also it must be opened and must not
   * already querying).
   */
  _scrollHandler: function() {
    if (this.querying || !this.opened) {
      return;
    }
    var elm = this.scrollTarget;
    if (!elm) {
      return;
    }
    var delta = elm.scrollHeight - (elm.scrollTop + elm.offsetHeight);
    if (delta < 120) {
      this._makeQuery();
    }
  },

  _acceptSelection: function() {
    console.warn('The `_acceptSelection` function is not implemented in ' +
      this.nodeName.toLowerCase());
  },
  /**
   * Returns a handler to the database.
   * Elements should override this method.
   */
  _getDb: function() {
    console.warn('The `_getDb` function is not implemented in ' +
      this.nodeName.toLowerCase());
    return null;
  },
  /**
   * The function to be called when new query for data is needed.
   * Override this function instead of `_loadPage`.
   */
  _makeQuery: function() {
    this.debounce('menu-load-page', this._loadPage, 20);
  },
  /**
   * Performs the query and processes the result.
   * The results will be passed to the `_processResults` function and the result if this function
   * will be set to the `items` array. The argument is list of documents received from the
   * PoluchDB query (not the result!).
   *
   * Because Polymer doesn't have `concat` function to add list of items to other list and
   * notify listeners, this element will add each item one-by-one. But it's the most efficient
   * way to do this.
   */
  _loadPage: function() {
    var db = this._getDb();
    if (!db) {
      // Not implemented in the elemnent.
      return;
    }
    this._setQuerying(true);
    // if (!this.items) {
    //   this.set('items', []);
    // }

    // if (!this.opened) {
    //   this.opened = true;
    // }

    db.allDocs(this.queryOptions)
    .then((response) => {
      this._setQuerying(false);
      if (response && response.rows.length > 0) {
        // Set up pagination.
        this.queryOptions.startkey = response.rows[response.rows.length - 1].key;
        this.queryOptions.skip = 1;
        // Get the results, depending on the `includeDocs` it can be Object or String.
        let useDocs = this.includeDocs === true;
        let res = response.rows.map((i) => useDocs ? i.doc : i.id);
        // Ask elements to process the results.
        res = this._processResults(res);

        if (!this.items || this.items.length === 0) {
          this.set('items', res);
        } else {
          res.forEach((item) => {
            this.push('items', item);
          });
        }
      }
    })
    .catch((e) => {
      this._setQuerying(false);
      this.fire('app-log', {
        message: ['Query menu items', e],
        level: 'error'
      });
      console.error('Query menu items', e);
    });
  },
  /**
   * A function to be implemented by elements.
   * After making a query and when the results become available, this function will be called
   * to process the array before setting it in the `items` array.
   *
   * Result will be passed to the items array.
   *
   * @param {Array<Object|String>} res List of docs returned by the PouchDB query. If the
   * `includeDocs` property is set, then it will contain objects (full documents). Otherwise it
   * will contain entries IDs only.
   * @return {Array<Object>} Processed list to be passed to the `items` array.
   */
  _processResults: function(res) {
    return res;
  },
  // Computes value for the `hasItems` property.
  _computeHasItems: function(record) {
    if (!record || !record.base || !record.base.length) {
      return false;
    }
    return true;
  },

  /**
   * Compytes CSS class name for the HTTP method label.
   *
   * @param {String} method an HTTP method name.
   * @return {String} CSS class name always starting with the `method` class.
   */
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
  // Computes value for the `dataUnavailable` property.
  _computeDataUnavailable: function(hasItems, querying) {
    return !hasItems && !querying;
  },

  /**
   * Finds an element in event's path that contains a dataset property (`name` attribute)
   * and returns it if found.
   *
   * The element that contains the ropery should have the `data-PROPERTY-NAME="VALUE"` set on it.
   *
   * @param {Event} e A HTML event.
   * @param {String} name A property name to look for
   * @return {String|undefined} A property value or undefined if not found
   */
  _findDataInPath: function(e, name) {
    var path = e.path;
    if (!path || !path.length) {
      return;
    }
    var value;
    while (path.length) {
      var elm = path.shift();
      if (elm.nodeType !== 1) {
        continue;
      }
      if (elm.dataset && elm.dataset[name]) {
        value = elm.dataset[name];
        break;
      }
    }
    return value;
  },

  /**
   * Computes command label depending on a OS.
   * For Mac it will be cmd + `key` and for the rest of the World it will be ctrl + `key`.
   *
   * @param {String} key The key combination as a sufix after the command key
   * @return {String} Full command to display in command label.
   */
  _computeA11yCommand: function(key) {
    var isMac = navigator.platform.indexOf('Mac') !== -1;
    var cmd = '';
    if (isMac) {
      cmd += 'meta+';
    } else {
      cmd += 'ctrl+';
    }
    cmd += key;
    return cmd;
  },

  _notifyList: function(state) {
    if (state) {
      this.notifyResize();
    }
  }
};
window.ArcBehaviors.MenuListBehavior = [
  window.Polymer.IronScrollTargetBehavior,
  window.Polymer.IronResizableBehavior,
  window.ArcBehaviors.MenuListBehaviorImpl
];
})();
