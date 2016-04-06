'use strict';
/* global chance */
var generateRequestData = function(isHistory) {
  var isPayload = chance.bool();
  var payloadMethods = ['POST', 'PUT', 'DELETE', 'OPTIONS'];
  var otherMethods = ['GET', 'HEAD'];
  var headersSize = chance.integer({
    min: 0,
    max: 10
  });
  var headers = '';
  for (var i = 0; i < headersSize; i++) {
    headers += 'X-' + chance.word() + ': ' + chance.word() + '\n';
  }
  var payload = isPayload ? chance.paragraph() : '';
  var requestName = isHistory ? null : chance.sentence({
    words: 2
  });
  var item = {
    'project': 0,
    'url': chance.url(),
    'method': chance.pick(isPayload ? payloadMethods : otherMethods),
    'headers': headers,
    'payload': payload,
    'time': chance.hammertime()
  };
  if (!isHistory) {
    item.name = requestName;
  }
  var creator = new HAR.Creator({
    name: 'Advanced REST client',
    version: arc.app.utils.appVer,
    comment: 'Created during file import'
  });
  var browser = new HAR.Browser({
    name: 'Chrome',
    version: arc.app.utils.chromeVersion
  });
  var log = new HAR.Log({
    'comment': 'Imported from the file.',
    'version': 1.2,
    'creator': creator,
    'browser': browser
  });
  var requestHeaders = arc.app.headers.toJSON(item.headers);
  var request = new HAR.Request({
    url: item.url,
    httpVersion: 'HTTP/1.1',
    method: item.method
  });
  if (['GET', 'HEAD'].indexOf(item.method) === -1) {
    //Do not pass encoding for not-payload requests
    arc.app.headers._oldCombine(requestHeaders, item.encoding);
    var contentType = arc.app.headers.getContentType(requestHeaders) ||
      'application/x-www-form-urlencoded';
    var post = new HAR.PostData({
      mimeType: contentType,
      text: item.payload
    });
    request.postData = post;
  }
  request.headers = requestHeaders;
  var page = new HAR.Page({
    id: arc.app.db.idb.createRequestKey(item.method, item.url),
    title: item.name,
    startedDateTime: new Date(item.time),
    pageTimings: {}
  });
  var entry = new HAR.Entry({
    startedDateTime: new Date(item.time),
    request: request,
    response: {
      status: '0',
      statusText: 'No response'
    }
  });
  entry.setPage(page);
  log.addPage(page);
  log.addEntry(entry, page.id);

  var obj = new RequestObject({
    'har': log,
    'url': item.url,
    'method': item.method,
    'type': isHistory ? 'history' : 'saved'
  });
  if (!isHistory) {
    obj.name = item.name;
  }
  return obj;
};
var getRequestData = function(dataSize, isHistory) {
  var list = [];
  for (var i = 0; i < dataSize; i++) {
    list.push(generateRequestData(isHistory));
  }
  return list;
};

var generateProjectData = function() {
  var schema = new ProjectObject({
    created: chance.hammertime(),
    name: chance.sentence({
      words: 2
    }),
    requestIds: []
  });
  return schema;
};

var getProjectData = function(dataSize) {
  var list = [];
  for (var i = 0; i < dataSize; i++) {
    list.push(generateProjectData());
  }
  return list;
};

var generateRandomDB = function() {
  var requestsSize = 1024*2;
  var projectsSize = 20;
  var historySize = 1024*4;
  var requests = getRequestData(requestsSize, true);
  var history = getRequestData(historySize, false);

  var allRequests = requests.concat(history);
  history = requests = null;
  return arc.app.db.idb.open()
  .then(function(db) {
    return db.transaction('rw', db.requestObject, () => {
      let promises = [];
      allRequests.forEach((item) => {
        promises.push(db.requestObject.put(item));
      });
      return Dexie.Promise.all(promises);
    })
    .then((insertIds) => {
      var saved = [];
      allRequests.forEach((request, i) => {
        if (request.type !== 'saved') {
          return;
        }
        request.id = insertIds[i];
        saved.push(request);
      });
      return saved;
    })
    .then((saved) => {
      return db.transaction('rw', db.projectObjects, () => {
        let promises = [];
        for (let i = 0; i < projectsSize; i++) {
          if (saved.length === 0) {
            break;
          }
          let includedRequests = chance.integer({
            min: 1,
            max: Math.min(25, saved.length)
          });
          let project = generateProjectData();
          for (var j = 0; j < includedRequests; j++) {
            var requestIndex = chance.integer({
              min: 0,
              max: saved.length - 1
            });
            let req = saved.splice(requestIndex,1)[0];
            project.requestIds.push(req.id);
          }
          promises.push(db.projectObjects.put(project));
        }
        return Dexie.Promise.all(promises);
      });
    })
    .finally(() => db.close());
  });
};
