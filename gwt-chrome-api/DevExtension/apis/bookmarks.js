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

/* globals chrome,gwt */
//mock bookmarks API
if (!chrome.bookmarks) {
  let functions = 'chrome.bookmarks.get(idOrIdList,callback);chrome.bookmarks.getChildren(id,' +
    'callback);chrome.bookmarks.getRecent(numberOfItems,callback);chrome.bookmarks.getTree' + 
    '(callback);chrome.bookmarks.getSubTree(id,callback);chrome.bookmarks.search(query,callback)' +
    ';chrome.bookmarks.create(bookmark,callback);chrome.bookmarks.move(id,destination,callback);' +
    'chrome.bookmarks.update(id,changes,callback);chrome.bookmarks.remove(id,callback);chrome.' + 
    'bookmarks.removeTree(id,callback);chrome.bookmarks.onCreated.addListener(callback);chrome.' + 
    'bookmarks.onRemoved.addListener(callback);chrome.bookmarks.onChanged.addListener(callback);' +
    'chrome.bookmarks.onMoved.addListener(callback);chrome.bookmarks.onChildrenReordered.' + 
    'addListener(callback);chrome.bookmarks.onImportBegan.addListener(callback);' + 
    'chrome.bookmarks.onImportEnded.addListener(callback)';

  gwt.dev.chrome.registerAPI(functions.split(';'));
}
