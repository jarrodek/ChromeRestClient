var dev = false;

var requestFilter = {
	urls : [ "<all_urls>" ],
	//types : [ "xmlhttprequest" ]
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
	if (!(requestDetails.URL == details.url || details.url
			.indexOf(requestDetails.URL) > -1))
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
	if (!(requestDetails.URL == details.url || details.url
			.indexOf(requestDetails.URL) > -1))
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
	//
	// It takes too long :( redirect is faster...
	//
	var rule = declarativeRequest.currentRules;
	rule.conditions.url = declarativeRequest._getUrlData(details.redirectUrl);
	declarativeRequest.currentRules = rule;
	
	chrome.declarativeWebRequest.onRequest.addRules([rule],
	function callback(details) {
		declarativeRequest.previousRules = details;
	});
}

function onRequestCompleted(details){
	var currentCheckUrl = requestDetails.URL;
	if(redirectDetails.currentUrl != null){
		currentCheckUrl = redirectDetails.currentUrl;
	}
	
	if (currentCheckUrl == null || !details.url)
		return;
	if (!(requestDetails.URL == details.url || details.url
			.indexOf(requestDetails.URL) > -1))
		return;
	requestDetails.RESPONSE_HEADERS = details.responseHeaders;
}
function onRequestError(details){
	console.log(details);
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
chrome.webRequest.onErrorOccurred.addListener(onRequestError,requestFilter);

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
	case "copyToClipboard":
		var copyData = request.data;
		var clipboardholder = document.createElement("textarea");
        document.body.appendChild(clipboardholder);
		clipboardholder.value = copyData;
		clipboardholder.select();
		document.execCommand("Copy");
        clipboardholder.parentNode.removeChild(clipboardholder);
		break;
	}
}



