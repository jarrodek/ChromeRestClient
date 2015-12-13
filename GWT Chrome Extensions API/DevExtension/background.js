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