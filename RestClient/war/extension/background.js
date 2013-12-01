/**
 * Background page for Advanced Rest Client.
 * 
 */

var dev = false;
const CLIENT_ID = '10525470235.apps.googleusercontent.com';
const CLIENT_SECRET = '4DERCyUerlYZDmc7qbneQlgf';
const SCOPES = 'https://www.googleapis.com/auth/drive.install https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly.metadata';

if(typeof chrome.declarativeWebRequest == 'undefined'){
    chrome.declarativeWebRequest = {
        onRequest: {
            removeRules: function(){},
            addRules: function(){}
        }
    };
    chrome.declarativeWebRequest.RequestMatcher = function(){}
    chrome.declarativeWebRequest.RequestMatcher.prototype = {};
    chrome.declarativeWebRequest.RemoveRequestHeader = function(){}
    chrome.declarativeWebRequest.RemoveRequestHeader.prototype = {};
    chrome.declarativeWebRequest.SetRequestHeader = function(){}
    chrome.declarativeWebRequest.SetRequestHeader.prototype = {};
}

window.googleAuth = null;
function initOauth2Object(){
    window.googleAuth = new OAuth2('google', {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        api_scope: SCOPES
    });
}
window.externalDataHolder = {};


function WebRequest(){
    this.masterURL = null;
    this.redirectURL = null;
    this.responseHeaders = [];
    this.requestHeaders = [];
    this.redirectData = [];
	
    this.requestFilter = {
        urls : ["<all_urls>"],
        types : ["xmlhttprequest"]
    }
    this.notSupportedW3CHeaders = "accept-charset,accept-encoding,connection,content-length,cookie,cookie2,content-transfer-encoding,date,expect,host,keep-alive,referer,te,trailer,transfer-encoding,upgrade,user-agent,via,origin,proxy,sec".split(",");
    this.browserDefaultHeaders = "accept,accept-charset,accept-encoding,accept-language,access-control-request-headers,cache-control,cookie,access-control-request-method,connection,host,if-modified-since,if-none-match,origin,referer,user-agent".split(",");
}

WebRequest.prototype.reset = function(){
    this.masterURL = null;
    this.redirectURL = null;
    this.responseHeaders = [];
    this.requestHeaders = [];
    this.redirectData = [];
    this.errorData = {}
    this.clearRules();
}
WebRequest.prototype.getRequestData = function(){
    var requestDetails = {
        URL: this.masterURL,
        RESPONSE_HEADERS: this.responseHeaders,
        REQUEST_HEADERS: this.requestHeaders,
        REDIRECT_DATA: this.redirectData,
        ERROR: this.errorData
    };
    
    return requestDetails;
}
/**
 * Check if request url match tested URL 
 */
WebRequest.prototype.checkRequestUrl = function(details){
    if(details.url == null || details.url.length == 0){
        return false;
    }
	
    var currentCheckUrl = this.masterURL;
    if(this.redirectURL != null){
        currentCheckUrl = this.redirectURL;
    }
    if(currentCheckUrl == null || currentCheckUrl.length == 0){
        return false;
    }
    if (!(currentCheckUrl == details.url || details.url.indexOf(currentCheckUrl) > -1)){
        return false;
    }
    return true;
}
/**
 * Called when request's headers has been sent. It filter requests by current
 * set URL. After request filter URL is cleared.
 * 
 * @param details
 */
WebRequest.prototype.onHeadersSend = function(details){
    if(!this.checkRequestUrl(details)){
        return;
    }
    this.requestHeaders = details.requestHeaders;
}
/**
 * Called when the request will be redirected.
 * It is async call. Unable to update declarativeWebRequest filters
 * 
 * @param details
 */
WebRequest.prototype.onBeforeRedirect = function(details){
    if(!this.checkRequestUrl(details)){
        return;
    }
	
    var data = {
        fromCache : details.fromCache,
        redirectUrl : details.redirectUrl,
        statusCode : details.statusCode,
        statusLine : details.statusLine,
        responseHeaders : details.responseHeaders
    }
    
    this.redirectData[this.redirectData.length] = data;
    this.redirectURL = details.redirectUrl;
}
/**
 * Called when the request complete.
 * 
 * @param details
 */
