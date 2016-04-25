(function () {
'use strict';
/*******************************************************************************
 * Copyright 2012 Pawel Psztyc
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 ******************************************************************************/

/**
 * A base object for all types with helper methods.
 */
class StatusNotification {

  static get TIME_SHORT() {
    return 3000;
  }
  static get TIME_MEDIUM() {
    return 7000;
  }
  static get TIME_LONG() {
    return 12000;
  }
  static get TIME_INFINITY() {
    return 0;
  }

  /**
   * Special type of notification when the user see a message and have more than one option
   * to click. Status element will always include "dismiss" message.
   *
   * @param {Object} opts Initialization object:
   *  {
   *    "message": "A message to show",
   *    "timeout": "An optional number of milliseconds. Default to StatusNotification.TIME_SHORT",
   *    "actionName": "Optional but must be set with callback function. A label to display."
   *  }
   * @param {Function} callback Optional function to call when the user click on the action button.
   */
  static notify(opts, callback) {
    if (callback && !opts.actionName) {
      throw new Error('You need to set `actionName` option when setting callback');
    }
    if (!opts.timeout && opts.timeout !== 0) {
      opts.timeout = StatusNotification.TIME_SHORT;
    }
    var toast;
    try {
      toast = document.querySelector('paper-toast[text="' + opts.message + '"]');
    } catch (e) {}
    var isCallback = (!!callback);
    if (!toast) {
      toast = document.createElement('paper-toast');
      toast.classList.add('status-toast');
      //toast.autoFitOnAttach = true;
      //toast.withBackdrop = true;
      toast.text = opts.message;
      toast.duration = opts.timeout;
      let label = document.createElement('paper-button');
      label.innerText = isCallback ? opts.actionName : 'Close';
      let fn = function() {
        label.removeEventListener('click', fn);
        toast.close();
        if (isCallback) {
          callback();
        }
      };
      label.addEventListener('tap', fn);
      toast.appendChild(label);
      document.body.appendChild(toast);
    } else {
      //replace action
      let label = Polymer.dom(toast.root)
        .querySelector('paper-button');
      let fn = function() {
        label.removeEventListener('click', fn);
        toast.close();
        if (isCallback) {
          callback();
        }
      };
      label.addEventListener('tap', fn);
    }
    toast.open();
  }
}
window.StatusNotification = StatusNotification;
}());
