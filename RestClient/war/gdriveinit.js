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
 * Initialize Google Drive app.
 * This library will be called when the user open ARC via Drive UI.
 * It should open the app and requested file.
 */
window.addEventListener('load', function() {

  var info = document.querySelector('.noARCInstalled');
  if (info) {
    info.parentNode.removeChild(info);
  }

  var query = window.location.search.replace('?state=', '');
  if (!query) {
    return;
  }
  query = decodeURIComponent(query);
  if (!query) {
    return;
  }
  try {
    query = JSON.parse(query);
  } catch (e) {
    return;
  }
  if (query.action) {
    switch (query.action) {
      case 'create':
        //query.folderId && 
        chrome.extension.sendMessage({
          'payload': 'gdrive',
          'params': query
        }, function(response) {
          if (response.assignUrl) {
            window.location.assign(response.assignUrl);
          }
        });
        break;
      case 'open':
        chrome.extension.sendMessage({
          'payload': 'gdrive',
          'params': query
        }, function(response) {
          if (response.assignUrl) {
            window.location.assign(response.assignUrl);
          }
        });
        break;
    }
  }
}, false);