var declarativeRequest = {
	currentRules: {},
	notSupportedW3CHeaders : "accept-charset,accept-encoding,connection,content-length,cookie,cookie2,content-transfer-encoding,date,expect,host,keep-alive,referer,te,trailer,transfer-encoding,upgrade,user-agent,via,origin,proxy,sec"
			.split(","),
	requestData : null,
	previousRules : null,
	
	
	
	
	
	/**
	 * By default remove this headers from request (if they are not set by user):
	 * accept,accept-charset,accept-encoding,accept-language,connection,content-type,host,if-modified-since,if-none-match,origin,referer,user-agent
	 * This headers are set by default by browser and should not be included into request.
	 */
	setRules : function(_requestData) {
		// console.log('declarativeRequest',_requestData);

		// unregister earlier rules (if any)
		declarativeRequest.unregisterEarlierRules();

		// hold current request data
		declarativeRequest.requestData = _requestData;

		// extract request headers
		var requestHeaders = declarativeRequest
				.parseHeaders(_requestData.headers);
		var requestHeadersLength = requestHeaders.length;
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
		
		
		var requestActions = [];

		// register rules in declarativeRequest to add headers just before
		// request send.
		var addActions = declarativeRequest._getUnsupportedHeadersActions(unsupportedHeadersList);
		if(addActions != null){
			requestActions = requestActions.concat(addActions);
		}
		
		
		
		
		//
		// Here's a trick.
		// Browser, by default, set some headers. We don't want them.
		// Remove all request headers set by browser by default and that are not set by user
		// (can't remove and set headers in one request by this API)
		//
		var defaultHeaders = "accept,accept-charset,accept-encoding,accept-language,access-control-request-headers,cache-control,access-control-request-method,connection,content-type,host,if-modified-since,if-none-match,origin,referer,user-agent".split(",");
		var requestHeadersKeys = [];
		for(var i=0; i<requestHeadersLength;i++){
			requestHeadersKeys[requestHeadersKeys.length] = requestHeaders[i].name.toLowerCase();
		}
		
		var removeHeaders = defaultHeaders.filter(function(element, index, array){ 
			if(requestHeadersKeys.indexOf(element)!=-1) 
				return false; 
			return true 
		});
		
		var removeActions = declarativeRequest._getRemoveHeadersActions(removeHeaders);
		if(removeActions != null){
			requestActions = requestActions.concat(removeActions);
		}
		
		if(requestActions.length == 0){
			return;
		}
		
		var rule = {
			id : null,
			priority : 100,
			conditions : [ new chrome.declarativeWebRequest.RequestMatcher({
				url : declarativeRequest._getUrlData(_requestData.url),
				resourceType : [ "xmlhttprequest" ]
			})],
			actions : requestActions
		};
		declarativeRequest.currentRules = rule;
		
		chrome.declarativeWebRequest.onRequest.addRules([rule],
			function callback(details) {
				declarativeRequest.previousRules = details;
			});
	},
	
	/**
	 * Create URL object from request url for Rule object.
	 */
	_getUrlData: function(requestUrl){
		var parser = document.createElement('a');
		parser.href = requestUrl;

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
		return urlData;
	},
	/**
	 * Remove selected headers from request.
	 */
	_getRemoveHeadersActions: function(removeHeaders){
		var removeHeadersLength = removeHeaders.length;
		if (removeHeadersLength == 0)
			return null;
		// create actions
		var actions = [];
		for (var i = 0; i < removeHeadersLength; i++) {
			var header = removeHeaders[i];
			actions[actions.length] = new chrome.declarativeWebRequest.RemoveRequestHeader({name:header});
		}
		return actions;
	},
	/**
	 * Set headers that cen't be set via XMLHttpRequest
	 */
	_getUnsupportedHeadersActions: function(unsupportedHeadersList){
		if (unsupportedHeadersList.length == 0)
			return null;
		// create actions
		var actions = [];
		for ( var i = 0; i < unsupportedHeadersList.length; i++) {
			var header = unsupportedHeadersList[i];
			actions[actions.length] = new chrome.declarativeWebRequest.SetRequestHeader(header);
		}
		return actions;
	},
	
	unregisterEarlierRules : function() {
		chrome.declarativeWebRequest.onRequest.removeRules();
	},
	parseHeaders : function(str) {
		var result = [];
		if(!str){
			return result;
		}
		var headers = str.split(/\n/);
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
 *            message - (any data) The message sent by the calling script. It's must be javascript object described in the bottom of this file.
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
 * Found at http://note19.com/2007/05/27/javascript-guid-generator/
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
 * If you want to run this application either from other extension/application or webIntent you need to pass a message object:
 * <ul>
 * <li>"payload" (required) - message payload: "create" to open new application window with values; (other payloads may be available in future). 
 * <li>"data" - (required) javascript object with any of values:
 * <ul> 
 * 		<li>url - (String) request URL to set</li>
 * 		<li>method - (String) request method to set</li>
 * 		<li>headers - (String) an RFC string representing request headers 
 * 					example: >>> User-Agent: X-Extension 
 * 								 X-header: header value; second value <<< 
 * 		<li>payload - (String) data to pass into payload field. Only for http methods that carry payload data</li> 
 * 		<li>encoding - (String) data form encoding</li>
 * </ul> 
 * </ul>
 * <p>Every entry in "data" parameter is optional. Any other parameters are not used by application.</p>
 * 
 * 
 * Example of usage:
 * <pre>
 * var message = { 'payload': 'create', 'data': { 'url': 'http://www.google.com/', 'method': 'GET', 'headers': "User-Agent: Chrome-Extension\nX-extension-id: SomeID" } };
 * </pre>
 * Via extensions message passing system:
 * <pre>
 * chrome.extension.sendMessage(THIS_APPLICATION_ID_FROM_CHROME_WEB_STORE, message, function(response) {});
 * </pre>
 * Via webIntents:
 * <pre>
 * window.Intent = window.Intent || window.WebKitIntent;
 * window.navigator.startActivity = window.navigator.startActivity ||
 * window.navigator.webkitStartActivity;
 * 
 * var params = { "action": "http://webintents.org/view", "type": "application/restclient+data" , "data": message }; var i = new
 * WebKitIntent(params); var onSuccess = function(data) {console.log(data);};
 * var onFailure = function() {console.log('intent error')};
 * navigator.webkitStartActivity(i, onSuccess, onFailure);
 * </pre>
 */
