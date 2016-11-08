(function() {
'use strict';
/* global PouchDB */
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

  attached: function() {
    this.listen(window, 'dump-data-requests-read', '_onDumpRequestReadProgress');
  },

  detached: function() {
    this.unlisten(window, 'dump-data-requests-read', '_onDumpRequestReadProgress');
  },

  _onDumpRequestReadProgress: function(e) {
    if (e.detail.readCount) {
      this._requestsReadCount = e.detail.readCount;
    }
  },

  ready: function() {
    this.checkIsUpgraded()
    .then((isDone) => {
      if (isDone) {
        return this.fire('database-upgrades-ready', {
          value: '1016'
        });
      }
      return this.fire('database-upgrades-needed', {
        value: '1016'
      });
    });
  },

  initScript: function() {
    this.checkIsUpgraded()
    .then((isDone) => {
      if (isDone) {
        return;
      }
      return this.beforeUpgrade()
      .then(() => this.initUpgrade());
    })
    .then(() => this.setStatusUpgraded())
    .then(() => {
      var msg = 'Databse schema upgrade finished with great success!';
      msg += ' And few nights working at home..';
      console.info(msg);
      this.fire('database-upgrades-status', {
        value: '1016',
        message: 'Databse schema upgrade finished with great success!'
      });
      return this.fire('database-upgrades-ready', {
        value: '1016'
      });
    })
    .catch((e) => {
      var msg = 'Database upgrade error. Please, file an issue report at ';
      msg += 'https://github.com/jarrodek/ChromeRestClient/issues';
      console.error(msg);
      console.error(e);

      this.fire('database-upgrade-error', {
        error: e,
        value: '1016'
      });
    });
  },

  // Clean up databases
  beforeUpgrade: function() {
    this.fire('database-upgrades-status', {
      value: '1016',
      message: 'Deleting new databases if exists.'
    });
    return Promise.all([
      new PouchDB('history-data').destroy(),
      new PouchDB('saved-requests').destroy(),
      new PouchDB('legacy-projects').destroy(),
      new PouchDB('history-requests').destroy(),
      new PouchDB('cookies').destroy(),
      new PouchDB('auth-data').destroy(),
      new PouchDB('url-history').destroy()
    ]);
  },

  checkIsUpgraded: function() {
    this.fire('database-upgrades-status', {
      value: '1016',
      message: 'Checking if upgrade is required.'
    });
    return new Promise((resolve) => {
      chrome.storage.local.get({'upgrades': []}, (data) => {
        if (data.upgrades.indexOf('102016') !== -1) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },

  setStatusUpgraded: function() {
    this.fire('database-upgrades-status', {
      value: '1016',
      message: 'Setting upgrade flags'
    });
    // return Promise.resolve();
    return new Promise((resolve) => {
      chrome.storage.local.get({'upgrades': []}, (data) => {
        if (data.upgrades.indexOf('102016') === -1) {
          data.upgrades.push('102016');
          chrome.storage.local.set(data, () => {
            resolve();
          });
        }
      });
    });
  },

  initUpgrade: function() {
    this.fire('database-upgrades-status', {
      value: '1016',
      message: 'Initializing upgrade'
    });
    this.fire('database-upgrades-status', {
      value: '1016',
      message: 'Getting data from old database'
    });

    this._longTaskCounter = 0;
    this._longTaskTimeout = window.setTimeout(this.longTaskInfo.bind(this), 15000);

    return this._processRequestData()
    .then(() => this.copyCookies())
    .then(() => this.copyAuthData())
    .then(() => this.copyUrlHistory());
  },

  _processRequestData: function() {
    var projects = [];
    return arc.app.importer.prepareExportProjectsToPouchDb()
    .then((result) => this._processProjects(result))
    .then((p) => {
      projects = p;
      return this._insertLegacyProjects(p);
    })
    .then((inserts) => {
      projects.forEach((item, i) => {
        item.insertId = inserts[i].id;
      });
    })
    .then(() => {
      return this._getRequestAndProcessData(projects);
    });
  },
  // Recursively process request data
  _getRequestAndProcessData: function(projects, part) {
    var hasPartialResults = false;
    part = part || 0;

    this.fire('database-upgrades-status', {
      value: '1016',
      message: 'Reading history data, part ' + (part + 1)
    });

    return arc.app.importer.prepareRequestsExportToPouchDb(part)
    .then((data) => {
      part++;
      // window.clearTimeout(this._longTaskTimeout);
      hasPartialResults = data.partial;
      data = data.result;
      return this.processPackage(projects, data);
    })
    .then(() => {
      if (hasPartialResults) {
        return this._getRequestAndProcessData(projects, part);
      }
      return Promise.resolve();
    });
  },

  longTaskInfo: function() {
    window.clearTimeout(this._longTaskTimeout);
    var message = 'Reading database takes longer than expected. You must have a lot of data ' +
      'in the datastore. ';
    message += 'Still working...';
    this.fire('database-upgrades-status', {
      value: '1016',
      message: message
    });
    this._longTaskCounter++;
    if (this._longTaskCounter === 2) {
      this.fire('database-upgrades-long-task', {
        value: '1016'
      });
    } else {
      this._longTaskTimeout = window.setTimeout(this.longTaskInfo.bind(this), 15000);
    }
  },

  processPackage: function(parsedProjects, requests) {
    // In new structure projects do not have a refference to request ids.
    // It's the other way around. It's a bad pattern for object stores but
    // it must suffice for now.

    // Requests are de-centralized. History is placed in it's own store, saved the same.
    // Also HAR data is stored in it's own store where each HAR objects is another data object.

    var parsedRequests;
    return this.prepareRequestsArrays(requests)
    .then((result) => {
      parsedRequests = result;
    })
    .then(() => arc.app.importer._assignLegacyProjects(parsedRequests, parsedProjects))
    .then(() => this._insertSavedRequests(parsedRequests.saved))
    .then(() => this._insertHistorydRequests(parsedRequests.history))
    .then(() => this._insertHistoryData(parsedRequests.har));
  },
  // Returns an array of saved, history and har objects.
  prepareRequestsArrays: function(requests) {
    this.fire('database-upgrades-status', {
      value: '1016',
      message: 'Processing requests data'
    });
    return arc.app.importer._saveFileDataOldprepareRequestsArrays(requests);
  },
  _processProjects: function(projects) {
    this.fire('database-upgrades-status', {
      value: '1016',
      message: 'Processing projects data'
    });
    return arc.app.importer._saveFileDataOldProcessProjects(projects);
  },

  _insertLegacyProjects: function(data) {
    if (!data || !data.length) {
      return Promise.resolve();
    }
    this.fire('database-upgrades-status', {
      value: '1016',
      message: 'Inserting projects (' + data.length + ')'
    });
    return arc.app.importer._insertLegacyProjects(data);
  },

  _insertSavedRequests: function(data) {
    if (!data || !data.length) {
      return Promise.resolve();
    }
    this.fire('database-upgrades-status', {
      value: '1016',
      message: 'Inserting saved requests (' + data.length + ')'
    });
    return arc.app.importer._insertSavedRequests(data);
  },

  _insertHistorydRequests: function(data) {
    if (!data || !data.length) {
      return Promise.resolve();
    }
    this.fire('database-upgrades-status', {
      value: '1016',
      message: 'Inserting history (' + data.length + ')'
    });
    return arc.app.importer._insertHistorydRequests(data);
  },

  _insertHistoryData: function(data) {
    if (!data || !data.length) {
      return Promise.resolve();
    }
    this.fire('database-upgrades-status', {
      value: '1016',
      message: 'Inserting history (HAR) data (' + data.length + ')'
    });
    return arc.app.importer._insertHistoryData(data);
  },

  _insertCookies: function(data) {
    if (!data || !data.length) {
      return Promise.resolve();
    }
    this.fire('database-upgrades-status', {
      value: '1016',
      message: 'Inserting cookies (' + data.length + ')'
    });
    var db = new PouchDB('cookies');
    return db.bulkDocs(data);
  },

  _insertAuthData: function(data) {
    if (!data || !data.length) {
      return Promise.resolve();
    }
    this.fire('database-upgrades-status', {
      value: '1016',
      message: 'Inserting auth data (' + data.length + ')'
    });
    var db = new PouchDB('auth-data');
    return db.bulkDocs(data);
  },

  _insertUrlData: function(data) {
    if (!data || !data.length) {
      return Promise.resolve();
    }
    this.fire('database-upgrades-status', {
      value: '1016',
      message: 'Inserting url history (' + data.length + ')'
    });
    var db = new PouchDB('url-history');
    return db.bulkDocs(data);
  },

  _assignProjects: function(data, projects) {
    if (!projects || !projects.length) {
      return;
    }
    this.fire('database-upgrades-status', {
      value: '1016',
      message: 'Associating legacy projects with requests'
    });
    arc.app.importer._assignLegacyProjects(data, projects);
  },

  copyCookies: function() {
    this.fire('database-upgrades-status', {
      value: '1016',
      message: 'Processing cookies data'
    });
    return new Promise((resolve, reject) => {
      var db;
      var error;
      arc.app.db.idb.open()
      .then((_db) => {
        db = _db;
        return db.cookies.toArray();
      })
      .then((arr) => {
        if (!arr || !arr.length) {
          return null;
        }
        return arr.map((i) => {
          i = Object.assign({}, i);
          i.domain = i._domain;
          i.expires = i._expires;
          i.maxAge = i._maxAge;
          delete i._domain;
          delete i._expires;
          delete i._maxAge;
          i._id = i.domain + '/' + encodeURIComponent(i.name) + '/' + encodeURIComponent(i.path);
          return i;
        });
      })
      .then((toInsert) => this._insertCookies(toInsert))
      .catch((err) => {
        error = err;
      })
      .finally(function() {
        // Escape Dexie promise system.
        window.setTimeout(() => {
          if (error) {
            console.error('Error during upgrade', error);
            return reject();
          }
          resolve();
        }, 0);
      });
    });
  },

  copyAuthData: function() {
    this.fire('database-upgrades-status', {
      value: '1016',
      message: 'Processing auth data'
    });
    return new Promise((resolve, reject) => {
      var db;
      var error;
      arc.app.db.idb.open()
      .then((_db) => {
        db = _db;
        return db.basicAuth.toArray();
      })
      .then((arr) => {
        if (!arr || !arr.length) {
          return null;
        }
        return arr.map((i) => {
          i = Object.assign({}, i);
          i._id = i.type + '/' + encodeURIComponent(i.url);
          return i;
        });
      })
      .then((toInsert) => this._insertAuthData(toInsert))
      .catch((err) => {
        error = err;
      })
      .finally(function() {
        // Escape Dexie promise system.
        window.setTimeout(() => {
          if (error) {
            console.error('Error during upgrade', error);
            return reject();
          }
          resolve();
        }, 0);
      });
    });
  },

  copyUrlHistory: function() {
    this.fire('database-upgrades-status', {
      value: '1016',
      message: 'Processing url history'
    });
    return new Promise((resolve, reject) => {
      var db;
      var error;
      arc.app.db.idb.open()
      .then((_db) => {
        db = _db;
        return db.historyUrls.toArray();
      })
      .then((arr) => {
        if (!arr || !arr.length) {
          return null;
        }
        return arr.map((i) => {
          i = Object.assign({}, i);
          i._id = i.url;
          delete i.url;
          i.cnt = 1;
          return i;
        });
      })
      .then((toInsert) => this._insertUrlData(toInsert))
      .catch((err) => {
        error = err;
      })
      .finally(function() {
        // Escape Dexie promise system.
        window.setTimeout(() => {
          if (error) {
            console.error('Error during upgrade', error);
            return reject();
          }
          resolve();
        }, 0);
      });
    });
  }
});
})();
