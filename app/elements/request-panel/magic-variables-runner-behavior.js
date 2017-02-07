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
 *
 * @polymerBehavior ArcBehaviors.ArcMagicVariablesRunnerBehavior
 */
window.ArcBehaviors.ArcMagicVariablesRunnerBehavior = {

  _checkMagicVariablesEnabled: function() {
    return new Promise((resolve) => {
      chrome.storage.sync.get({'MAGICVARS_ENABLED': true}, (r) => {
        resolve(r.MAGICVARS_ENABLED);
      });
    });
  },
  /**
   * Applies magic variables to the request if enabled.
   *
   * @param {Object} request A request object
   * @return {Promise<Object>} A promise that resolves to the request object.
   */
  applyMagicVariables: function(request) {
    return this._checkMagicVariablesEnabled()
    .then((enabled) => {
      if (!enabled) {
        return request;
      }
      return this._applyMagicVariables(request)
      .then((request) => {
        this.$.magicVariables.clear();
        return request;
      })
      .catch((e) => {
        this.fire('app-log', {
          'message': ['Magic variables', e],
          'level': 'error'
        });
        return request;
      });
    });
  },

  _applyMagicVariables: function(request) {
    this.$.magicVariables.clear();
    this.$.magicVariables.environment = this.currentEnvironment || 'default';
    return this._applyMagicVariablesUrl(request)
    .then((request) => this._applyMagicVariablesHeaders(request))
    .then((request) => this._applyMagicVariablesPayload(request));
  },

  _applyMagicVariablesUrl: function(request) {
    this.$.magicVariables.value = request.url;
    return this.$.magicVariables.parse()
    .then((result) => {
      request.url = result;
      return request;
    });
  },

  _applyMagicVariablesHeaders: function(request) {
    this.$.magicVariables.value = request.headers;
    return this.$.magicVariables.parse()
    .then((result) => {
      request.headers = result;
      return request;
    });
  },

  _applyMagicVariablesPayload: function(request) {
    if (request.payload instanceof MultipartFormData) {
      return this._applyVariablesFormData(request);
    } else if (typeof request.payload !== 'string') {
      return Promise.resolve(request);
    }

    this.$.magicVariables.value = request.payload;
    return this.$.magicVariables.parse()
    .then((result) => {
      request.payload = result;
      return request;
    });
  },

  _applyVariablesFormData: function(request) {
    var data = [];
    for (let part of request.payload.values()) {
      // Value is instance of MultipartMessagePart
      // Transform it to simple object
      let obj = {
        name: part.name,
        orig: {
          name: part.name // this won't be changed
        }
      };
      if (!part.isFile) {
        obj.value = part.value;
        obj.mime = part.mime;
      }
      data.push(obj);
    }
    if (!data || !data.length) {
      return Promise.resolve(request);
    }
    return this._applyVariablesFormDataArray(data)
    .then((results) => {
      let body = request.payload;
      results.forEach((result) => {
        let part = body.getPart(result.orig.name);
        body.delete(result.orig.name);
        part.name = result.name;
        if (!part.isFile) {
          part.value = result.value;
          part.mime = result.mime;
        }
        request.payload.setPart(result.name, part);
      });
      request.payload = body;
      return request;
    });
  },

  _applyVariablesFormDataArray: function(parts, results) {
    results = results || [];
    if (!parts.length) {
      return Promise.resolve(results);
    }
    var part = parts.shift();
    return this._applyVariablesFormDataPart(part)
    .then((result) => {
      results.push(result);
    })
    .then(() => this._applyVariablesFormDataArray(parts, results));
  },

  _applyVariablesFormDataPart: function(part) {
    this.$.magicVariables.value = part;
    return this.$.magicVariables.parse();
    //
    // this.$.magicVariables.value = part.name;
    // return this.$.magicVariables.parse()
    // .then((result) => {
    //   part.name = result;
    //   if (part.file) {
    //     return part;
    //   }
    //   this.$.magicVariables.value = part.value;
    //   return this.$.magicVariables.parse();
    // })
    // .then((result) => {
    //   if (part.file) {
    //     // File type has only name.
    //     return part;
    //   }
    //   // This will have value as well.
    //   part.value = result;
    //   this.$.magicVariables.value = part.contentType;
    //   return this.$.magicVariables.parse();
    // })
    // .then((result) => {
    //   if (part.file) {
    //     // File type has only name.
    //     return part;
    //   }
    //   // This will have value as well.
    //   part.contentType = result;
    //   return part;
    // });
  }
};
})();