WebRequest.prototype.onRequestCompleted = function(details){
    if(!this.checkRequestUrl(details)){
        return;
    }
	
    this.responseHeaders = details.responseHeaders;
    //
    // Clean rules or if the user will not call another request all XmlHttpRequest for this URL will be affected. 
    this.clearRules();
}
/**
 * Called when the request complete with error.
 * 
 * @param details
 */
WebRequest.prototype.onRequestError = function(details){
    if(!this.checkRequestUrl(details)){
        return;
    }
    //
    // Clean rules or if the user will not call another request all XmlHttpRequest for this URL will be affected. 
    this.clearRules();
    
    this.errorData = {
        error: details.error,
        fromCache: details.fromCache,
        timeStamp: details.timeStamp,
        url: details.url
    }
}

/**
 * Setup application, set rules, handlers etc.
 */
WebRequest.prototype.init = function(){
    /*
     * Register Web Requests listeners to handle sent/received headers info in
     * proper way (get all info) See more at <a
     * href="http://developer.chrome.com/extensions/webRequest.html">http://developer.chrome.com/extensions/webRequest.html</a>
     */
    chrome.webRequest.onSendHeaders.addListener(this.onHeadersSend.bind(this), this.requestFilter, ['requestHeaders']);
    chrome.webRequest.onBeforeRedirect.addListener(this.onBeforeRedirect.bind(this), this.requestFilter, ['responseHeaders']);
    chrome.webRequest.onCompleted.addListener(this.onRequestCompleted.bind(this), this.requestFilter, ['responseHeaders']);
    chrome.webRequest.onErrorOccurred.addListener(this.onRequestError.bind(this), this.requestFilter);
}

/**
 * Clear all rules set earlier to the declarativeWebRequest.
 */
WebRequest.prototype.clearRules = function(){
    //chrome.declarativeWebRequest.onRequest.removeRules();
}
/**
 * By default remove following headers from request (if they are not set by user):
 * accept,accept-charset,accept-encoding,accept-language,connection,host,if-modified-since,if-none-match,origin,referer,user-agent
 * This headers are set by default by browser and should not be included into request.
 */
WebRequest.prototype.setRules = function(requestData){
	return;
    this.clearRules();
    var i = 0;
    // extract request headers
    var requestHeaders = this.parseHeaders(requestData.headers);
    var requestHeadersLength = requestHeaders.length;
    // check if request contains unsupported by w3c headers
    var unsupportedHeadersList = [];
    for (i in requestHeaders) {
        var header = requestHeaders[i];
        if (this.notSupportedW3CHeaders.indexOf(header.name.toLowerCase()) != -1) {
            // has unsupported header
            unsupportedHeadersList[unsupportedHeadersList.length] = header;
        }
    }
	
    var requestActions = [];
    // register rules in declarativeRequest to add headers just before
    // request send.
    var addActions = this.getUnsupportedHeadersActions(unsupportedHeadersList);
    if(addActions != null){
        requestActions = requestActions.concat(addActions);
    }
	
    //
    // Here's a trick.
    // Browser, by default, set some headers. We don't want them.
    // Remove all request headers set by browser by default and that are not set by user
    // (can't remove and set headers in one request by this API)
    //
	
    var requestHeadersKeys = [];
    for(i=0; i<requestHeadersLength; i++){
        requestHeadersKeys[requestHeadersKeys.length] = requestHeaders[i].name.toLowerCase();
    }
	
    var removeHeaders = this.browserDefaultHeaders.filter(function(element, index, array){ 
        if(requestHeadersKeys.indexOf(element)!=-1) 
            return false; 
        return true 
    });
	
    var removeActions = this.getRemoveHeadersActions(removeHeaders);
    if(removeActions != null){
        requestActions = requestActions.concat(removeActions);
    }
	
    if(requestActions.length == 0){
        return;
    }
	
    var rule = {
        id: null,
        priority: 100,
        conditions: [new chrome.declarativeWebRequest.RequestMatcher({
            url: this.getUrlData(requestData.url),
            resourceType : ["xmlhttprequest"]
        })],
        actions : requestActions
    };
	
    chrome.declarativeWebRequest.onRequest.addRules([rule], function callback(details) {});
}
/**
 * Create URL object from request url for Rule object.
 */
