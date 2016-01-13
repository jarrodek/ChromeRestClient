'use strict';

var arc = arc || {};

arc.app = arc.app || {};

arc.app.analytics = arc.app.analytics || {};

arc.app.analytics._trackersConfig = [{
  'trackingId': 'UA-18021184-6',
  'cookieDomain': 'auto',
  'name': 'legacy'
}];

arc.app.analytics.init = function () {
  arc.app.analytics._loadLibrary();
  arc.app.analytics._initTranckers();
  arc.app.analytics._setCustomDimmensions();
  arc.app.analytics._setAppUid();
  arc.app.analytics._setChromeChannel();
};

arc.app.analytics._loadLibrary = function () {
  (function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
      (i[r].q = i[r].q || []).push(arguments);
    }, i[r].l = 1 * new Date();
    a = s.createElement(o), m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
  })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
};

arc.app.analytics._initTranckers = function () {
  arc.app.analytics._trackersConfig.forEach(function (item) {
    ga('create', item);
    if (!item.name) {
      return;
    }
    ga(item.name + '.set', 'checkProtocolTask', null);
    ga(item.name + '.set', 'appName', 'ARC');
    ga(item.name + '.set', 'appId', 'org.rest.client');
  });
};

arc.app.analytics._getTrackerNames = function () {
  var names = arc.app.analytics._trackersConfig.map(function (item) {
    if (!!item.name) {
      return item.name;
    }
  });
  return names.filter(function (item) {
    return !!item;
  });
};

arc.app.analytics._setCustomDimmensions = function () {
  var names = arc.app.analytics._getTrackerNames();
  var appVersion = chrome && chrome.runtime && chrome.runtime.getManifest ? chrome.runtime.getManifest().version : 'Unknown';
  var chromeVer = arc.app.utils.getChromeVersion();
  names.forEach(function (name) {
    ga(name + '.set', 'appVersion', appVersion);
    ga(name + '.set', 'dimension2', appVersion);
    ga(name + '.set', 'dimension1', chromeVer);
  });
};

arc.app.analytics._setAppUid = function () {
  var setUid = function setUid(uuid) {
    var names = arc.app.analytics._getTrackerNames();
    names.forEach(function (name) {
      ga(name + '.set', 'userId', uuid);
    });
  };
  if (chrome && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get({
      'appuid': null
    }, function (data) {
      if (data.appuid) {
        setUid(data.appuid);
      } else {
        data.appuid = arc.app.utils.uuid();
        chrome.storage.sync.set(data, function () {
          setUid(data.appuid);
        });
      }
    });
  }
};

arc.app.analytics._setChromeChannel = function () {
  if (!window.navigator.onLine) {
    return;
  }
  arc.app.analytics._loadCSV().then(function (obj) {
    if (!(obj instanceof Array)) {
      return;
    }
    var version = arc.app.utils.getChromeVersion();
    for (var i = 0, size = obj[1].length; i < size; i++) {
      var item = obj[1][i];

      if (item.current_version === version || item.previous_version === version) {
        var channel = item.channel;
        var names = arc.app.analytics._getTrackerNames();
        for (var j = 0, namesSize = names.length; j < namesSize; j++) {
          var name = names[j];
          ga(name + '.set', 'dimension3', channel);
        }
        return;
      }
    }
  }).catch(function (cause) {});
};

arc.app.analytics._loadCSV = function () {
  var init = {
    mode: 'no-cors',
    cache: 'force-cache'
  };
  return fetch('https://omahaproxy.appspot.com/all?csv=1', init).then(function (response) {
    return response.text();
  }).then(function (data) {
    return data.split('\n');
  }).then(function (lines) {
    var keys = lines[0].split(',');
    var data = [];
    for (var i = 1; i < lines.length; ++i) {
      var line = lines[i];
      if (!line.length) {
        continue;
      }
      var columns = line.split(',');
      var row = {};
      for (var j = 0; j < columns.length; ++j) {
        row[keys[j]] = columns[j];
      }
      data.push(row);
    }
    return [keys, data];
  });
};

