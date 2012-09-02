var dev = false;

var requestFilter = {
	urls : [ "<all_urls>" ],
	types : [ "xmlhttprequest" ]
}
var requestDetails = {
	URL : null,
	RESPONSE_HEADERS : null,
	REQUEST_HEADERS : null,
	REDIRECT_DATA : []
};
var redirectDetails = {
	currentUrl: null	
}
window.externalDataHolder = {};

/**
 * Called when request's headers has been sent. It filter requests by current
 * set URL. After request filter URL is cleared.
 * 
 * @param details
 */
function onHeadersSend(details) {
	if (requestDetails.URL == null || !details.url)
		return;
	if (!(requestDetails.URL == details.url || requestDetails.URL
			.indexOf(details.url) > -1))
		return;
	requestDetails.REQUEST_HEADERS = details.requestHeaders;
}
function onBeforeRedirect(details) {
	
	var currentCheckUrl = requestDetails.URL;
	if(redirectDetails.currentUrl != null){
		currentCheckUrl = redirectDetails.currentUrl;
	}
	
	if (currentCheckUrl == null || !details.url)
		return;
	if (!(currentCheckUrl == details.url || currentCheckUrl
			.indexOf(details.url) > -1))
		return;
	var data = {
		fromCache : details.fromCache,
		redirectUrl : details.redirectUrl,
		statusCode : details.statusCode,
		statusLine : details.statusLine,
		responseHeaders : details.responseHeaders,
	}
	requestDetails.REDIRECT_DATA[requestDetails.REDIRECT_DATA.length] = data;
	redirectDetails.currentUrl = details.redirectUrl;
}

function onRequestCompleted(details){
	var currentCheckUrl = requestDetails.URL;
	if(redirectDetails.currentUrl != null){
		currentCheckUrl = redirectDetails.currentUrl;
	}
	
	if (currentCheckUrl == null || !details.url)
		return;
	if (!(currentCheckUrl == details.url || currentCheckUrl
			.indexOf(details.url) > -1))
		return;
	requestDetails.RESPONSE_HEADERS = details.responseHeaders;
}

/**
 * Register Web Requests listeners to handle sent/received headers info in
 * proper way (get all info) See more at <a
 * href="http://developer.chrome.com/extensions/webRequest.html">http://developer.chrome.com/extensions/webRequest.html</a>
 */
chrome.webRequest.onSendHeaders.addListener(onHeadersSend, requestFilter,
		[ 'requestHeaders' ]);
chrome.webRequest.onBeforeRedirect.addListener(onBeforeRedirect, requestFilter,
		[ 'responseHeaders' ]);
chrome.webRequest.onCompleted.addListener(onRequestCompleted, requestFilter,
		[ 'responseHeaders' ]);


window.requestAction = function(request, callback){
	callback = callback || new Function();
	handleInternalMessage(request,function(responseObj){
		callback(responseObj);
	});
}

/**
 * Registers listener to handle extension message passing from content script.
 */
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	handleInternalMessage(request,sendResponse);
	return true;
});


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
	case 'runFromIntent':
		if (request.intent.action == "http://webintents.org/view"
				&& request.intent.type == "application/restclient+data") {
			var data = request.intent.data;
			if (data == null)
				return;
			switch (data.payload) {
			case 'create':
				runApplication(data.data);
				break;
			}
		}

		break;
	case 'requestBegin':
		// console.log('requestBegin');
		var data = JSON.parse(request.data);
		requestDetails.URL = data.url;
		requestDetails.REQUEST_HEADERS = null;
		requestDetails.RESPONSE_HEADERS = null;
		requestDetails.REDIRECT_DATA = [];
		redirectDetails.currentUrl = null;
		declarativeRequest.setRules(data);

		sendResponse({
			'payload' : 'requestBegin'
		});
		break;
	case 'getRequestData':
//		console.log('requestDetails summary',requestDetails);
		sendResponse(JSON.stringify(requestDetails));
		requestDetails.URL = null;
		requestDetails.REQUEST_HEADERS = null;
		requestDetails.RESPONSE_HEADERS = null;
		requestDetails.REDIRECT_DATA = [];
		redirectDetails.currentUrl = null;
		break;
	case 'getExternalData':
		var externalUUid = request.data;
		var externalData = null;
		if (externalUUid in window.externalDataHolder) {
			externalData = window.externalDataHolder[externalUUid];
			delete window.externalDataHolder[externalUUid];
		}
		if (externalData == null) {
			sendResponse({
				'payload' : 'getExternalData',
				'data' : JSON.stringify({
					'error' : true,
					'message' : 'No data available :(',
					'data' : null
				})
			});
		}
		sendResponse({
			'payload' : 'getExternalData',
			'data' : JSON.stringify({
				'error' : false,
				'data' : externalData
			})
		});
		break;
	}
}



