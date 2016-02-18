'use strict';

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
 * @polymerBehavior ArcControllerBehavior
 */
ArcBehaviors.ArcControllerBehaviorImpl = {

};
ArcBehaviors.ArcControllerBehavior = [
  ArcBehaviors.ArcControllerBehaviorImpl,
  ArcBehaviors.ArcControllerSelectableBehavior,
  ArcBehaviors.ArcHasToolbarBehavior
];
