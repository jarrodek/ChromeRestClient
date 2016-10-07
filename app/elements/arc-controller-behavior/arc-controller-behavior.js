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
 * Common behavior for components pages.
 *
 * ## Notes for component pages
 * Component pages should attach DOM event listeners in regular Polymer way
 * in Polymer life cycle methods like `attached` or `ready`. However a controller startup logic
 * Should be performed in ARC controller life cycle methods.
 *
 * ## Lifecycle callbacks
 * Besides Polymer's lifecycle callback ARC controllers have their own callbacks.
 * All components are attached to the DOM at application startup. It's fast when the user
 * is switching between app's views but may affect startup time.
 * Only one component page is visible at the time so there's no need to pull data from the DB
 * at `ready` or `attached` callback. Help will comes from ARC lifecycle callbacks.
 *
 * ### onShow
 * This function will be called when the controller is about to be shown.
 * This function is designed to perform any initialization task for controller. It should not
 * however be used to attach DOM event handlers.
 *
 * ### onHide
 * This function will be called when the controller is about to be hidden.
 * Controller itself will stay in DOM tree so it should not be used to remove event handlers.
 *
 * ### mayStop
 * This function will be called just before `onHide` function. If this function will not return
 * Boolean `true` the `onHide` function will not be called.
 * This function is designed to prohibit page change (controller change) if there are some
 * pending tasks or unsaved data. However because of an issue in `neon-animated-pages`
 * (https://github.com/PolymerElements/neon-animation/issues/130) it can't be done right now.
 * This function is called synchronously so async tasks will not work here.
 *
 * @polymerBehavior ArcBehaviors.ArcControllerBehavior
 */
window.ArcBehaviors.ArcControllerBehaviorImpl = {
  /**
   * Fired when controller page is selected and will be shown.
   *
   * @event arc-controller-select
   */
  /**
   * Fired when controller page is deselected and will be hidden.
   *
   * @event arc-controller-deselect
   */
  properties: {
    /**
     * `neon-animated-pages` sets the `opened` attribute when selection has changed. It's set in
     * `neon-animated-pages` to automate ARC controllers life cycle methods and it can't be changed
     * from the component.
     *
     * When set to true the component page has been shown by the `neon-animated-pages` page and
     * component's `onShow()` function was called.
     *
     * TODO:200 make it possible to stop from switching the page and make use of `mayStop()`
     * function.
     * TODO:90 `mayStop()` should be a promise so the component may perform async tasks before
     * it will close.
     */
    opened: {
      type: Boolean,
      notify: true,
      observer: '_onOpenedChanged'
    },
    /**
     * True if the component is visible in the UI.
     *
     * It is different from `opened` attribute because it will change status when `onShow()` and
     `onHide()` function has been called.
     *
     * @type Boolean
     */
    isShowing: {
      type: Boolean,
      notify: true,
      value: false
    }
  },
  /**
   * A handler to be called when the controller selection change.
   * If the controller is deselected, `onHide` function will be called only when
   * `mayStop` function return true.
   */
  _onOpenedChanged: function() {
    if (this.opened) {
      this.onShow();
      this.isShowing = true;
      if (this.requestFeatures) {
        this.requestFeatures();
      }
    } else {
      this.onHide();
      this.isShowing = false;
      if (this.releaseFeatures) {
        this.releaseFeatures();
      }
      // mayStop() logic has been moved to router.
      // if (this.mayStop()) {
      //
      // }
    }
  },
  /**
   * Function to be implemented in controller component.
   * It will be called when the controller will be selected.
   */
  onShow: function() { /**/ },
  /**
   * Function to be implemented in controller component.
   * It will be called when the controller will be de-selected.
   */
  onHide: function() { /**/ },
  /**
   * Function to be implemented in controller component.
   * Controller will not call onHide function until this function return true.
   */
  mayStop: function() {
    return true;
  }
};
window.ArcBehaviors.ArcControllerBehavior = [
  ArcBehaviors.ArcControllerBehaviorImpl,
  Polymer.NeonAnimatableBehavior,
  Polymer.IronResizableBehavior,
  ArcBehaviors.ArcHasToolbarBehavior
];
})();