var declarativeRequest = {
	notSupportedW3CHeaders : "accept-charset,accept-encoding,connection,content-length,cookie,cookie2,content-transfer-encoding,date,expect,host,keep-alive,referer,te,trailer,transfer-encoding,upgrade,user-agent,via,origin,proxy,sec"
			.split(","),
	requestData : null,
	previousRules : null,
	setRules : function(_requestData) {
		// console.log('declarativeRequest',_requestData);

		// unregister earlier rules (if any)
		declarativeRequest.unregisterEarlierRules();

		// hold current request data
		declarativeRequest.requestData = _requestData;

		// extract request headers
		var requestHeaders = declarativeRequest
				.parseHeaders(_requestData.headers);
		// check if request contains unsupported by w3c headers
		var unsupportedHeadersList = [];
		for ( var i in requestHeaders) {
			var header = requestHeaders[i];
			if (declarativeRequest.notSupportedW3CHeaders.indexOf(header.name
					.toLowerCase()) != -1) {
				// has unsupported header
				unsupportedHeadersList[unsupportedHeadersList.length] = header;
			}
		}
		if (unsupportedHeadersList.length == 0)
			return;

		// register rules in declarativeRequest to add headers just before
		// request send.

		// create actions
		var actions = [];
		for ( var i = 0; i < unsupportedHeadersList.length; i++) {
			var header = unsupportedHeadersList[i];
			actions[actions.length] = new chrome.declarativeWebRequest.SetRequestHeader(
					header);
		}
		var parser = document.createElement('a');
		parser.href = _requestData.url;

		var urlData = {};
		if (parser.hostname) {
			urlData.hostEquals = parser.hostname;
		}
		if (parser.protocol) {
			urlData.schemes = [ parser.protocol.replace(':', '') ];
		}
		if (parser.port) {
			urlData.ports = [ parseInt(parser.port) ];
		}
		if (parser.pathname) {
			urlData.pathEquals = parser.pathname;
		}
		if (parser.search) {
			urlData.queryEquals = parser.search;
		}
		var rule = {
			id : null,
			priority : 100,
			conditions : [ new chrome.declarativeWebRequest.RequestMatcher({
				url : urlData,
				resourceType : [ "xmlhttprequest" ]
			}), ],
			actions : actions
		}
		chrome.declarativeWebRequest.onRequest.addRules([ rule ],
				function callback(details) {
					declarativeRequest.previousRules = details;
				});
	},
	unregisterEarlierRules : function() {
		chrome.declarativeWebRequest.onRequest.removeRules();
	},
	parseHeaders : function(str) {
		var headers = str.split(/\n/);
		var result = [];
		for ( var i in headers) {
			var header = headers[i];
			var headerData = header.split(/:\s?/);
			result[result.length] = {
				name : headerData.shift(),
				value : headerData.join(":")
			}
		}
		return result;
	}
}

/**
 * External extension communication.
 * 
 * @param details:
 *            message - (any data) The message sent by the calling script.
 *            sender - (object): tab - This property will only be present when
 *            the connection was opened from a tab or content script; id - The
 *            extension ID of the extension that opened the connection.
 *            sendResponse - (function) Function to call (at most once) when you
 *            have a response. The argument should be any JSON-ifiable object.
 * 
 * To run application from external extension just pass message to it.
 * 
 * For message description go to the end of this file.
 * 
 * In response callback it will return object with one of values: "success":
 * [true|false], "message": (String, optional) error message
 */
chrome.extension.onMessageExternal.addListener(function(message, sender,
		sendResponse) {

	var availablePayload = "create".split(',');
	if (!message.payload || availablePayload.indexOf(message.payload) == -1) {
		sendResponse({
			"error" : true,
			"message" : "Unknown payload"
		});
		return true;
	}
	var result = {
		"success" : true
	};
	switch (message.payload) {
	case 'create':
		if (!message.data) {
			sendResponse({
				"error" : true,
				"message" : "Required data parameter is not available."
			});
			return;
		}
		runApplication(message.data);
		break;
	}
	sendResponse(result);
	return true;
});

function runApplication(requestDetails) {
	var uuid = guidGenerator();
	var viewTabUrl = '';
	if (dev) {
		viewTabUrl = 'http://127.0.0.1:8888/RestClient.html?gwt.codesvr=127.0.0.1:9997#RequestPlace:external/'
				+ uuid;
	} else {
		viewTabUrl = chrome.extension
				.getURL('RestClient.html#RequestPlace:external/' + uuid);
	}
	window.externalDataHolder[uuid] = requestDetails;
	chrome.tabs.create({
		url : viewTabUrl
	});
}

/**
 * Taen from http://note19.com/2007/05/27/javascript-guid-generator/
 * 
 * @returns {String}
 */
function guidGenerator() {
	var S4 = function() {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	};
	return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4()
			+ S4() + S4());
}

/**
 * ======================================== External data structure
 * ======================================== If you want to run this application
 * either from other extension/application or webIntent you need to pass a
 * message object:
 * 
 * "payload" (required) - message payload: "create" to open new application
 * window with values; (other payloads may be available in future). "data" -
 * (required) javascript object with any of values: url - (String) request URL
 * to set method - (String) request method to set headers - (String) an RFC
 * string representing request headers example: >>> User-Agent: X-Extension
 * X-header: header value; second value <<< payload - (String) data to pass
 * into payload field. Only for http methods that carry payload data encoding -
 * (String) data form encoding Every entry in "data" parameter is optional. Any
 * other parameters are not used by application.
 * 
 * 
 * Example of usage:
 * 
 * var message = { 'payload': 'create', 'data': { 'url':
 * 'http://www.google.com/', 'method': 'GET', 'headers': "User-Agent:
 * Chrome-Extension\nX-extension-id: SomeID" } };
 * 
 * Via extensions message passing system:
 * chrome.extension.sendMessage(THIS_APPLICATION_ID_FROM_CHROME_WEB_STORE,
 * message, function(response) {});
 * 
 * Via webIntents:
 * 
 * window.Intent = window.Intent || window.WebKitIntent;
 * window.navigator.startActivity = window.navigator.startActivity ||
 * window.navigator.webkitStartActivity;
 * 
 * var params = { "action": "http://webintents.org/view", "type":
 * "application/restclient+data" , "data": message }; var i = new
 * WebKitIntent(params); var onSuccess = function(data) {console.log(data);};
 * var onFailure = function() {console.log('intent error')};
 * navigator.webkitStartActivity(i, onSuccess, onFailure);
 */
