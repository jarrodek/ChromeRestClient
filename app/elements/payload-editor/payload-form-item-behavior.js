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
 * A common functions for payload form editors.
 *
 * @polymerBehavior ArcBehaviors.ArcPayloadFormItemBehavior
 */
window.ArcBehaviors.ArcPayloadFormItemBehaviorImpl = {
  properties: {
    name: {
      type: String,
      notify: true
    }
  },

  /**
   * Sends an event to the parent form to remove the control from the form.
   */
  removeItem: function() {
    this.fire('remove-item', null, {
      bubbles: false
    });
  }
};
window.ArcBehaviors.ArcPayloadFormItemBehavior = [
  Polymer.IronFormElementBehavior,
  Polymer.IronValidatableBehavior,
  window.ArcBehaviors.ArcPayloadFormItemBehaviorImpl
];
})();
