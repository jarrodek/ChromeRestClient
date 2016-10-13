(function() {
'use strict';
/**
 * This element is to upgrade the database to new specification required for future changes.
 *
 * First at all it will keep old data intact. It creates new datastores and attept to copy
 * data to new location. It will not destroy old databases after transition.
 *
 * This script will ba also used to indert import files from a legacy system.
 */
Polymer({
  is: 'app-db-upgrade-1016',

  ready: function() {
    this.initUpgrade();
  },

  initUpgrade: function() {
    arc.app.importer.prepareExport()
    .then((data) => this.parsePackage(data)).catch((e) => {
      console.error(e);
    });
  },

  parsePackage: function(data) {
    // In new structure projects do not have a refference to request ids.
    // It's the other way around. It's a bad pattern for object stores but
    // it must suffice for now.
    var projects = data.projects;
    // Requests are de-centralized. History is placed in it's own store, saved the same.
    // Also HAR data is stored in it's own store where each HAR objects is another data object.
    var requests = data.requests;
    this.prepareRequestsArrays(requests)
    .then((result) => this._assignProjects(result, projects));
  },
  // Returns an array of saved, history and har objects.
  prepareRequestsArrays: function(requests) {
    return new Promise((resolve, reject) => {
      this._parsePartRequests(requests, resolve, reject);
    });
  },
  /**
   * To give a browser a chance to enter to the main loop the work is split to chunks.
   * With this approach the app will not block main thread and will not show "ANR" screen.
   *
   *
   */
  _parsePartRequests: function(requests, resolve, reject, saved, history, har, external) {
    saved = saved || [];
    history = history || [];
    har = har || [];
    external = external || [];
    if (requests.length === 0) {
      resolve({
        saved: saved,
        history: history,
        har: har,
        external: external
      });
      return;
    }
    var len = Math.min(requests.length, 200);
    // Up to 200 loop iteration at once.
    // Then the function return and release main loop.
    for (let i = 0; i < len; i++) {
      let item = requests[i];
      if (item.type === 'history') {
        let result = this._parseHistoryItem(item);
        history.push({
          origin: result.originId,
          request: result.request
        });
        har = har.concat(result.historyData);
      } else if (item.type === 'saved') {
        let result = this._parseSavedItem(item);
        saved.push({
          origin: result.originId,
          request: result.request
        });
        har = har.concat(result.historyData);
      } else if (item.type === 'drive') {
        let result = this._parseDriveItem(item);
        external.push({
          origin: result.originId,
          request: result.request
        });
        har = har.concat(result.historyData);
      }
    }
    requests.splice(0, len);
    this.async(() => {
      this._parsePartRequests(requests, resolve, reject, saved, history, har, external);
    }, 1);
  },
  /**
   * Parser for the history request
   * ## The history request object.
   * The request object is consisted with following properties:
   * - _id: url + '/' + method + '/' + date
   * - url: String
   * - method: String
   * - headers: String
   * - payload: String
   * - created: time
   * @return {Object|null}
   */
  _parseHistoryItem: function(item) {
    var obj = {
      _id: encodeURIComponent(item.url) + '/' + item.method + '/' + item.updateTime,
      method: item.method,
      url: item.url
    };
    // payload and headers
    var entries = item.har.entries;
    var entry = entries[entries.length - 1];
    if (entry) {
      let harRequest = entry.request;
      obj.headers = this._parseHarHeders(harRequest.headers);
      obj.payload = harRequest.postData.text;
      let t = new Date(entry.startedDateTime).getTime();
      if (t !== t) {
        t = Date.now();
      }
      obj.created = t;
    }
    return {
      originId: item.id,
      historyData: this.processHar(item.har),
      request: obj
    };
  },
  /**
   * Parser for the saved request
   * ## The request object.
   * The request object is consisted with following properties:
   * - _id: name + '/' + url + '/' + method
   * - name: String
   * - url: String
   * - method: String
   * - headers: String
   * - payload: String
   * - created: time
   * - legacyProject: 0
   * @return {Object|null}
   */
  _parseSavedItem: function(item) {
    var obj = {
      _id: encodeURIComponent(item.name) + '/' + encodeURIComponent(item.url) + '/' + item.method,
      name: item.name,
      method: item.method,
      url: item.url
    };
    // payload and headers
    var harIndex = item.referenceEntry || 0;
    var entries = item.har.entries;
    var entry;
    if (harIndex || harIndex === 0) {
      entry = entries[harIndex];
    } else {
      entry = entries[0];
    }
    if (entry) {
      let harRequest = entry.request;
      obj.headers = this._parseHarHeders(harRequest.headers);
      obj.payload = harRequest.postData.text;
      let t = new Date(entry.startedDateTime).getTime();
      if (t !== t) {
        t = Date.now();
      }
      obj.created = t;
    }
    return {
      originId: item.id,
      historyData: this.processHar(item.har),
      request: obj
    };
  },
  // The same as saved but with drive id
  _parseDriveItem: function(item) {
    var result = this._parseSavedItem(item);
    result.request.driveId = item.driveId;
    result.request.type = 'google-drive';
    return result;
  },
  // @returns {!String}
  _parseHarHeders: function(headersArray) {
    if (!headersArray || !headersArray.length) {
      return '';
    }
    return headersArray.map((item) => {
      return item.name + ': ' + item.value;
    }).join('\n');
  },
  /**
   * The history data object.
   * - _id: autogenerated.
   * - headers
   * - payload
   * - url
   * - method
   * - response: Object
   *   - statusCode
   *   - statusText
   *   - headers
   *   - payload
   * - timings
   * - created: int!
   */
  processHar: function(har) {
    if (!har || !har.entries || !har.entries.length) {
      return null;
    }
    return har.entries.map((item) => {
      let req = item.request;
      let res = item.response;
      let cd = new Date(item.startedDateTime).getTime();
      if (cd !== cd) {
        cd = Date.now();
      }
      return {
        _id: this.$.uuid.generate(),
        headers: this._parseHarHeders(req.headers),
        payload: req.postData.text,
        url: req.url,
        method: req.method,
        timings: item.timings,
        totalTime: item.time,
        created: cd,
        response: {
          statusCode: res.status,
          statusText: res.statusText,
          headers: this._parseHarHeders(res.headers),
          payload: res.content.text
        }
      };
    });
  },

  _assignProjects: function(data, projects) {
    
  }
});
})();
