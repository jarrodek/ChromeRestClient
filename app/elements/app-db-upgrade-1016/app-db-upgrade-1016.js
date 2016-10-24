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

  ready: function() {
    this.checkIsUpgraded()
    .then((isDone) => {
      if (isDone) {
        return this.fire('database-upgrades-ready', {
          value: '1016'
        });
      }
      console.log('firing database-upgrades-needed');
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
    return arc.app.importer.prepareExport()
    .then((data) => this.processPackage(data))
    .then(() => this.copyCookies())
    .then(() => this.copyAuthData())
    .then(() => this.copyUrlHistory());
  },

  processPackage: function(data) {
    this.fire('database-upgrades-status', {
      value: '1016',
      message: 'Initializing upgrade'
    });
    // In new structure projects do not have a refference to request ids.
    // It's the other way around. It's a bad pattern for object stores but
    // it must suffice for now.
    var projects = data.projects;
    // Requests are de-centralized. History is placed in it's own store, saved the same.
    // Also HAR data is stored in it's own store where each HAR objects is another data object.
    var requests = data.requests;

    var parsedRequests;
    var parsedProjects;
    return this.prepareRequestsArrays(requests)
    .then((result) => {
      parsedRequests = result;
      return this._processProjects(projects);
    })
    .then((result) => {
      parsedProjects = result;
      return this._insertLegacyProjects(result);
    })
    .then((inserts) => {
      parsedProjects = parsedProjects.map((item, i) => {
        item.insertId = inserts[i].id;
        return item;
      });
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
