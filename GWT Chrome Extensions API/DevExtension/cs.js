/**
 * This content script file will pass message from GWT page to background page
 * and will pass response back.
 */
window.addEventListener("message", receiveMessage, false);

function receiveMessage(e) {
	if (e.origin != location.origin) {
		return;
	}
	;
	var data;
	try {
		data = JSON.parse(e.data);
	} catch (e) {
		return;
	}

	if (!(data && data.source && data.source == "dev:gwt"))
		return;

	if (data.payload) {
		switch (data.payload) {
		case 'setEnvironment':
			chrome.extension.sendMessage(data, function(response) {
			});
			break;
		default:
			chrome.extension.sendMessage(data, function(response) {
				window.postMessage({
					"source" : "dev:cs",
					"payload" : data.payload,
					"data" : response
				}, location.href);
			});
			break;
		}
	}
}