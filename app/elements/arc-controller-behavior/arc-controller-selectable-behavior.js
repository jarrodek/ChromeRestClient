'use strict';

window.ArcBehaviors = window.ArcBehaviors || {};
/** @polymerBehavior */
ArcBehaviors.ArcControllerSelectableBehaviorImpl = {
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
     * All controller pages will have `opened` attribute set by parent `neon-animated-pages`
     * when the controller is selected.
     * The app can't cancel this behavior since it is controlled by different component.
     * TODO: make it possible to stop from switching the page and make use of
     * `mayStop()` function.
     * TODO: `mayStop()` should be a promise so the component may perform async tasks before
     * it will close.
     */
    opened: {
      type: Boolean,
      notify: true,
      observer: '_onOpenedChanged'
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
      if (this.mayStop()) {
        this.onHide();
        this.isShowing = false;
        if (this.releaseFeatures) {
          this.releaseFeatures();
        }
      }
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

ArcBehaviors.ArcControllerSelectableBehavior = [
  ArcBehaviors.ArcControllerSelectableBehaviorImpl,
  Polymer.NeonAnimatableBehavior,
  Polymer.IronResizableBehavior
];
