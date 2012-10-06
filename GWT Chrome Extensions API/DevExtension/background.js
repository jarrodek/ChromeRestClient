var dev = false;


/**
 * Registers listener to handle extension message passing from content script.
 */
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	handleInternalMessage(request,sendResponse);
	return true;
});

/**
 * This is workaround for GWT dev mode can't be in extension environment in one time.
 * Load this extension into chrome/chromium and use included modules. 
 * 
 * 
 * @param request
 * @param sendResponse
 */
function handleInternalMessage(request,sendResponse){
	if (!request.payload)
		return;

	switch (request.payload) {
	case 'setEnvironment':
		var data = JSON.parse(request.data);
		for (var key in data) {
			window[key] = data[key];
		}
		sendResponse({
			'payload' : 'setEnvironment',
			'result' : true
		});
		break;
	default:
		if(request.payload.indexOf('.')==-1){
			sendResponse({'error':'Unknown payload'});
			return;
		}
		//assume that {request.payload} is chrome api call path like:
		//chrome.runtime.getManifest
		var c = request.payload.split('.')
		var call = chrome;
		var action = c.pop();
		for(var i = 0; i<c.length; i++){
			call = call[c[i]];
		}
		var data = request.data ? JSON.parse(request.data) : null;
		var inline = data._inline ? true : false;
		var isProperty = data._property ? true : false;
		var isInlineArguments = data._inlineArguments ? true : false;
		delete data['_inline'];
		delete data['_property'];
		delete data['_inlineArguments'];
		if(isInlineArguments){
			data = data.args;
		}
		
		if(inline){
			var result = null;
			if(isProperty){
				result = call[action];
			} else {
				result = call[action].call(call,data);
			}
			if(typeof result == "object"){
				sendResponse(JSON.stringify(result));
			} else {
				sendResponse(result+"");
			}
		} else {
			call[action].call(call,data,function(result){
				if(typeof result == "object"){
					sendResponse(JSON.stringify(result));
				} else {
					sendResponse(result+"");
				}
			});
		}
		break;
	}
}