arc.app.analytics.sendEvent = function (category, action, label, value) {
  var names = arc.app.analytics._getTrackerNames();
  var config = {
    hitType: 'event',
    eventCategory: category,
    eventAction: action,
    eventLabel: label
  };
  if (typeof value !== 'undefined') {
    config.eventValue = value;
  }
  names.forEach(function (name) {
    ga(name + '.send', config);
  });
};

arc.app.analytics.sendScreen = function (screenName) {
  var names = arc.app.analytics._getTrackerNames();
  names.forEach(function (name) {
    ga(name + '.send', 'pageview', screenName);
  });
};

arc.app.analytics.sendException = function (exception, isFatal) {
  var names = arc.app.analytics._getTrackerNames();
  var value = {
    'exDescription': '' + exception
  };
  if (typeof isFatal !== 'undefined') {
    value.exFatal = isFatal;
  }
  names.forEach(function (name) {
    ga(name + '.send', 'exception', value);
  });
};
'use strict';

var arc = arc || {};

arc.app = arc.app || {};

arc.app.db = arc.app.db || {};

arc.app.db.websql = {};

arc.app.db.websql._db = null;

arc.app.db.websql._dbVersion = '';

arc.app.db.websql.onerror = function (e) {
  console.error('app::db:error');
  console.log(e.message);
};

arc.app.db.websql.open = function () {
  return new Promise(function (resolve, reject) {
    if (arc.app.db.websql._db) {
      resolve(arc.app.db.websql._db);
      return;
    }
    arc.app.db.websql._db = openDatabase('restClient', arc.app.db.websql._dbVersion, 'Rest service database', 10000000);
    arc.app.db.websql._dbUpgrade(arc.app.db.websql._db).then(function () {
      resolve(arc.app.db.websql._db);
    }).catch(function (cause) {
      reject(cause);
    });
  });
};

arc.app.db.websql._dbUpgrade = function (db) {
  return new Promise(function (resolve, reject) {
    db.transaction(function (tx) {
      var sql = 'CREATE TABLE IF NOT EXISTS exported (' + 'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' + 'reference_id INTEGER NOT NULL, ' + 'gaeKey TEXT, ' + 'type TEXT default \'form\')';
      tx.executeSql(sql, []);

      sql = 'CREATE TABLE IF NOT EXISTS form_encoding (' + 'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' + 'encoding TEXT NOT NULL)';
      tx.executeSql(sql, []);

      sql = 'CREATE TABLE IF NOT EXISTS headers (' + 'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' + 'name TEXT NOT NULL, desc TEXT, example TEXT, type TEXT)';
      tx.executeSql(sql, []);

      sql = 'CREATE TABLE IF NOT EXISTS history (' + 'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' + 'url TEXT NOT NULL, method TEXT NOT NULL, ' + 'encoding TEXT NULL, headers TEXT NULL, ' + 'payload TEXT NULL, time INTEGER)';
      tx.executeSql(sql, []);

      sql = 'CREATE TABLE IF NOT EXISTS projects (' + 'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' + 'name TEXT NOT NULL, ' + 'time INTEGER)';
      tx.executeSql(sql, []);

      sql = 'CREATE TABLE IF NOT EXISTS request_data (' + 'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' + 'project INTEGER DEFAULT 0, name TEXT NOT NULL, ' + 'url TEXT NOT NULL, method TEXT NOT NULL, ' + 'encoding TEXT NULL, headers TEXT NULL, ' + 'payload TEXT NULL, skipProtocol INTEGER DEFAULT 0, ' + 'skipServer INTEGER DEFAULT 0, ' + 'skipParams INTEGER DEFAULT 0, ' + 'skipHistory INTEGER DEFAULT 0, ' + 'skipMethod INTEGER DEFAULT 0, ' + 'skipPayload INTEGER DEFAULT 0, ' + 'skipHeaders INTEGER DEFAULT 0, ' + 'skipPath INTEGER DEFAULT 0, time INTEGER)';
      tx.executeSql(sql, []);

      sql = 'CREATE TABLE IF NOT EXISTS statuses (' + 'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' + 'code INTEGER NOT NULL, label TEXT, desc TEXT)';
      tx.executeSql(sql, []);

      sql = 'CREATE TABLE IF NOT EXISTS urls (' + 'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' + 'time INTEGER, ' + 'url TEXT NOT NULL)';
      tx.executeSql(sql, []);

      sql = 'CREATE TABLE IF NOT EXISTS websocket_data (' + 'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' + 'url TEXT NOT NULL, ' + 'time INTEGER)';
      tx.executeSql(sql, []);
    }, function (tx, error) {
      reject(error);
    }, function () {
      resolve();
    });
  });
};

