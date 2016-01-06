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

/* globals chrome, gwt */
//mock i18n API
if (!chrome.i18n) {
  let functions = 'chrome.i18n.getAcceptLanguages(callback);' +
    'chrome.i18n.getMessage(messageName,substitutions);' +
    'chrome.i18n.getUILanguage();' +
    'chrome.i18n.detectLanguage(text,callback)';
  gwt.dev.chrome.registerAPI(functions.split(';'));
}
