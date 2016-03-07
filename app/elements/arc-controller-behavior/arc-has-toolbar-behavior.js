'use strict';
window.ArcBehaviors = window.ArcBehaviors || {};

/**
 * This behavior should be used to request specific options in the main toolbar.
 * It should be used with ArcControllerBehavior.
 *
 * ## Page title
 * To set up page title the element should use `_setPageTitle ` setter:
 * `this._setPageTitle('Page title');`
 *
 * ## Features
 * Some components may need to use main toolbar as a placeholder for ecreen's actions
 * (like open, save, clear etc). The component must then implement on[Name] method
 * and this method will be called when a feature will be used.
 * Currently supported featutres are:
 *  * open
 *  * save
 *  * export
 *  * clearAll
 *  * search
 *
 * @example
 * this.toolbarFeatures = ['search', 'save'];
 * ...
 * onSearch: function(e) {},
 * onSave: function(e) {},
 * ...
 *
 * @polymerBehavior
 */
ArcBehaviors.ArcHasToolbarBehavior = {
  /**
   * An event called when the title changed
   *
   * @event page-title-changed
   * @property {String} title New title to set
   */
  /**
   * Request a features to be visible.
   *
   * @event request-toolbar-features
   * @property {Array<String>} A list of features.
   */
  /**
   * Remove previously requested features requested.
   *
   * @event release-toolbar-features
   */
  properties: {
    /**
     * A screen title to be set in toolbar panel.
     */
    pageTitle: {
      type: String,
      readOnly: true,
      observer: '_pageTitleChanged'
    },
    /**
     * An element may request features from the main toolbar.
     * This property contains a list of features names to request.
     *
     * @type {Array<String>} features A list of features to request.
     */
    toolbarFeatures: {
      type: Array,
      value: []
    },

    hasToolbarFeatures: {
      type: Boolean,
      computed: '_computeToolbarFeatures(toolbarFeatures.*)'
    }
  },
  /**
   * This function is called automatically when page title changed.
   * It will fire an event to notify listeners about page title change.
   *
   * Page title change observers are located in main (bootstrapnig) js file.
   */
  _pageTitleChanged: function() {
    this.fire('page-title-changed', {
      title: this.pageTitle
    }, {
      cancelable: true
    });
  },

  _computeToolbarFeatures: function() {
    return this.toolbarFeatures.length !== 0;
  },
  /**
   * This function will be automatically called when the element also is
   * `ArcControllerBehavior`. It will request features from `toolbarFeatures`
   * when the element shows.
   */
  requestFeatures: function() {
    if (!this.hasToolbarFeatures) {
      return;
    }
    this.fire('request-toolbar-features', {
      features: this.toolbarFeatures
    }, {
      cancelable: true
    });
  },
  /**
   * Fequest to remove previously requested features.
   */
  releaseFeatures: function() {
    this.fire('release-toolbar-features', {}, {
      cancelable: true
    });
  }
};
