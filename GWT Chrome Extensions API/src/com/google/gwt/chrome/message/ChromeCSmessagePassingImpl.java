package com.google.gwt.chrome.message;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

import com.google.gwt.chrome.def.BackgroundJsCallback;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.json.client.JSONBoolean;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;

/**
 * @todo this class must be replaced in production mode to class that can handle
 *       message passing via Chrome API
 * @author jarrod
 * 
 */
public class ChromeCSmessagePassingImpl implements ChromeMessagePassing {

	private static HashMap<String, ArrayList<BackgroundJsCallback>> callbacks = new HashMap<String, ArrayList<BackgroundJsCallback>>();
	static boolean isDebug;
	
	public ChromeCSmessagePassingImpl() {
		isDebug = !isProdMode();
		handleContentScriptMessages(new ChromeMessageReceiver() {
			@Override
			public void onMessage(ContentScriptResponse message) {
				handleExternalMessage(message);
			}
			
			@Override
			public void onBackgroundError(String message) {
				error(message);
			}
		});
	}
	/**
	 * Create an ID for function and it's call parameters.
	 * It will be used to identify a callback function when the response return from the background page.
 	 * 
	 * @param payload Request payload
	 * @param params Used params
	 * @return
	 */
	private final native String stringifyFunction(String payload, JavaScriptObject params) /*-{
		var obj = {
			fn: payload,
			params: params
		};
		return JSON.stringify(obj);
	}-*/;
	/**
	 * Create an ID for function and it's call parameters.
	 * It will be used to identify a callback function when the response return from the background page.
 	 * 
	 * @param payload Request payload
	 * @param params Used params
	 * @return
	 */
	private final native String stringifyFunction(String payload, String params) /*-{
		var obj = {
			fn: payload,
			params: params
		};
		return JSON.stringify(obj);
	}-*/;
	
	/**
	 * This function will put another callback function to the stack of functions to be called when message returns from the content script. 
	 * @param key A key for this call. 
	 * @param callback
	 */
	private void putCallback(String key, BackgroundJsCallback callback){
		ArrayList<BackgroundJsCallback> list = callbacks.get(key);
		if(list == null){
			list = new ArrayList<BackgroundJsCallback>();
		}
		list.add(callback);
		callbacks.put(key, list);
	}
	
