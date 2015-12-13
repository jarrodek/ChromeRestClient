'use strict'
/**
 * GWT namespace
 */
var gwt = gwt || {};
/**
 * GWT development namespace
 */
gwt.dev = gwt.dev || {};

/**
 * Chrome extension namespace
 */
gwt.dev.background = gwt.dev.background || {};
/**
 * Handle message from content script. 
 */
gwt.dev.background.handleMessage = function(request, sender, sendResponse){
	
	if (request.payload.indexOf(".") !== -1) {
        let parts = request.payload.split('.');
        let call = chrome; //start with chrome namespace.
        let action = parts.pop(); //last part is the function name to call.
        parts.forEach(function(name){
        	call = call[name];
        });
        let params = request.params;
        
        let responseFn = function(result){
        	var response = {
    			'result': result
        	};
            if(chrome.runtime.lastError){
            	response.error = chrome.runtime.lastError; 
            }
            sendResponse(response);
        };
        if(gwt.dev.background.isSync(request.payload)){
    		var result = call[action].call(params, data); 
    		responseFn(result);
    	}
        call[action].call(params, data, responseFn);
    }
	
	return true; // must return true so the port will not be closed when this function finish.
};
/**
 * Some Chrome APIs are synchronous and it should be called differently. 
 */
gwt.dev.background.isSync = function(payload){
	var fns = new Set();
	fns.add("runtime.getManifest");
	fns.add("runtime.getURL");
	fns.add("runtime.reload");
	fns.add("runtime.restart");
	fns.add("runtime.connect");
	fns.add("runtime.connectNative");
	fns.add("alarms.create");
	fns.add("browserAction.setTitle");
	fns.add("browserAction.setPopup");
	fns.add("browserAction.setBadgeText");
	fns.add("browserAction.setBadgeBackgroundColor");
	fns.add("browserAction.enable");
	fns.add("browserAction.disable");
	fns.add("desktopCapture.cancelChooseDesktopMedia");
	fns.add("devtools.inspectedWindow.reload");
	fns.add("downloads.open");
	fns.add("downloads.show");
	fns.add("downloads.showDefaultFolder");
	fns.add("downloads.drag");
	fns.add("downloads.setShelfEnabled");
	fns.add("extension.getURL");
	fns.add("extension.getViews");
	fns.add("extension.getBackgroundPage");
	fns.add("extension.getExtensionTabs");
	fns.add("extension.setUpdateUrlData");
	fns.add("i18n.getMessage");
	fns.add("i18n.getUILanguage");
	fns.add("identity.getRedirectURL");
	fns.add("idle.setDetectionInterval");
	fns.add("input.ime.hideInputView");
	fns.add("input.ime.keyEventHandled");
	fns.add("omnibox.setDefaultSuggestion");
	fns.add("pageAction.show");
	fns.add("pageAction.hide");
	fns.add("pageAction.setTitle");
	fns.add("pageAction.setPopup");
	fns.add("platformKeys.subtleCrypto");
	fns.add("power.requestKeepAwake");
	fns.add("power.releaseKeepAwake");
	fns.add("tabs.connect");
	fns.add("tts.stop");
	fns.add("tts.pause");
	fns.add("tts.resume");
	fns.add("location.watchLocation");
	fns.add("location.clearWatch");
	return fns.has(payload);
};

/**
 * Registers listener to handle extension message passing from content script.
 */
chrome.runtime.onMessage.addListener(gwt.dev.background.handleMessage);

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