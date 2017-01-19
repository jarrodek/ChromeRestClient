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
 * A behavior with common methods to import a file into the Advanced REST Client application.
 *
 * @polymerBehavior ArcBehaviors.ArcImportBehavior
 */
window.ArcBehaviors.ArcImportBehavior = {
  properties: {
    /**
     * If set this is an error message to be displayed to the user.
     */
    importError: String,
    /**
     * Computed value, if true then error occurred and error message is set.
     */
    isImportError: {
      type: Boolean,
      value: false,
      computed: '_computeIsError(importError)'
    },
    /**
     * Processed ARC import data.
     */
    importData: Object,
    /**
     * Set to true when the `importData` is set.
     * It means that the ARC import data is ready.
     */
    isImportData: {
      type: Boolean,
      value: false,
      computed: '_computeIsData(importData)'
    },
    /**
     * A flag set when the data is currently being importing into the store.
     */
    importing: {
      type: Boolean,
      value: false
    }
  },
  // Computes if has error message.
  _computeIsError: function(importError) {
    return !!importError;
  },
  // Computes if has import data ready.
  _computeIsData: function(importData) {
    return !!importData;
  },
  /**
   * Resets the import data variables to original sate.
   */
  resetImport: function() {
    this.set('importError', undefined);
    this.set('importData', undefined);
  },
  /**
   * A function to be called when the content of a file has been read and it's ready to be
   * processed.
   *
   * This function will try to parse the file, check if this is the ARC export file and
   * will set `importData` to parsed object if data will pass all checkins.
   *
   * If there's an error or it's not the ARC file it will set `importError` property with the
   * message that can be displayed to the user as an error message. It will also set
   * `isImportError` flag to determine that there's an error.
   */
  processImportData: function(data) {
    this.resetImport();

    if (!data) {
      this.set('importError', 'Read file is empty');
      return;
    }
    var result;
    try {
      // Try ARC export file.
      result = JSON.parse(data);
    } catch (e) {
      console.error('File read error', e);
      this.fire('app-log', {
        'message': ['drop-file-importer::JSON', e],
        'level': 'error'
      });
      this.set('importError', 'Unable to read the file. Not a JSON.');
      return;
    }

    if (!this._isArcFile(result)) {
      this.set('importError', 'This is not the ARC export file.');
      return;
    }

    if (this._isOldImport(result)) {
      this.importData = {
        projects: [],
        requests: [result]
      };
      return;
    }

    this.importData = result;
  },

  /**
   * Checks if passed `object` is the ARC export data.
   *
   * @param {Object} object A parsed JSON data.
   * @return {Boolean} true if the passed object is an ARC file.
   */
  _isArcFile: function(object) {
    if (!object || !this.isObject(object)) {
      return false;
    }
    var isArcFile = false;
    if ('kind' in object) {
      // new systmes has 'kind' property set that begins with 'ARC#'
      if (object.kind.indexOf('ARC#') === 0) {
        isArcFile = true;
      }
    }
    if (!isArcFile) {
      // Old export syste does not have kind property. Have to check if it has required
      // properties.
      let arcEntries = ['projects', 'requests', 'history', 'url-history', 'websocket-url-history',
        'variables', 'headers-sets', 'auth-data', 'cookies'];
      for (let i = 0, len = arcEntries.length; i < len; i++) {
        if (arcEntries[i] in object) {
          isArcFile = true;
          break;
        }
      }
    }
    if (!isArcFile) {
      // In case of VERY old export file.
      if (this._isOldImport(object)) {
        isArcFile = true;
      }
    }
    return isArcFile;
  },
  /**
   * First export / import system had single request data only. This function checks if given
   * file is from this ancient system.
   *
   * @param {Object} object Decoded JSON data.
   */
  _isOldImport: function(object) {
    if (!(object.projects || object.requests || object.history)) {
      if ('headers' in object && 'url' in object && 'method' in object) {
        return true;
      }
    }
    return false;
  },
  /**
   * Checks if the passed argument is an Object.
   *
   * @param {any} object A value to test.
   */
  isObject: function(object) {
    return null !== object &&
      typeof object === 'object' &&
      Object.prototype.toString.call(object) === '[object Object]';
  },

  /**
   * Gets the data for given `variable` name from object.
   *
   * @param {Object} record Polymer's change record for an object
   * @param {String} variable Variable name (object's key) where the data is
   */
  _computeImportData: function(record, variable) {
    if (!record || !record.base) {
      return;
    }
    return record.base[variable];
  },

  /**
   * Imports the data.
   */
  _importFileData: function(data) {
    this.set('importing', true);

    this.async(function() {
      this.fire('send-analytics', {
        type: 'event',
        category: 'Settings usage',
        action: 'Import data',
        label: 'From file'
      });
    }, 1);
    try {
      return arc.app.importer.saveFileData(data)
      .then(() => {
        this.fire('data-imported');
        this.set('importing', false);
      })
      .catch((cause) => {
        this._handleException(cause);
      });
    } catch (e) {
      this._handleException(e);
      return Promise.resolve();
    }
  },

  _handleException: function(cause) {
    console.error('Import data error', cause);
    this.fire('app-log', {
      'message': ['Data import error: ', cause],
      'level': 'error'
    });
    this.fire('send-analytics', {
      type: 'exception',
      description: 'arc-data-import-controller' + cause.message,
      fatal: false
    });
    this.set('importError', 'Data import error. Message thrown: ' + cause.message);
    this.set('importing', false);
  }
};
})();
