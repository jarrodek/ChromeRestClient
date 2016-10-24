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
 * A behavior that makes pagination easier.
 * An element that use this behavior must implement `queryPage` function
 * that performs a query to the store and should call `computeScroll` function
 * when the scrollable element has been scrolled.
 * When the scrollable element reach `scrollMargin` disctance to the bottom the
 * `queryPage` function will be called.
 * Implementation should perform a query and after finish and when results arrive
 * call `appendResults(results)`. Then data will be available in `this.listData` array.
 *
 * ARC controllers should call `resetQuery` function in `onHide` function.
 *
 * @example
 *     // scrollable element in the list view
 *     <scrollable on-scroll="_scrolled"></scrollable>
 *     <template is="dom-repeat" items="{{listData}}">(...)</template>
 *
 *     // in element's logic
 *     _scrolled: function(e) {
 *       this.computeScroll(e.target);
 *     },
 *     queryPage: function() {
 *       queryData(this.offset, this.limit).then((data) => {
 *         this.appendResults(data);
 *       });
 *     }
 *
 * @polymerBehavior ArcBehaviors.ListControllerBehavior
 */
window.ArcBehaviors.ListControllerBehavior = {
  properties: {
    /**
     * Data resulted by the query.
     *
     * @type {Any}
     */
    listData: {
      type: Array,
      value: function() {
        return [];
      }
    },
    /**
     * Current data offset.
     *
     * @type {Number}
     */
    offset: {
      type: Number,
      value: 0,
      computed: '_computeOffset(page)'
    },
    /**
     * Number of items per query (per page).
     *
     * @type {Number}
     */
    limit: {
      type: Number,
      value: 50
    },
    /**
     * Current page. After performing a query by `queryPage` implementation
     * it should be imcremeted.
     *
     * @type {Number}
     */
    page: {
      type: Number,
      value: 0
    },
    /**
     * A margin in pixels after which passing the query should be performed.
     *
     * @type {Number}
     */
    scrollMargin: {
      type: Number,
      value: 200
    },
    /**
     * A `queryPage` implementation should use it to check if query should be performed.
     *
     * @type {Boolean}
     */
    hasMore: {
      type: Boolean,
      value: true
    },
    /**
     * True if query is now performed.
     * A `queryPage` implementation should set it to false if not using `appendResults` function
     * and after query function finish. `queryPage` function won't be called again otherwise.
     *
     * @type Boolean
     */
    querying: {
      type: Boolean,
      readOnly: true,
      value: false
    },
    /**
     * True if any data are available on the list.
     *
     * @type {Boolean}
     */
    hasListData: {
      type: Boolean,
      value: false,
      computed: '_computeHasListData(listData)'
    },
    /**
     * A search term from search bar.
     */
    searchQuery: {
      type: String,
      reflectToAttribute: true
    },

    isEmpty: {
      type: Boolean,
      value: true,
      readOnly: true
    },

    //True if the search query has been applied
    isSearch: {
      type: Boolean,
      value: false,
      readOnly: true,
      notify: true
    }
  },

  observers: [
    '_updateIsEmpty(querying,listData)'
  ],

  /**
   * Compute query offset based on current page.
   */
  _computeOffset: function(page) {
    return page * this.limit;
  },
  /** Compute if there are elements on the list */
  _computeHasListData: function(data) {
    return !!data && data.length > 0;
  },

  _updateIsEmpty: function(querying, listData) {
    this._setIsEmpty(!querying && (!listData || listData.length === 0));
  },
  /**
   * Child element should override this function to perform a query.
   */
  queryPage: function() {},
  /**
   * Compute scroll distance and run query if scroll passed `scrollMargin`.
   * This function will run `queryPage` function when scroller distance to the bottom end\
   * is less than `scrollMargin`.
   *
   * @param {HTMLElement} scroller An element that is scrollable.
   */
  computeScroll: function(scroller) {
    if (!this.hasMore || this.querying) {
      return;
    }
    var ending = scroller.scrollHeight - scroller.scrollTop - this.scrollMargin <=
      scroller.offsetHeight;
    if (ending) {
      console.log('_setQuerying(true)');
      this._setQuerying(true);
      this.queryPage();
    }
  },
  /**
   * Append new results to the list of results `listData`.
   *
   * @param {Array<Any>} results list of results.
   */
  appendResults: function(results) {
    this.page++;
    if (!results || !results.length) {
      this.hasMore = false;
    } else {
      if (!this.listData) {
        this.listData = [];
      }
      this.set('listData', this.listData.concat(results));
    }
    this._setQuerying(false);
  },
  /**
   * Reset data to initial state.
   */
  resetQuery: function() {
    this._setIsSearch(false);
    this.listData = [];
    this.page = 0;
    this.hasMore = true;
    this._setQuerying(false);
    this.pagination = {
      limit: this.limit,
      dir: this.sortDirection,
      field: this.sortBy
    };
  },
  /**
   * Resets current query and perform a new query with new criteria.
   */
  onSearch: function() {
    this.resetQuery();
    this._setIsSearch(true);
    this.queryPage();
  },
  /**
   * Should be implemented by page controllers
   */
  onClearAll: function() { /* ... */ }
};
})();
