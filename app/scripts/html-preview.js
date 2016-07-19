var notifyResize = function() {
  window.top.postMessage({
    'preview-window-height': document.body.clientHeight
  }, '*');
};

var messageHandler = function(event) {
  var data = event.data;
  if (data.rawResponse) {
    document.body.innerHTML = data.rawResponse;
    // console.log('Sending frame body height', document.body.clientHeight);
    window.setTimeout(notifyResize, 1);
  } else if (data.cleanUp) {
    document.body.innerHTML = '';
  }
};

window.addEventListener('message', messageHandler);
window.addEventListener('resize', notifyResize);

// window._registeredKeys = [];
//
// window.executeHotkeyTest = function(callback, keyValues) {
//   if (typeof callback !== 'function') {
//     throw new TypeError('Expected callback as first argument');
//   }
//   if (typeof keyValues !== 'object' && (!Array.isArray || Array.isArray(keyValues))) {
//     throw new TypeError('Expected array as second argument');
//   }
//   var allKeysValid = true;
//   for (var i = 0; i < keyValues.length; ++i) {
//     allKeysValid = allKeysValid && window._registeredKeys[keyValues[i]];
//   }
//   if (allKeysValid) {
//     callback();
//   }
// };
//
// window.addGlobalHotkey = function(callback, keyValues) {
//   if (typeof keyValues === 'number') {
//     keyValues = [keyValues];
//   }
//   var fnc = function(cb, val, e) {
//     window._registeredKeys[e.keyCode] = true;
//     window.executeHotkeyTest(cb, val);
//   };
//   window.addEventListener('keydown', fnc.bind(this, callback, keyValues));
//   return fnc;
// };
//
// window.addEventListener('keyup', function(e) {
//   window._registeredKeys[e.keyCode] = false;
// });
//
// var openSeach = () => {
//   //console.lopg('open search bar');
// };
// window.addGlobalHotkey(openSeach, [91, 70]);
// window.addGlobalHotkey(openSeach, [17, 70]);
