(function() {
'use strict';

Polymer({
  is: 'arc-request-object-model',
  behaviors: [
    ArcBehaviors.ArcModelBehavior
  ],
  properties: {
    /**
     * RequestObject type.
     * Can be either `saved` or `history`
     */
    requestType: {
      type: String,
      value: 'saved'
    },
    /**
     * If specified the model will not look by keys but but will try
     * to find by paseed term in available keys.
     */
    searchTerm: {
      type: String
    }
  },

  getObject: function() {
    return this.genericGetObject('requestObject');
  },

  getByMethodUrl: function(url, method) {
    var db;
    return arc.app.db.idb.open()
      .then((_db) => {
        db = _db;
        return db.requestObject
          .where('[url+method]').equals([url, method])
          .toArray();
      })
      .then((data) => {
        if (!data) {
          data = null;
        } else if (data.length === 0) {
          data = null;
        }
        this.data = data;
        this.fire('data-ready', {
          data: data
        });
        return data;
      })
      .catch((cause) => {
        console.error(cause);
        this.fire('error', {
          error: cause
        });
      })
      .finally(function() {
        db.close();
      });
  },

  /**
   * Gather arguments and perform a query to the datastore.
   */
  query: function() {
    var manualSort = false;
    var excludedRequests = [];
    return this._getProjectRequestsList()
      .then((excluded) => excludedRequests = excluded)
      .then(arc.app.db.idb.open)
      .then((db) => {
        let type = this.requestType;
        let table = db.requestObject;
        let result;
        let indexes = [];
        table.schema.indexes.forEach((item) => {
          if (typeof item.keyPath === 'string') {
            indexes.push(item.keyPath);
          }
        });
        if (this.searchTerm) {
          let term = String(this.searchTerm).toLowerCase();
          result = table.filter((ro) => {
            if (ro.type !== type) {
              return false;
            }
            if (ro.url.toLowerCase().indexOf(term) !== -1) {
              return true;
            }
            if (ro._name && ro._name.indexOf(term) !== -1) {
              return true;
            }
            if (ro.method.toLowerCase().indexOf(term) !== -1) {
              return true;
            }
            return false;
          });
        } else if (this.objectId instanceof Array) {
          result = table.where(':id').anyOf(this.objectId);
        } else if (this.objectId) {
          result = table.get(this.objectId);
        } else {
          //result = table.where('type').equals(this.requestType);
          result = table.where(':id').noneOf(excludedRequests)
            .and((item) => {
              if (!type) {
                return true;
              }
              if (item.type === 'drive') {
                return true;
              }
              return item.type === type;
            });
        }
        if (this.sortBy) {
          if (indexes.indexOf(this.sortBy) === -1) {
            manualSort = true;
          } else {
            result = result.sortBy(this.sortBy);
          }
        }
        if (result.toArray) {
          result = result.toArray();
        }
        return result.catch((cause) => {
          console.error(cause);
          this.fire('error', {
            error: cause
          });
        })
        .finally(function() {
          db.close();
        });
      })
      .then((data) => {
        if (!data) {
          data = null;
        } else if (data.length === 0) {
          data = null;
        } else {
          let dir = this.direction;
          if (!dir) {
            dir = 'asc';
          }
          if (this.sortBy && manualSort) {
            data = this._sortData(data, this.sortBy, dir);
          } else if (dir && dir === 'desc') {
            data.reverse();
          }
          if (this.offset || this.limit) {
            let limit = this.limit;
            let offset = this.offset;
            if (!Number.isInteger(offset)) {
              offset = 0;
            }
            if (!Number.isInteger(limit)) {
              limit = data.length;
            }
            data = data.slice(offset, offset + limit);
          }
          data.forEach((item) => item._har = new HAR.Log(item._har));
        }
        this.data = data;
        this.fire('data-ready', {
          data: data
        });
        return data;
      }).catch((cause) => {
        console.error(cause);
        this.fire('error', {
          error: cause
        });
      });
  },
  /**
   * Save current `data` to the database.
   */
  save: function() {
    if (!this.data) {
      return Dexie.Promise.reject(new Error('Nothing to save.'));
    }
    this._cleanObject();
    return this.genericSave('requestObject');
  },
  /**
   * Remove current data from the store.
   */
  remove: function() {
    // if the whole table is to be removed, use custom query.
    // if this is history clear all type history
    // if this is saved clear all type saved and not in any project.
    if (!this.data && !this.objectId) {
      if (this.forceDeleteAll) {
        return this._deleteAll();
      } else {
        console.warn('Nothing to delete.');
      }
    }
    return this.genericRemove('requestObject');
  },
  /** Custom function to datae all objects by type. */
  _deleteAll: function() {
    var type = this.requestType;
    if (this.requestType === 'history') {
      return arc.app.db.idb.open()
        .then((db) => {
          return db.transaction('rw', db.requestObject, (table) => {
            return table
              .where('type')
              .equals(type)
              // .toCollection()
              .delete();
          })
          .then(() => {
            this.fire('deleted');
          })
          .catch((e) => {
            arc.app.analytics.sendException('request-model::_deleteAll::' +
              JSON.stringify(e), false);
            this.fire('error', {
              error: e
            });
          })
          .finally(function() {
            db.close();
          });
        });
    } else {
      return arc.app.db.idb.open()
        .then((db) => {
          return this._getProjectRequestsList()
            .then((excluded) => {
              return db.transaction('rw', db.requestObject, () => {
                return db.requestObject
                  .where(':id').noneOf(excluded)
                  .and((item) => {
                    return item.type === type;
                  })
                  .delete();
              })
              .then(() => {
                this.fire('deleted');
              });
            })
            .catch((e) => {
              arc.app.analytics.sendException('request-model::_deleteAll2::' +
                JSON.stringify(e), false);
              this.fire('error', {
                error: e
              });
            })
            .finally(function() {
              db.close();
            });
        });
    }
  },
  /**
   * Get IDs of all requests belonging to any project.
   */
  _getProjectRequestsList: function() {
    return arc.app.db.idb.open()
      .then((db) => {
        return db.projectObjects.reverse().toArray()
          .then((projects) => {
            let excluded = [];
            projects.forEach((project) => excluded = excluded.concat(project.requestIds));
            return excluded;
          })
          .catch((e) => {
            arc.app.analytics.sendException('request-model::_deleteAll2::' +
              JSON.stringify(e), false);
            this.fire('error', {
              error: e
            });
          })
          .finally(function() {
            db.close();
          });
      });
  },
  /**
   * Removed unescessary data from the object before save.
   */
  _cleanObject: function() {
    delete this.data.selected;
    delete this.data.kind;
  },
  /**
   * Manually sort data in an array.
   *
   * @example
   * this._sortData(obj, 'har.pages.0.time', 'asc');
   *
   * @param {Array} data An array to sort
   * @param {String} sort Apath to the property to sort on
   * @param {String} dir A direction of sorting. Can be `asc` or `desc`.
   */
  _sortData: function(data, sort, dir) {
    data.sort((a, b) => {
      let aProp = _.get(a, sort);
      let bProp = _.get(b, sort);

      if (isNaN(aProp)) {
        let aTime = new Date(aProp).getTime();
        if (!isNaN(aTime)) {
          aProp = aTime;
        } else if (typeof aProp !== 'string') {
          aProp = aProp.toString();
        }
      }
      if (isNaN(bProp)) {
        let bTime = new Date(bProp).getTime();
        if (!isNaN(bTime)) {
          bProp = bTime;
        } else if (typeof bProp !== 'string') {
          bProp = bProp.toString();
        }
      }
      if (aProp > bProp) {
        return dir === 'asc' ? 1 : -1;
      }
      if (aProp < bProp) {
        return dir === 'asc' ? -1 : 1;
      }
      if (aProp === bProp) {
        return 0;
      }
    });
    return data;
  },
  /**
   * Create new RequestObject from passed request and response objects.
   *
   * @param {ArcRequest} request A request object.
   * @param {ArcResponse} response Optional response data.
   * @return {RequestObject} A new RequestObject with passed data.
   */
  fromData: function(request, response) {
    var creator = new HAR.Creator({
      name: 'Advanced REST client',
      version: arc.app.utils.appVer,
      comment: 'ARC for Google Chrome.'
    });
    var browser = new HAR.Browser({
      name: 'Chrome',
      version: arc.app.utils.chromeVersion
    });
    var log = new HAR.Log({
      'comment': 'Created when making a request as a history object.',
      'version': 1.2,
      'creator': creator,
      'browser': browser
    });

    var pageParams = this._createHarRequestObject(request, 0);
    var entry = this._createHarResponseObject(pageParams, response);

    entry.setPage(pageParams.page);
    log.addPage(pageParams.page);
    log.addEntry(entry, pageParams.page.id);

    var params = {
      'har': log,
      'url': request.url,
      'method': request.method,
      'name': request.name || ''
    };
    if ('driveId' in request) {
      params.driveId = request.driveId;
      return new DriveRequestObject(params);
    } else if (request.type === 'saved') {
      return new SavedRequestObject(params);
    } else {
      return new HistoryRequestObject(params);
    }
  },
  /**
   * Transform current `data` to `RequestLocalObject`.
   *
   * @param {Boolean} isHistory True if the request is restored from history storage. For history
   * objects it will restore latest request in HAR object. For `saved` and `drive` objects
   * it will restore first (saved) request. This is default to false.
   * @return {RequestObject} Subclass of a RequestObject
   */
  toLocalRequest: function(isHistory) {
    isHistory = isHistory || false;
    var obj = new RequestLocalObject({});
    if (!this.data) {
      return obj;
    }
    var data = this.data;
    obj.url = data.url;
    obj.method = data.method;

    if ('driveId' in data) {
      if (data.driveId) {
        obj.isDrive = true;
        obj.driveId = data.driveId;
      } else {
        obj.isDrive = false;
      }
    } else {
      obj.isDrive = false;
    }
    if ('isSaved' in data) {
      obj.isSaved = data.isSaved;
    } else {
      obj.isSaved = data.type === 'saved';
    }

    obj.id = data.id;
    obj.name = data.name || undefined;
    if (data.har) {
      var entries = data.har.entries;
      //for saved and drive requests take first one
      //for history late last one.
      var request;
      if (!isHistory) {
        //TODO:190 it will not cover a situation when object was overriten. Fixed at 23 march 2016.
        if (data.referenceEntry || data.referenceEntry === 0) {
          request = entries[data.referenceEntry].request;
        } else {
          request = entries[0].request; // take the first one.
        }
      } else {
        request = entries[entries.length - 1].request; // take the last one.
      }
      if (!request) {
        return obj;
      }
      obj.headers = arc.app.headers.toString(request.headers);
      obj.payload = request.postData.text;
    } else {
      if (data.headers) {
        obj.headers = data.headers;
      }
      if (data.payload) {
        obj.payload = data.payload;
      }
    }
    return obj;
  },
  /**
   * Create a HAR's request object from given request
   */
  _createHarRequestObject: function(request, entriesCount) {
    var req = new HAR.Request({
      url: request.url,
      httpVersion: 'HTTP/1.1',
      method: request.method
    });
    var requestHeaders;
    if (typeof request.headers === 'string') {
      requestHeaders = arc.app.headers.toJSON(request.headers);
    } else {
      requestHeaders = request.headers;
    }
    if (['GET', 'HEAD'].indexOf(request.method) === -1) {
      //Do not pass encoding for non-payload requests
      let contentType;
      if (!request.headers) {
        contentType = 'application/x-www-form-urlencoded';
      } else {
        contentType = arc.app.headers.getContentType(requestHeaders) ||
          'application/x-www-form-urlencoded';
      }
      var post = new HAR.PostData({
        mimeType: contentType,
        text: request.payload
      });
      req.postData = post;
    }
    req.headers = requestHeaders;
    var page = new HAR.Page({
      id: arc.app.db.idb.requests.createRequestKey(request.method, request.url) + '-' +
        entriesCount,
      title: request.name,
      startedDateTime: new Date(request.time || Date.now()),
      pageTimings: {}
    });
    return {
      request: req,
      page: page
    };
  },

  _createHarResponseObject: function(pageParams, response) {
    var entryParams = {
      request: pageParams.request
    };
    var responseParams = {
      status: '0',
      statusText: 'No response'
    };
    if (response) {
      let contentType = arc.app.headers.getContentType(response.headers);
      let body;
      if (contentType) {
        if (contentType.indexOf('json') !== -1) {
          body = JSON.stringify(response.body);
        } else {
          body = String(response.body);
        }
      } else {
        body = String(response.body);
      }
      responseParams = {
        status: response.status || 0,
        statusText: response.statusText || 'unknown status',
        headers: response.headers || [],
        content: {
          text: body,
          mimeType: contentType
        }
      };
      if (response.stats) {
        entryParams.timings = response.stats;

        let time = 0;
        if (response.stats.connect && response.stats.connect !== -1) {
          time += response.stats.connect;
        }
        if (response.stats.receive && response.stats.receive !== -1) {
          time += response.stats.receive;
        }
        if (response.stats.send && response.stats.send !== -1) {
          time += response.stats.send;
        }
        if (response.stats.ssl && response.stats.ssl !== -1) {
          time += response.stats.ssl;
        }
        if (response.stats.wait && response.stats.wait !== -1) {
          time += response.stats.wait;
        }
        if (time) {
          entryParams.time = time;
        }
        if (response.stats.startTime) {
          entryParams.startedDateTime = new Date(response.stats.startTime);
        }
      }
    }
    if (!('startedDateTime' in entryParams)) {
      entryParams.startedDateTime = new Date();
    }
    entryParams.response = new HAR.Response(responseParams);
    return new HAR.Entry(entryParams);
  },
  /**
   * Appends new response to existing HAR object.
   */
  appendHarResponse: function(har, request, response) {
    if (!har) {
      return this.fromData(request, response);
    }

    var pageParams = this._createHarRequestObject(request, har.entries.length);
    var entry = this._createHarResponseObject(pageParams, response);
    if (!(har instanceof HAR.Log)) {
      har = new HAR.Log(har);
    }

    entry.setPage(pageParams.page);
    har.addPage(pageParams.page);
    har.addEntry(entry, pageParams.page.id);

    return har;
  },
  /**
   * Helper function when overriding request data.
   * Replace `restoredRequest` metadata and append current request and response.
   */
  replaceData: function(restoredRequest, currentRequest, currentResponse) {
    var har = restoredRequest.har;
    if (!har) {
      let request = this.fromData(currentRequest, currentResponse);
      request.name = restoredRequest.name;
      request.type = restoredRequest.type;
      request.id = restoredRequest.id;
      return request;
    }
    restoredRequest.method = currentRequest.method;
    restoredRequest.url = currentRequest.url;
    var pageParams = this._createHarRequestObject(currentRequest, har.entries.length);
    var entry = this._createHarResponseObject(pageParams, currentResponse);
    if (!(har instanceof HAR.Log)) {
      har = new HAR.Log(har);
    }
    entry.setPage(pageParams.page);
    har.addPage(pageParams.page);
    har.addEntry(entry, pageParams.page.id);
    restoredRequest.har = har;
    restoredRequest.referenceEntry = har.entries.length - 1;
    return restoredRequest;
  }
});
})();