WebRequest.prototype.getUrlData = function(requestUrl){
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
}
/**
 * Create filter actions to remove selected headers from request.
 */
WebRequest.prototype.getRemoveHeadersActions = function(removeHeaders){
    var removeHeadersLength = removeHeaders.length;
    if (removeHeadersLength == 0)
        return null;
    // create actions
    var actions = [];
    for (var i = 0; i < removeHeadersLength; i++) {
        var header = removeHeaders[i];
        actions[actions.length] = new chrome.declarativeWebRequest.RemoveRequestHeader({
            name:header
        });
    }
    return actions;
}
/**
 * Set headers that cen't be set via XMLHttpRequest
 */
WebRequest.prototype.getUnsupportedHeadersActions = function(unsupportedHeadersList){
    if (unsupportedHeadersList.length == 0)
        return null;
    // create actions
    var actions = [];
    for ( var i = 0; i < unsupportedHeadersList.length; i++) {
        var header = unsupportedHeadersList[i];
        actions[actions.length] = new chrome.declarativeWebRequest.SetRequestHeader(header);
    }
    return actions;
}
WebRequest.prototype.parseHeaders = function(str) {
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


function MessageHandling(webRequest){
    this.webRequest = webRequest;
}
MessageHandling.prototype.init = function(){
    this.setListeners();
}

MessageHandling.prototype.setListeners = function(){
    window.requestAction = function(request, callback){
        callback = callback || new Function();
        this.handleMessage(request, callback);
    }.bind(this);
	
    /**
	 * Registers listener to handle extension message passing from content script.
	 */
    chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
        this.handleMessage(request, sendResponse);
        return true;
    }.bind(this));
    
    
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
                   return false;
               }
               this.runApplication(message.data);
               break;
       }
       sendResponse(result);
       return true;
   }.bind(this));
    
    
    
    
    
}

