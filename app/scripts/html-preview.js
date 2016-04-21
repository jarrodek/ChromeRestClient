var messageHandler = function(event) {
  console.log(event);
  if (event.data.rawResponse) {
    document.body.innerHTML = event.data.rawResponse;
  }
};
window.addEventListener('message', messageHandler);