arc.app.db.websql.insertStatusCodes = function (codesArray) {
  return new Promise(function (resolve, reject) {
    arc.app.db.websql.open().then(function (db) {
      db.transaction(function (tx) {
        codesArray.forEach(function (item) {
          var sql = 'INSERT INTO statuses (code,label,desc) VALUES (?,?,?)';
          tx.executeSql(sql, [item.key, item.label, item.desc]);
        });
      }, function (tx, error) {
        reject(error);
      }, function () {
        resolve();
      });
    }).catch(function (e) {
      reject(e);
    });
  });
};

arc.app.db.websql.insertHeadersDefinitions = function (headers) {
  return new Promise(function (resolve, reject) {
    arc.app.db.websql.open().then(function (db) {
      db.transaction(function (tx) {
        headers.forEach(function (item) {
          var sql = 'INSERT INTO headers (name,desc,example,type) VALUES (?,?,?,?)';
          tx.executeSql(sql, [item.key, item.desc, item.example, item.type]);
        });
      }, function (tx, error) {
        reject(error);
      }, function () {
        resolve();
      });
    }).catch(function (e) {
      reject(e);
    });
  });
};

arc.app.db.websql.getStatusCode = function (code) {
  return new Promise(function (resolve, reject) {
    arc.app.db.websql.open().then(function (db) {
      db.transaction(function (tx) {
        var sql = 'SELECT * FROM statuses WHERE code = ?';
        tx.executeSql(sql, [code], function (tx, result) {
          if (result.rows.length === 0) {
            resolve(null);
          } else {
            resolve(result.rows.item(0));
          }
        }, function (tx, error) {
          reject(error);
        });
      });
    }).catch(function (e) {
      reject(e);
    });
  });
};

arc.app.db.websql.getHeaderByName = function (name, type) {
  return new Promise(function (resolve, reject) {
    arc.app.db.websql.open().then(function (db) {
      db.transaction(function (tx) {
        var sql = 'SELECT * FROM headers WHERE name LIKE (?) AND type=?';
        tx.executeSql(sql, [name, type], function (tx, result) {
          if (result.rows.length === 0) {
            resolve(null);
          } else {
            resolve(Array.from(result.rows));
          }
        }, function (tx, error) {
          reject(error);
        });
      });
    }).catch(function (e) {
      reject(e);
    });
  });
};

arc.app.db.websql.addUrlHistory = function (url, time) {
  return new Promise(function (resolve, reject) {
    arc.app.db.websql.open().then(function (db) {
      db.transaction(function (tx) {
        var sql = 'INSERT INTO urls (url,time) VALUES (?,?)';
        tx.executeSql(sql, [url, time], function (tx, result) {
          resolve(result);
        }, function (tx, error) {
          reject(error);
        });
      });
    }).catch(function (e) {
      reject(e);
    });
  });
};

arc.app.db.websql.updateUrlHistory = function (id, time) {
  return new Promise(function (resolve, reject) {
    arc.app.db.websql.open().then(function (db) {
      db.transaction(function (tx) {
        var sql = 'UPDATE urls SET time = ? WHERE ID = ?';
        tx.executeSql(sql, [time, id], function (tx, result) {
          resolve(result);
        }, function (tx, error) {
          reject(error);
        });
      });
    }).catch(function (e) {
      reject(e);
    });
  });
};

arc.app.db.websql.getHistoryUrls = function (query) {
  return new Promise(function (resolve, reject) {
    arc.app.db.websql.open().then(function (db) {
      db.transaction(function (tx) {
        var sql = 'SELECT url FROM urls WHERE url LIKE ? ORDER BY time';
        tx.executeSql(sql, [query], function (tx, result) {
          if (result.rows.length === 0) {
            resolve(null);
          } else {
            resolve(Array.from(result.rows));
          }
        }, function (tx, error) {
          reject(error);
        });
      });
    }).catch(function (e) {
      reject(e);
    });
  });
};

