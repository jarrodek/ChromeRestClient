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
   * Common function for different transport implementations.
   *
   * @polymerBehavior ArcBehaviors.ArcRequestBehavior
   */
  window.ArcBehaviors.ArcRequestBehavior = {
    /**
     * Fired when error occured.
     *
     * @event error
     * @param {String} message An error message.
     */
    /**
     * Fired when the response object is ready.
     *
     * @event ready
     * @param {Object} response The response object.
     * @param {Object} request The request object.
     */
    properties: {
      // The request object.
      request: Object,
      // Restored / default timeout.
      timeout: Number
    },
    // Runs the request.
    run: function() {
      console.warn('The run function isd not implemented.');
    },

    // Get request timeout setting.
    getRequestTimeout: function() {
      return new Promise((resolve) => {
        chrome.storage.sync.get({'requestDefaultTimeout': 0}, (r) => {
          let t = Number(r.requestDefaultTimeout);
          if (t !== t) {
            t = 0;
          }
          let result = t * 1000; //to miliseconds.
          this.timeout = result;
          resolve(result);
        });
      });
    },

    serializeFiles: function(files) {
      if (files && files.length) {
        let promises = [];

        var fn = (fieldName, fileMime, str) => {
          return {
            fieldName: fieldName,
            mime: fileMime,
            file: str
          };
        };

        files.forEach((f) => {
          let files = f.files;
          for (var i = 0, len = files.length; i < len; i++) {
            let p = this.fileToString(files[i]).then(fn.bind(this, f.name, files[i].type));
            promises.push(p);
          }
        });
        return Promise.all(promises).then((result) => {
          if (!result) {
            return null;
          }
          var files = [];
          var _tmp = {};
          var _names = [];
          result.forEach((file) => {
            let fName = file.fieldName;
            delete file.fieldName;
            if (!(fName in _tmp)) {
              _tmp[fName] = [];
              _names.push(fName);
            }
            _tmp[fName].push(file);
          });
          _names.forEach((fieldName) => {
            files.push({
              name: fieldName,
              files: _tmp[fieldName]
            });
          });
          return files;
        });
      }
      return Promise.resolve(null);
    },

    fileToString: function(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = function(e) {
          resolve(btoa(e.target.result));
        };
        reader.onerror = function(e) {
          reject(e);
        };
        reader.readAsBinaryString(file);
      });
    }
  };

})();
