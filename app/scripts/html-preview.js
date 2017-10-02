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