arc.app.db.websql.addProject = function (name, time) {
  return new Promise(function (resolve, reject) {
    arc.app.db.websql.open().then(function (db) {
      db.transaction(function (tx) {
        var sql = 'INSERT INTO projects (name, time) VALUES (?,?)';
        tx.executeSql(sql, [name, time], function (tx, result) {
          resolve(result);
        }, function (tx, error) {
          reject(error);
        });
      });
    }).catch(function (e) {
      reject(e);
    });
  });
};

arc.app.db.websql.importProjects = function (projectsArray) {
  return new Promise(function (resolve, reject) {
    arc.app.db.websql.open().then(function (db) {
      db.transaction(function (tx) {
        projectsArray.forEach(function (item) {
          var sql = 'INSERT INTO projects (name, time) VALUES (?,?)';
          tx.executeSql(sql, [item.name, item.time]);
        });
      }, function (tx, error) {
        reject(error);
      }, function () {
        resolve();
      });
    }).catch(function (e) {
      reject(e);
    });
  });
};

arc.app.db.websql.updateProject = function (name, time, id) {
  return new Promise(function (resolve, reject) {
    arc.app.db.websql.open().then(function (db) {
      db.transaction(function (tx) {
        var sql = 'UPDATE projects SET name = ?, time = ? WHERE ID = ?';
        tx.executeSql(sql, [name, time, id], function (tx, result) {
          resolve(result);
        }, function (tx, error) {
          reject(error);
        });
      });
    }).catch(function (e) {
      reject(e);
    });
  });
};

arc.app.db.websql.listProjects = function () {
  return new Promise(function (resolve, reject) {
    arc.app.db.websql.open().then(function (db) {
      db.transaction(function (tx) {
        var sql = 'SELECT * FROM projects WHERE 1';
        tx.executeSql(sql, [], function (tx, result) {
          if (result.rows.length === 0) {
            resolve(null);
          } else {
            resolve(Array.from(result.rows));
          }
        }, function (tx, error) {
          reject(error);
        });
      });
    }).catch(function (e) {
      reject(e);
    });
  });
};

arc.app.db.websql.getProject = function (id) {
  return new Promise(function (resolve, reject) {
    arc.app.db.websql.open().then(function (db) {
      db.transaction(function (tx) {
        var sql = 'SELECT * FROM projects WHERE ID = ?';
        tx.executeSql(sql, [id], function (tx, result) {
          if (result.rows.length === 0) {
            resolve(null);
          } else {
            resolve(Array.from(result.rows));
          }
        }, function (tx, error) {
          reject(error);
        });
      });
    }).catch(function (e) {
      reject(e);
    });
  });
};
'use strict';

var arc = arc || {};

arc.app = arc.app || {};

arc.app.arc = {};

arc.app.arc.minSupportedVersion = 45;

arc.app.arc.getAppId = function (callback) {
  chrome.storage.local.get({
    'APP_ID': null
  }, function (result) {
    if (!result.APP_ID) {
      result.APP_ID = arc.app.utils.uuid();
      chrome.storage.local.set(result, function () {
        callback(result.APP_ID);
      });
    } else {
      callback(result.APP_ID);
    }
  });
};

arc.app.arc.checkCompatybility = function () {
  var version = arc.app.utils.getChromeVersion();
  var manifest = chrome.runtime.getManifest();
  var manMin = 0;

  if (manifest && manifest.minimum_chrome_version) {
    manMin = Number(manifest.minimum_chrome_version);
  }

  var supported = Math.max(manMin, arc.app.arc.minSupportedVersion);
  if (Number(version.match(/(\d+)\./)[1]) < supported) {
    window.setTimeout(function () {
      document.querySelector('#incompatibleVersionDialog').open();
    }, 2000);
  }
};
'use strict';