MessageHandling.prototype.handleMessage = function(request, sendResponse){
    if (typeof request == "string") {
        try{
            request = JSON.parse(request);
        }catch(e){
            console.error('Error parse payload data',e);
        }
    }
    var responseAsObject = (request.response && request.response == 'object');
    if (!request.payload){
        var data = {
            'error' : true,
            'message' : 'Unknown payload.',
            'data' : null
        }
        if(!responseAsObject){
            data = JSON.stringify(data);
        }
        sendResponse({
            'payload' : 'error',
            'response':responseAsObject ? 'object' : null,
            'data' : data
        });
        return;
    }
    var method = request.payload;
    if(this[method]){
        this[method](request, responseAsObject, sendResponse);
    } else {
        this.handleApiDirectCall(request, responseAsObject, sendResponse);
    }
}
MessageHandling.prototype.handleApiDirectCall = function(request, responseAsObject, sendResponse){
    if(request.payload.indexOf("storage") === 0){
        var c = request.payload.split('.')
        var call = chrome;
        var action = c.pop();
        for(var i = 0; i<c.length; i++){
            call = call[c[i]];
        }
        var data = request.data ? JSON.parse(request.data) : null;
        call[action].call(call,data,function(result){
            if(!responseAsObject){
                if(typeof result == "object"){
                    result.response = responseAsObject ? 'object' : null;
                    result = JSON.stringify(result);
                } else {
                    result = result+"";
                }
            } else {
                if(typeof result != "object"){
                    result = {
                        'data':result
                    }
                }
                result.response = responseAsObject ? 'object' : null;
            }
            sendResponse(result);
        });
    } else if (request.payload.indexOf(".") != -1){
        var c = request.payload.split('.')
        var call = chrome;
        var action = c.pop();
        for(var i = 0; i<c.length; i++){
            call = call[c[i]];
        }
        var data = request.data ? JSON.parse(request.data) : null;
        call[action].call(call,data,function(result){			
            if(!responseAsObject){
                if(typeof result == "object"){
                    result.response = responseAsObject ? 'object' : null;
                    result = JSON.stringify(result);
                } else {
                    result = result+"";
                }
            } else {
                if(typeof result != "object"){
                    result = {
                        'data':result
                    }
                }
                result.response = responseAsObject ? 'object' : null;
            }
            sendResponse(result);
        });
    }
}
MessageHandling.prototype.checkDriveAuth = function(request, responseAsObject, sendResponse){
    if(request && request.forceNew){
        window.googleAuth.clear();
        window.googleAuth = null;
    }
	
    if(!window.googleAuth){
        initOauth2Object();
    }
	
    var at = window.googleAuth.getAccessToken();
    if(at && window.googleAuth.isAccessTokenExpired()){
        at = null;
    }
    var data = null;
    if(at){
        data = {
            'access_token': at,
            'expires_in': window.googleAuth.get('expiresIn') - (~~((Date.now() - window.googleAuth.get('accessTokenDate')) / 1000))
        };
    }
    sendResponse({
        'payload' : 'checkDriveAuth',
        'response':responseAsObject ? 'object' : null,
        'data' : data
    });
}
MessageHandling.prototype.gdriveAuth = function(request, responseAsObject, sendResponse){
    if(request && request.forceNew){
        window.googleAuth.clear();
        window.googleAuth = null;
    }
    if(!window.googleAuth){
        initOauth2Object();
    }
    window.googleAuth.authorize(function(){
        var at = window.googleAuth.getAccessToken();
        if(at && window.googleAuth.isAccessTokenExpired()){
            at = null;
        }
        var data = null;
        if(at){
            data = {
                'access_token': at,
                'expires_in': window.googleAuth.get('expiresIn') - (~~((Date.now() - window.googleAuth.get('accessTokenDate')) / 1000))
            };
        }
        sendResponse({
            'payload' : 'checkDriveAuth',
            'response':responseAsObject ? 'object' : null,
            'data' : data
        });
    });
}
MessageHandling.prototype.gdrive = function(request, responseAsObject, sendResponse){
    var query = request.data;
    if(typeof query == 'string'){
        query = JSON.parse(request.data);
    }
    var viewTabUrl = null;
    if(query.action == 'create'){
        viewTabUrl = this.runApplicationFromGoogleDrive(query);
    } else if(query.action == 'open'){
        viewTabUrl = '';
        if (dev) {
            viewTabUrl = 'http://127.0.0.1:8888/RestClient.html?gwt.codesvr=127.0.0.1:9997#RequestPlace:gdrive/'+ query.ids[0];
        } else {
            viewTabUrl = chrome.extension.getURL('RestClient.html#RequestPlace:gdrive/' + query.ids[0]);
        }
    }
    if(viewTabUrl != null){
        sendResponse({assignUrl: viewTabUrl});
    }
}
MessageHandling.prototype.setEnvironment = function(request, responseAsObject, sendResponse){
    var data = JSON.parse(request.data);
    for (var key in data) {
        window[key] = data[key];
    }
    sendResponse({
        'payload' : 'setEnvironment',
        'response':responseAsObject ? 'object' : null,
        'result' : true
    });
}
MessageHandling.prototype.runFromIntent = function(request, responseAsObject, sendResponse){
    if (request.intent.action == "http://webintents.org/view" && request.intent.type == "application/restclient+data") {
        var data = request.intent.data;
        if (data == null)
            return;
        switch (data.payload) {
            case 'create':
                runApplication(data.data);
                break;
        }
    }
}

