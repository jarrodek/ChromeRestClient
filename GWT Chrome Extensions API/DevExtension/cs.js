'use strict'

/*******************************************************************************
 * Copyright 2012 Pawel Psztyc
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 ******************************************************************************/

/**
 * This is a content script to execute Chrome API during GWT development. When
 * developing an Chrome extension / app in GWT there is no direct access to
 * Chrome APIs since generated page can't be used in extensions environment.
 * This extension will inject content script to the host page and will listen
 * for messages sent to the extension using window.postMessage. Message object
 * must contain payload and source keys and may contain params key.
 * 
 * "payload" key must contain chrome API name (as string) to be called in
 * background page. The name must not contain chrome as a first part of API
 * name. For example if you want to call chrome.storage.local.get() function the
 * payload key the will be "storage.local.get".
 * 
 * "source" key must contain value "dev:gwt". This content script will receive
 * every message sent in the host page. To process only related requests it will
 * use this value to distinguish if this is a gwt to content script message.
 * Data to the host page will be returned in the same way but it will contain
 * "gwt:cs" value in "source" key. This is how host page scripts should
 * recognize responses.
 * 
 * "params" will be passed as a API function argument in the background page.
 * 
 * Response from the background page (and content script) will additionally
 * contain a result key with data produced by the API. It's value may be
 * undefined if API do not return any data. It will always however contain this
 * key. 
 * 
 * If error occurred during execution the "error" key will be available
 * with error message.
 * 
 * Every response will always contain "source-data" with the original request (payload, params etc).
 * 
 * All calls to the background page are asynchronous by its nature so even sync
 * APIs must be called asynchronously. Host page must handle callback by they
 * own.
 * 
 * To use most of the Chrome APIs you need declare permissions in manifest.json file.
 * Before loading the extension into Chrome edit manifest file declaring proper permissions.  
 * 
 * Example:
 * 
 * host.page.js
 * 
 * <pre>
 * let message = {
 * 	'payload' : 'runtime.getManifest',
 * 	'source' : 'dev:gwt'
 * };
 * window.postMessage(message, location.href);
 * window.addEventListener(&quot;message&quot;, function(e) {
 * 	if (e.origin != location.origin) {
 * 		return; // message is not from host page
 * 	}
 * 	 
 * 	let data = e.data;
 * 	if (!(data &amp;&amp; data.source &amp;&amp; data.source === &quot;dev:cs&quot;))
 * 		return; //accept only responses from the content script
 * 	let callback = retriveCallbackForCall(data['source-data']);
 * 	//data will contain payload, params, source and response keys. The response contain result from the background page
 * 	callback.call(window, data.response)
 * }, false);
 * </pre>
 */

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
gwt.dev.chrome = gwt.dev.chrome || {};

/**
 * Process message from host page (ensure if it the message is directed to this
 * extension) and send it to the background page to call Chrome API.
 */
gwt.dev.chrome.handleMessage = function(e) {
	let data = e.data;
	try {
		gwt.dev.chrome.isLocation(e);
		gwt.dev.chrome.isSource(data);
	} catch(e){
		return; // don't print error messages in the console.
	}
	gwt.dev.chrome.sendMessage(data);
};

/**
 * Throw an error if the call is not from the host page.
 */
gwt.dev.chrome.isLocation = function(e){
	if(e.origin !== location.origin){
		throw "Call not from the host page.";
	}
};

/**
 * Throw an error if the call is not having "dev:gwt" value in source key. 
 */
gwt.dev.chrome.isSource = function(data){
	if(!(data && data.source && data.source == "dev:gwt")) {
		throw "This is not message to this CS";
	}
};

/**
 * Send message to the background page, wait for response and send the response back to the host page.
 */
gwt.dev.chrome.sendMessage = function(data){
	chrome.runtime.sendMessage(data, function(response) {
		var result = response.result;
		var post = {
			"source": "dev:cs",
			"result": result,
			"source-data": data
		}
		if(response.error){
			post.error = response.error; 
		}
		window.postMessage(post, location.href);
	});
};

/**
 * Receive message from the host page and pass it to the background page for
 * further processing.
 */
window.addEventListener("message", gwt.dev.chrome.handleMessage, false);