if (!Array.from) {
  Array.from = function () {
    var toStr = Object.prototype.toString;
    var isCallable = function isCallable(fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function toInteger(value) {
      var number = Number(value);
      if (isNaN(number)) {
        return 0;
      }
      if (number === 0 || !isFinite(number)) {
        return number;
      }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function toLength(value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    return function from(arrayLike) {
      var C = this;

      var items = Object(arrayLike);

      if (arrayLike === null) {
        throw new TypeError('Array.from requires an array-like object - not null or undefined');
      }

      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if (typeof mapFn !== 'undefined') {
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }

        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      var len = toLength(items.length);

      var A = isCallable(C) ? Object(new C(len)) : new Array(len);

      var k = 0;

      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }

      A.length = len;

      return A;
    };
  }();
}
'use strict';

var arc = arc || {};

arc.app = arc.app || {};

arc.app.server = arc.app.server || {};

arc.app.server.request = {};

arc.app.server.request.init = function () {
  var root = 'https://chromerestclient.appspot.com/';
  arc.app.server.request.SERVICE_URL = root + 'ext-channel';
  arc.app.server.request.PING_URL = root + 'ping/session';
  arc.app.server.request.AUTH_URL = root + 'auth';
  arc.app.server.request.ASSETS_URL = root + 'static/';
  arc.app.server.request.MESSAGES_URL = root + 'messages/';

  arc.app.server.request.SUGGESTIONS_LISTING = arc.app.server.request.SERVICE_URL + '/list/';
  arc.app.server.request.GET_IMPORT_DATA = arc.app.server.request.SERVICE_URL + '/get';
  arc.app.server.request.EXPORT_DATA = arc.app.server.request.SERVICE_URL + '/put';
};

arc.app.server.request.buildRequest = function (url, method, body) {
  var init = {
    method: method || 'GET',
    credentials: 'include',
    cache: 'no-cache'
  };
  var headers = new Headers();
  headers.append('X-Chrome-Extension', 'ChromeRestClient');
  if (body) {
    init.body = body;
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
  }
  init.headers = headers;
  return fetch(url, init);
};

arc.app.server.request.pingRequest = function () {
  return arc.app.server.request.buildRequest(arc.app.server.request.PING_URL).then(function (response) {
    return response.json();
  }).catch(function (error) {
    return {
      'error': true,
      'message': 'Error to load response from server. Session state unknown. (' + error.message + ')'
    };
  });
};

arc.app.server.request.messagesRequest = function (since) {
  return arc.app.server.request.buildRequest(arc.app.server.request.MESSAGES_URL + since).then(function (response) {
    return response.json();
  }).then(function (json) {
    var data = [];
    json.forEach(function (item) {
      data.push({
        actionUrl: item.actionUrl,
        message: item.message
      });
    });
    return data;
  }).catch(function (error) {
    return {
      'error': true,
      'message': 'Can\'t get messages list from the server. (' + error.message + ')'
    };
  });
};

arc.app.server.request.importSuggestionsRequest = function (uid) {
  uid = uid || 'me';
  return arc.app.server.request.buildRequest(arc.app.server.request.SUGGESTIONS_LISTING + uid).then(function (response) {
    return response.json();
  }).catch(function (error) {
    return {
      'error': true,
      'message': 'Can\'t get messages list from the server. (' + error.message + ')'
    };
  });
};

arc.app.server.request.getImportData = function (uids) {
  var data = '';
  uids.forEach(function (uid) {
    return data += 'k%5B%5D=' + uid + '&';
  });
  data = data.substring(0, data.length - 1);
  return arc.app.server.request.buildRequest(arc.app.server.request.GET_IMPORT_DATA, 'POST', data).then(function (response) {
    return response.json();
  }).catch(function (error) {
    return {
      'error': true,
      'message': 'Can\'t get messages list from the server. (' + error.message + ')'
    };
  });
};

arc.app.server.request.init();
'use strict';

var arc = arc || {};

arc.app = arc.app || {};

arc.app.server = arc.app.server || {};

arc.app.server.applicationUserId = null;

arc.app.server.hasSession = function (callback) {
  arc.app.server.request.pingRequest().then(function (json) {
    if (json.error) {
      return {
        'error': true,
        'message': json.error
      };
    }
    var data = {
      state: 2,
      uid: null };
    if ('hasSession' in json) {
      data.state = json.hasSession ? 1 : 0;
      if (json.hasSession) {
        data.uid = json.userId;
      }
    }
    return data;
  }).then(callback);
};

arc.app.server._authTab = null;

arc.app.server.auth = function () {
  var returnPath = '';
  if (arc.app.utils.isProdMode()) {
    returnPath = 'chrome-extension://' + chrome.runtime.id + '/auth.html#auth';
  } else {
    returnPath = 'http://127.0.0.1:8888/auth.html#auth';
  }
  var url = arc.app.server.request.AUTH_URL;
  url += '/signin?ret=';
  var regexp = /%20/g;
  url = url + encodeURIComponent(returnPath).replace(regexp, '+');
  chrome.tabs.create({
    url: url
  }, function (tab) {
    arc.app.server._authTab = tab.id;
  });
};

arc.app.server.authStateMayChanged = function (changes) {
  if (Object.keys(changes).indexOf('applogin') !== -1) {
    arc.app.server.hasSession(function (session) {
      if (window.arcGwtCallbacks && 'sessionchange' in window.arcGwtCallbacks) {
        window.arcGwtCallbacks.sessionchange(session);
      }
      if (arc.app.server._authTab) {
        chrome.tabs.remove(arc.app.server._authTab);
        arc.app.server._authTab = null;
      }
    });
  }
};

arc.app.server.getMessages = function (since, callback) {
  arc.app.server.request.messagesRequest(since).then(callback);
};

arc.app.server.getImportSuggestions = function (uid, callback) {
  arc.app.server.request.importSuggestionsRequest(uid).then(function (result) {
    callback(result);
  });
};

arc.app.server.getImportData = function (uids, callback) {
  arc.app.server.request.getImportData(uids).then(function (result) {
    callback(result);
  });
};

chrome.storage.onChanged.addListener(arc.app.server.authStateMayChanged);
'use strict';

var arc = arc || {};

arc.app = arc.app || {};

arc.app.settings = arc.app.settings || {};

arc.app.settings.getConfig = function () {
  return new Promise(function (resolve) {
    var values = {
      'DEBUG_ENABLED': false,
      'HISTORY_ENABLED': true,
      'MAGICVARS_ENABLED': true,
      'CMH_ENABLED': true,
      'CMP_ENABLED': true
    };
    try {
      chrome.storage.sync.get(values, function (result) {
        resolve(result);
      });
    } catch (e) {
      console.error('arc.app.settings.getConfig', e);
      resolve(values);
    }
  });
};
arc.app.settings.saveConfig = function (key, value) {
  return new Promise(function (resolve) {
    var o = {};
    o[key] = value;
    chrome.storage.sync.set(o, resolve);
  });
};
arc.app.settings.observe = function (callback) {
  chrome.storage.onChanged.addListener(function (changes, area) {
    callback(changes, area);
  });
};
'use strict';

var arc = arc || {};

arc.app = arc.app || {};

arc.app.utils = {};

arc.app.utils.uuid = function () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

arc.app.utils.isProdMode = function () {
  return location.hostname !== '127.0.0.1';
};

arc.app.utils.autoLink = function (input) {
  var r = new RegExp('(https?:\\/\\/([^" >]*))', 'gim');
  return input.replace(r, '<a target="_blank" class="auto-link" href="$1">$1</a>');
};

arc.app.utils.encodeHtml = function (input) {
  if (typeof input !== 'string') {
    return input;
  }
  return input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

arc.app.utils.getChromeVersion = function () {
  var raw = navigator.userAgent.match(/Chrom[e|ium]\/([0-9\.]+)/);
  return raw ? raw[1] : '(not set)';
};
'use strict';

var arc = arc || {};

arc.app = arc.app || {};

arc.app.xhr = arc.app.xhr || {};

arc.app.xhr.requests = new Map();

arc.app.xhr.create = function (har) {
  if (!(har && har.log && har.log.entries && har.log.entries.length > 0)) {
    throw new Error('The HAR object does not contain request information.');
  }

  var size = arc.app.xhr.requests.size();
  size++;
  arc.app.xhr.requests.set(size, har);
  return size;
};

arc.app.xhr.run = function (id) {
  return new Promise(function (resolve, reject) {
    arc.app.xhr._getRequestInfo(id).catch(function (error) {
      reject({
        'message': error.message
      });
    }).then(arc.app.xhr._createRequest).then(function (request) {
      return fetch(request);
    }).catch(function (error) {
      reject({
        'message': error.message
      });
    }).then(arc.app.xhr._readResponse).then(function (responseHar) {
      var har = arc.app.xhr.requests.get(id);
      arc.app.xhr.requests.delete(id);
      var refId = har.log.pages[har.log.pages.length - 1].id;
      for (var i = 0, len = har.log.entries.length; i < len; i++) {
        if (har.log.entries[i].pageref === refId && !har.log.entries[i].response) {
          har.log.entries[i].response = responseHar;
          break;
        }
      }
      resolve(har);
    });
  });
};

arc.app.xhr._getRequestInfo = function (id) {
  return new Promise(function (resolve, reject) {
    var har = arc.app.xhr.requests.get(id);
    if (!har) {
      reject({
        'message': 'There were no request object for given ID.'
      });
      return;
    }
    var refId = har.log.pages[har.log.pages.length - 1].id;
    if (!refId) {
      reject({
        'message': 'HAR object do not contain information about the request.'
      });
      return;
    }
    var filtered = har.log.entries.filter(function (item) {
      return item.pageref === refId;
    });
    if (!filtered.length) {
      reject({
        'message': 'HAR object do not contain information about the request.'
      });
      return;
    }
    resolve(filtered[0].request);
  });
};

arc.app.xhr._createRequest = function (request) {
  var headers = new Headers();
  var method = request.method || 'GET';
  if (request.headers && request.headers.length) {
    request.headers.forEach(function (header) {
      headers.append(header.name, header.value);
    });
  }
  var init = {
    'method': method,
    'cache': 'no-cache'
  };
  if (['GET', 'HEAD'].indexOf(method) === -1 && request.postData) {
    var post = request.postData;
    if (post.params) {
      var fd = FormData();
      post.params.forEach(function (item) {
        if (item.fileName) {
          fd.append(item.name, item.value, item.fileName);
        } else {
          fd.append(item.name, item.value);
        }
      });
      init.body = fd;
      headers.set(post.mimeType || 'multipart/form-data');
    } else if (post.text) {
      init.body = post.text;
      headers.set(post.mimeType || 'application/x-www-form-urlencoded');
    }
  }
  init.headers = headers;
  return new Request(request.url, init);
};

arc.app.xhr._readResponse = function (response) {
  return new Promise(function (resolve, reject) {
    var headers = [];
    var headersStr = '';
    var contentType = null;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = response.headers.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var pair = _step.value;

        headers.push({
          'name': pair[0],
          'value': pair[1]
        });
        headersStr += pair[0] + ': ' + pair[1] + '\r\n';
        if (pair[0].toLowerCase() === 'content-type') {
          contentType = pair[1].toLowerCase();
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    var har = {
      'status': response.status,
      'statusText': response.statusText,
      'httpVersion': 'HTTP/1.1',
      'cookies': [],
      'headers': headers,
      'content': {
        'size': -1,
        'compression': 0,
        'mimeType': contentType,
        'text': ''
      },
      'redirectURL': '',
      'headersSize': arc.app.xhr.byteLength(headersStr),
      'bodySize': -1
    };
    if (response.type === 'error') {
      reject({
        'har': har,
        'message': 'Network error'
      });
    } else if (response.ok && contentType) {
      if (contentType.indexOf('image') !== -1) {
        response.blob().then(function (blob) {
          har.content.size = blob.size;
          var reader = new window.FileReader();
          reader.onloadend = function () {
            har.content.text = reader.result;
            resolve(har);
          };
          reader.onerror = function (e) {
            reject({
              'har': har,
              'message': e.message
            });
          };
          reader.readAsDataURL(blob);
        });
      } else {
        response.text().then(function (text) {
          var input = Unibabel.strToUtf8Arr(text);
          var b64 = Unibabel.arrToBase64(input);
          har.content.text = btoa(b64);
          har.content.size = arc.app.xhr.byteLength(text);
          resolve(har);
        });
      }
    } else {
      resolve(har);
    }
  });
};

arc.app.xhr.byteLength = function (str) {
  var s = str.length;
  for (var i = str.length - 1; i >= 0; i--) {
    var code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) {
      s++;
    } else if (code > 0x7ff && code <= 0xffff) {
      s += 2;
    }
    if (code >= 0xDC00 && code <= 0xDFFF) {
      i--;
    }
  }
  return s;
};