MessageHandling.prototype.requestBegin = function(request, responseAsObject, sendResponse){
    var data = JSON.parse(request.data);
    this.webRequest.reset();
    this.webRequest.masterURL = data.url;
    this.webRequest.setRules(data);

    sendResponse({
        'payload' : 'requestBegin'
    });   
}
MessageHandling.prototype.getRequestData = function(request, responseAsObject, sendResponse){
    var data = this.webRequest.getRequestData();
    if(!responseAsObject){
        data = JSON.stringify(data);
    }
    this.webRequest.reset();
    sendResponse({
        'payload' : 'getRequestData',
        'response':responseAsObject ? 'object' : null,
        'data' : data
    });
}
MessageHandling.prototype.getExternalData = function(request, responseAsObject, sendResponse){
    var externalUUid = request.data;
    var externalData = null;
    if (externalUUid in window.externalDataHolder) {
        externalData = window.externalDataHolder[externalUUid];
        delete window.externalDataHolder[externalUUid];
    }
    var data = {};
    if (externalData == null) {
        data = {
            'error' : true,
            'message' : 'No data available :(',
            'data' : null
        };
        if(!responseAsObject){
            data = JSON.stringify(data);
        }
        sendResponse({
            'payload' : 'getExternalData',
            'response':responseAsObject ? 'object' : null,
            'data' : data
        });
        return;
    }
    
    data = {
        'error' : false,
        'data' : externalData
    };
    if(!responseAsObject){
        data = JSON.stringify(data);
    }
    sendResponse({
        'payload' : 'getExternalData',
        'response':responseAsObject ? 'object' : null,
        'data' : data
    });
}
MessageHandling.prototype.copyToClipboard = function(request, responseAsObject, sendResponse){
    var copyData = request.data;
    var clipboardholder = document.createElement("textarea");
    document.body.appendChild(clipboardholder);
    clipboardholder.value = copyData;
    clipboardholder.select();
    document.execCommand("Copy");
    clipboardholder.parentNode.removeChild(clipboardholder);
}
MessageHandling.prototype.getManifest = function(request, responseAsObject, sendResponse){
    var manifest = chrome.runtime.getManifest();
    var data = {
        version: manifest.version,
        permissions: manifest.permissions,
        manifest_version: manifest.manifest_version,
        name: manifest.name
    };
    if(!responseAsObject){
        data = JSON.stringify(data);
    }
    sendResponse({
        'payload' : 'getManifest',
        'response':responseAsObject ? 'object' : null,
        'data' : data
    });
}
MessageHandling.prototype.runApplication = function(requestDetails) {
    var uuid = this.guidGenerator();
    var viewTabUrl = '';
    if (dev) {
        viewTabUrl = 'http://127.0.0.1:8888/RestClient.html?gwt.codesvr=127.0.0.1:9997#RequestPlace:external/' + uuid;
    } else {
        viewTabUrl = chrome.extension.getURL('RestClient.html#RequestPlace:external/' + uuid);
    }
    window.externalDataHolder[uuid] = requestDetails;
    chrome.tabs.create({url: viewTabUrl});
}
/**
 * Found at http://note19.com/2007/05/27/javascript-guid-generator/
 * 
 * @returns {String}
 */
MessageHandling.prototype.guidGenerator = function() {
    var S4 = function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4()
        + S4() + S4());
}
MessageHandling.prototype.runApplicationFromGoogleDrive = function(requestDetails) {
    var uuid = guidGenerator();
    var viewTabUrl = '';
    if (dev) {
        viewTabUrl = 'http://127.0.0.1:8888/RestClient.html?gwt.codesvr=127.0.0.1:9997#RequestPlace:gdrive/create/'+ uuid;
    } else {
        viewTabUrl = chrome.extension.getURL('RestClient.html#RequestPlace:gdrive/create/' + uuid);
    }
    window.externalDataHolder[uuid] = requestDetails;
    return viewTabUrl;
}




var webRequest = new WebRequest();
webRequest.init();
var messageHandling = new MessageHandling(webRequest);
messageHandling.init();




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