	/**
	 * Send message to background page via extension's message passing system.
	 * 
	 * @param payload
	 *            The payload must contain chrome API name (as string) to be
	 *            called in background page. The name must not contain chrome as
	 *            a first part of API name. For example if you want to call
	 *            chrome.storage.local.get() function the payload key the will
	 *            be "storage.local.get".
	 * @param data
	 *            any JavaScript object to pass as a function argument.
	 * @param callback
	 *            response callback
	 */
	@Override
	public void postMessage(String payload, JavaScriptObject data,
			BackgroundJsCallback callback) {
		String key = stringifyFunction(payload, data);
		putCallback(key, callback);

		JSONObject requestObject = preparePostMessage(payload);
		requestObject.put("params", new JSONObject(data));
		sendExtensionMessage(requestObject.getJavaScriptObject());
	}
	/**
	 * Send message to background page via extension's message passing system.
	 * 
	 * @param payload
	 *            The payload must contain chrome API name (as string) to be
	 *            called in background page. The name must not contain chrome as
	 *            a first part of API name. For example if you want to call
	 *            chrome.storage.local.get() function the payload key the will
	 *            be "storage.local.get".
	 * @param data
	 *            A string argument to pass to the function.
	 * @param callback
	 *            response callback
	 */
	@Override
	public void postMessage(String payload, String data, BackgroundJsCallback callback) {
		String key = stringifyFunction(payload, data);
		putCallback(key, callback);
		
		JSONObject requestObject = preparePostMessage(payload);
		requestObject.put("params", new JSONString(data));
		sendExtensionMessage(requestObject.getJavaScriptObject());
	}
	/**
	 * Send message to background page via extension's message passing system.
	 * 
	 * @param payload
	 *            The payload must contain chrome API name (as string) to be
	 *            called in background page. The name must not contain chrome as
	 *            a first part of API name. For example if you want to call
	 *            chrome.storage.local.get() function the payload key the will
	 *            be "storage.local.get".
	 * @param data
	 *            A long argument to pass to the function.
	 * @param callback
	 *            response callback
	 */
	@Override
	public void postMessage(String payload, int data, BackgroundJsCallback callback) {
		String key = stringifyFunction(payload, String.valueOf(data));
		putCallback(key, callback);
		JSONObject requestObject = preparePostMessage(payload);
		requestObject.put("params", new JSONNumber(data));
		sendExtensionMessage(requestObject.getJavaScriptObject());
	}
	/**
	 * Send message to background page via extension's message passing system.
	 * 
	 * @param payload
	 *            The payload must contain chrome API name (as string) to be
	 *            called in background page. The name must not contain chrome as
	 *            a first part of API name. For example if you want to call
	 *            chrome.storage.local.get() function the payload key the will
	 *            be "storage.local.get".
	 * @param data
	 *            A float argument to pass to the function.
	 * @param callback
	 *            response callback
	 */
	@Override
	public void postMessage(String payload, double data, BackgroundJsCallback callback) {
		String key = stringifyFunction(payload, String.valueOf(data));
		putCallback(key, callback);
		JSONObject requestObject = preparePostMessage(payload);
		requestObject.put("params", new JSONNumber(data));
		sendExtensionMessage(requestObject.getJavaScriptObject());
	}
	/**
	 * Send message to background page via extension's message passing system.
	 * 
	 * @param payload
	 *            The payload must contain chrome API name (as string) to be
	 *            called in background page. The name must not contain chrome as
	 *            a first part of API name. For example if you want to call
	 *            chrome.storage.local.get() function the payload key the will
	 *            be "storage.local.get".
	 * @param data
	 *            A boolean argument to pass to the function.
	 * @param callback
	 *            response callback
	 */
	@Override
	public void postMessage(String payload, boolean data, BackgroundJsCallback callback) {
		String key = stringifyFunction(payload, String.valueOf(data)); 
		putCallback(key, callback);
		JSONObject requestObject = preparePostMessage(payload);
		requestObject.put("params", JSONBoolean.getInstance(data));
		sendExtensionMessage(requestObject.getJavaScriptObject());
	}
	/**
	 * Send message to background page via extension's message passing system.
	 * 
	 * @param payload
	 *            The payload must contain chrome API name (as string) to be
	 *            called in background page. The name must not contain chrome as
	 *            a first part of API name. For example if you want to call
	 *            chrome.storage.local.get() function the payload key the will
	 *            be "storage.local.get".
	 * 
	 * @param callback
	 *            response callback
	 */
	@Override
	public void postMessage(String payload, BackgroundJsCallback callback) {
		String key = stringifyFunction(payload, "");
		putCallback(key, callback);
		JSONObject requestObject = preparePostMessage(payload);
		sendExtensionMessage(requestObject.getJavaScriptObject());
	} 
	
	
	/**
	 * Handle response from the content script.
	 * Returning message from content script will contain following keys:
	 * "source" which will always have "gwt:cs" value. It the message do not have this value it means it is not a vaild message.
	 * "result" as a raw result of computation in background page.
	 * "source-data" as an original request object with payload and params.
	 * 
	 * @param handler A function to be called on valid message.
	 */
	private final native void handleContentScriptMessages(
			ChromeMessageReceiver handler) /*-{
				
		var rec = $entry(function(e) {
			if (e.origin !== location.origin) {
				return;
			}
			var response = e.data;
			if (!(response && response.source && response.source === "gwt:cs")){
				return;
			}
			if (!response["source-data"]){
				return;
			}
			if(@com.google.gwt.chrome.message.ChromeCSmessagePassingImpl::isDebug){
				console.log('Full response from background page:', response);
				console.log('Response from background page (type):', typeof response.result);
			}
			if(response.error){
				handler.@com.google.gwt.chrome.message.ChromeMessageReceiver::onBackgroundError(Ljava/lang/String;)(response.error);
			} else {
				var payload = response["source-data"].payload;
				handler.@com.google.gwt.chrome.message.ChromeMessageReceiver::onMessage(Lcom/google/gwt/chrome/message/ContentScriptResponse;)(response);
			}
		});
		// no need to clear this up since this reference should be here until page unload. And the API do not use DOM objects which can be detached from the DOM tree.
		$wnd.addEventListener("message", rec, false);
	}-*/;
	
	/**
	 * Prepare communication object to send with the message.
	 * 
	 * @param payload
	 * @return
	 */
	private JSONObject preparePostMessage(String payload) {
		JSONObject respObj = new JSONObject();
		respObj.put("source", new JSONString("gwt:host"));
		respObj.put("payload", new JSONString(payload));
		return respObj;
	}
	
	/**
	 * Send a message to the background page using content script and message passing.
	 * 
	 * @param requestObject Data to be passed to the extension.
	 */
	private final native void sendExtensionMessage(JavaScriptObject requestObject)/*-{
		console.info('Posting message to the content script.', requestObject);
		$wnd.postMessage(requestObject, $wnd.location.href);
	}-*/;

	
	
	private final void handleExternalMessage(ContentScriptResponse message) {
		String key = message.getCallbackKey();
		if(!callbacks.containsKey(key)){
			return;
		}
		ArrayList<BackgroundJsCallback> list = callbacks.get(key);
		if(list == null){
			return;
		}
		Iterator<BackgroundJsCallback> it = list.iterator();
		while(it.hasNext()){
			it.next().onSuccess(message.getResult());
		}
	}
	/**
	 * Report an error in the console.
	 * @param message
	 */
	private final native void error(String message) /*-{
		$wnd.console.error('ChromeCSmessagePassingImpl::error', message);
	}-*/;
	
	/**
	 * Check if this is a production mode.
	 * GWT's function isProdMode isn't working for SuperDevMode. 
	 * It is required to check hostname value.
	 *   
	 * @return True if this is a production mode.
	 */
	private static final native boolean isProdMode() /*-{
		return !(location.hostname === '127.0.0.1');
	}-*/;
	
}
