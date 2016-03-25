(function() {
'use strict';

window.HeadersBehaviors = window.HeadersBehaviors || {};
/**
 * A `FillSupportBehavior` is a base behavior for headers fill support in the app.
 * The behavior exposes some common methods that must be implemented by alements that apply this
 * behavior.
 *
 * The elements should set host attribute `header-support` with lower case name of the header that
 * they support. If more than one header can be supported by this element their names should be
 * separated by space.
 *
 * Elements must implement `provideSupport()` function which will run the element. At the time
 * of calling this function the `target` property will be already set. This function should use this
 * property to read current state of the input field.
 *
 * The element should call `setValue()` function to finish support and update value of the header.
 *
 * @polymerBehavior HeadersBehaviors.FillSupportBehavior
 */
window.HeadersBehaviors.FillSupportBehaviorImpl = {

  hostAttributes: {
    'header-support': 'unknown'
  },

  properties: {
    /**
     * Current target (input) element that will receive a value.
     * @type {HTMLElement}
     */
    target: {
      type: HTMLElement
    },
    /**
     * A `<template>` model.
     * When the element is used inside `dom-repeat` it's not enought to pass only an input since
     * the change will not be propagaded in model. The caller function must set corresponding
     * model for `dom-repeat` template to set value properly.
     *
     * @type {Object}
     */
    model: {
      type: Object
    }
  },

  observers: [
    '_targetChanged(target, isAttached)'
  ],

  _targetChanged: function(target, isAttached) {
    if (!isAttached) {
      return;
    }
  },
  /**
   * Funtion to be implemented by elements.
   * Called when the user requested fill support for supported header.
   */
  provideSupport: function() {
    console.error('Header support not provided!');
  },
  /**
   * Sets a value to the text field and (if set) to the model.
   *
   * @param {String} value The value to set.
   */
  setValue: function(value) {
    if (this.model) {
      this.model.set('item.value', value);
    } else {
      this.target.value = value;
    }
    this.close();
    arc.app.analytics.sendEvent('Headers editor', 'Fill support', 'Value provided from ' +
      this.headerSupport);
  }
};
window.HeadersBehaviors.FillSupportBehavior = [
  HeadersBehaviors.FillSupportBehaviorImpl,
  Polymer.IronOverlayBehavior,
  Polymer.IronScrollTargetBehavior
];
})();
