(function(i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r;
  i[r] = i[r] || function() {
    (i[r].q = i[r].q || []).push(arguments)
  }, i[r].l = 1 * new Date();
  a = s.createElement(o),
    m = s.getElementsByTagName(o)[0];
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
var legacyTracker = {
  'trackingId': 'UA-18021184-6',
  'cookieDomain': 'auto',
  'name': 'legacy'
};
ga('create', legacyTracker);
ga('legacy.set', 'checkProtocolTask', null);
ga('legacy.set', 'appName', 'ARC');
ga('legacy.set', 'appId', 'org.rest.client');
var version = (chrome && chrome.runtime && chrome.runtime.getManifest) ?
  chrome.runtime.getManifest().version : 'Unknown';
ga('legacy.set', 'appVersion', version);
ga('legacy.set', 'dimension2', version);
var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
var chromeVer = raw ? raw[2] : '(not set)';
ga('legacy.set', 'dimension1', chromeVer);

if (chrome && chrome.storage && chrome.storage.sync) {
  chrome.storage.sync.get({
    'appuid': null
  }, function(data) {
    if (data.appuid) {
      ga('legacy.set', 'userId', data.appuid);
    } else {
      data.appuid = arc.app.utils.uuid();
      chrome.storage.sync.set(data, function() {
        ga('legacy.set', 'userId', data.appuid);
      });
    }
  });
}

window.Polymer = window.Polymer || {};
window.Polymer.dom = 'shadow';
