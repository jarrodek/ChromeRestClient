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
/* global chrome */
/**
 * Advanced Rest Client namespace
 *
 * @namespace
 */
window.arc = window.arc || {};
/**
 * ARC app's namespace
 *
 * @namespace
 */
arc.app = arc.app || {};
/**
 * A namespace for the clipboard functions.
 *
 * @namespace
 */
arc.app.clipboard = arc.app.clipboard || {};

arc.app.clipboard.write = function(data) {
  chrome.permissions.contains({
    permissions: ['clipboardWrite']
  }, (status) => {
    if (status) {
      arc.app.clipboard._write(data);
    } else {
      chrome.permissions.request({
        permissions: ['clipboardWrite']
      }, (granted) => {
        if (granted) {
          arc.app.clipboard._write(data);
        }
      });
    }
  });
};

arc.app.clipboard._write = function(data) {
  var clipboardholder = document.createElement('textarea');
  document.body.appendChild(clipboardholder);
  clipboardholder.value = data;
  clipboardholder.select();
  document.execCommand('copy');
  clipboardholder.parentNode.removeChild(clipboardholder);
};
}());
