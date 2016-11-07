'use strict';
/**
 * This is similar to mock-data.js but generates data for the new structure.
 *
 * <script src="test/chance.js"></script><script src="test/data-generator.js"></script>
 */
/* global chance */
if (typeof chance === 'undefined') {
  throw new Error('Run chance script first');
}
if (typeof pouchCollate === 'undefined') {
  throw new Error('Run pouchdb-collate script first');
}

function dayToday(timestamp) {
  var d = new Date(timestamp);
  var tCheck = d.getTime();
  if (tCheck !== tCheck) {
    throw new Error('Invalid timestamp: ' + timestamp);
  }
  d.setMilliseconds(0);
  d.setSeconds(0);
  d.setMinutes(0);
  d.setHours(0);
  return d.getTime();
}

function uuid() {
  // jscs:disable
  /* jshint ignore:start */
  var lut = [];
  for (var i = 0; i < 256; i++) {
    lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
  }
  var fn = function() {
    var d0 = Math.random() * 0xffffffff | 0;
    var d1 = Math.random() * 0xffffffff | 0;
    var d2 = Math.random() * 0xffffffff | 0;
    var d3 = Math.random() * 0xffffffff | 0;
    return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] +
      lut[d0 >> 24 & 0xff] + '-' + lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' +
      lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' + lut[d2 & 0x3f | 0x80] +
      lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
      lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
  };
  return fn();
  // jscs:enable
  /* jshint ignore:end */
}

function createTimings() {
  var result = {
    connect: chance.floating({min: 0, max: 100, fixed: 12}),
    send: chance.floating({min: 0, max: 100, fixed: 12}),
    wait: chance.floating({min: 0, max: 100, fixed: 12}),
    receive: chance.floating({min: 0, max: 100, fixed: 12}),
    ssl: chance.floating({min: 0, max: 100, fixed: 12})
  };
  var total = result.connect + result.send + result.wait + result.receive + result.ssl;
  return {
    timings: result,
    totalTime: total
  };
}

function generateHistoryData(opts) {
  opts = opts || {};
  var isPayload = chance.bool();
  var payloadMethods = ['POST', 'PUT', 'DELETE', 'OPTIONS'];
  var otherMethods = ['GET', 'HEAD'];
  var headersSize = chance.integer({
    min: 0,
    max: 10
  });
  var headers = '';
  var responseHeaders = '';
  for (var i = 0; i < headersSize; i++) {
    headers += 'X-' + chance.word() + ': ' + chance.word() + '\n';
    responseHeaders += 'X-' + chance.word() + ': ' + chance.word() + '\n';
  }
  if (isPayload) {
    headers += 'content-type: application/x-www-form-urlencoded';
  }
  var payload = isPayload ? chance.paragraph() : '';
  var responsePayload = chance.paragraph();
  responseHeaders += 'Content-Type:text/html; charset=utf-8\n';
  responseHeaders += 'Date: ' + chance.date().toISOString();
  responseHeaders += '\nTransfer-Encoding: chunked';
  responseHeaders += '\nLast-Modified: ' + chance.date().toISOString();
  responseHeaders += '\nAccess-Control-Allow-Origin: *';
  responseHeaders += '\nExpires: ' + chance.date().toISOString();
  responseHeaders += '\nCache-Control: max-age=600';
  responseHeaders += '\nContent-Encoding: gzip';
  var url;
  if (opts.predictable) {
    let urls = [
      'http://mulesoft.com',
      'https://google.com',
      'https://facebook.com',
      'https://github.com',
      'https://linkedin.com',
      'https://restforchrome.blogspot.com',
      'http://localhost:8081/json'
    ];
    let index = chance.integer({min: 0, max: urls.length - 1});
    url = urls[index];
    if (!url) {
      throw new Error('DATA GENERATION ERROR. URL is empty.');
    }
  } else {
    url = chance.url();
  }
  var t = createTimings();
  var httpMethod = chance.pick(isPayload ? payloadMethods : otherMethods);
  var item = {
    _id: encodeURIComponent(url) + '/' + httpMethod + '/' + uuid(),
    created: chance.hammertime(),
    request: {
      url: url,
      method: httpMethod,
      headers: headers,
      payload: payload,
    },
    response: {
      headers: responseHeaders,
      payload: responsePayload,
      statusCode: 200,
      statusText: 'OK'
    },
    stats: {
      request: {
        headersSize: headers ? headers.length : 0,
        payloadSize: payload ? payload.length : 0
      },
      response: {
        headersSize: responseHeaders ? responseHeaders.length : 0,
        payloadSize: responsePayload ? responsePayload.length : 0
      }
    },
    timings: t.timings,
    totalTime: t.totalTime
  };
  return item;
}

function generateRequestData(isHistory) {
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
  if (isPayload) {
    headers += 'content-type: application/x-www-form-urlencoded';
  }
  var payload = isPayload ? chance.paragraph() : '';
  var requestName = isHistory ? null : chance.sentence({
    words: 2
  });

  var item = {
    'url': chance.url(),
    'method': chance.pick(isPayload ? payloadMethods : otherMethods),
    'headers': headers,
    'payload': payload,
    'created': chance.hammertime(),
    'updated': chance.hammertime()
  };
  if (!isHistory) {
    item.type = 'saved';
    item.name = requestName;
  }
  if (isHistory) {
    var today = dayToday(item.updated);
    item._id = today + '/' + encodeURIComponent(item.url) + '/' + item.method;
  } else {
    item._id = encodeURIComponent(item.name) + '/' + encodeURIComponent(item.url) + '/' +
      item.method;
  }
  return item;
}

/* Generate random history data visible in the history panel */
function generateHistoryRequestList(howMany) {
  howMany = howMany || 200;
  var list = [];
  for (var i = 0; i < howMany; i++) {
    list.push(generateRequestData(true));
  }
  return list;
}
/* Generate random saved data visible in the saved panel */
function generateSavedDataList(howMany) {
  howMany = howMany || 200;
  var list = [];
  for (var i = 0; i < howMany; i++) {
    list.push(generateRequestData(false));
  }
  return list;
}

function generateHistoryDataList(howMany) {
  howMany = howMany || 200;
  var list = [];
  for (var i = 0; i < howMany; i++) {
    list.push(generateHistoryData());
  }
  return list;
}

function generatePredictableHistoryDataList(howMany) {
  howMany = howMany || 200;
  var list = [];
  for (var i = 0; i < howMany; i++) {
    list.push(generateHistoryData({
      predictable: true
    }));
  }
  return list;
}

function insertMockData(howMany) {
  howMany = howMany || 200;
  console.log('Generating data');
  var history = generateHistoryRequestList(howMany);
  console.log('History: OK');
  var saved = generateSavedDataList(howMany);
  console.log('Saved: OK');
  var historyData = generateHistoryDataList(howMany);
  console.log('History data: OK');
  return new PouchDB('history-requests').bulkDocs(history)
  .then(() => {
    return new PouchDB('saved-requests').bulkDocs(saved);
  })
  .then(() => {
    return new PouchDB('history-data').bulkDocs(historyData);
  });
}

function insertPredictableData(howMany) {
  howMany = howMany || 200;
  var historyData = generatePredictableHistoryDataList(howMany);
  console.log('Data generated');
  return new PouchDB('history-data').bulkDocs(historyData);
}
