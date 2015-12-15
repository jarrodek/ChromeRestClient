package com.google.gwt.chrome.message;

import com.google.gwt.chrome.def.BackgroundJsCallback;
import com.google.gwt.core.client.JavaScriptException;
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
public class ChromeMessagePassingImpl implements ChromeMessagePassing {
	
	@Override
	public void postMessage(String payload, JavaScriptObject data, BackgroundJsCallback callback) {
		final JSONObject requestObject = preparePostMessage(payload);
		requestObject.put("params", new JSONObject(data));
		try{
			sendExtensionMessage(requestObject.getJavaScriptObject(), callback);
		} catch(Exception e){
			callback.onError(e.getMessage());
		}
	}

	@Override
	public void postMessage(String payload, String data, BackgroundJsCallback callback) {
		final JSONObject requestObject = preparePostMessage(payload);
		requestObject.put("params", new JSONString(data));
		try{
			sendExtensionMessage(requestObject.getJavaScriptObject(), callback);
		} catch(Exception e){
			callback.onError(e.getMessage());
		}
	}
	
	@Override
	public void postMessage(String payload, int data, BackgroundJsCallback callback) {
		final JSONObject requestObject = preparePostMessage(payload);
		requestObject.put("params", new JSONNumber(data));
		try{
			sendExtensionMessage(requestObject.getJavaScriptObject(), callback);
		} catch(Exception e){
			callback.onError(e.getMessage());
		}
	}

	@Override
	public void postMessage(String payload, double data, BackgroundJsCallback callback) {
		final JSONObject requestObject = preparePostMessage(payload);
		requestObject.put("params", new JSONNumber(data));
		try{
			sendExtensionMessage(requestObject.getJavaScriptObject(), callback);
		} catch(Exception e){
			callback.onError(e.getMessage());
		}
	}

	@Override
	public void postMessage(String payload, boolean data, BackgroundJsCallback callback) {
		final JSONObject requestObject = preparePostMessage(payload);
		requestObject.put("params", JSONBoolean.getInstance(data));
		try{
			sendExtensionMessage(requestObject.getJavaScriptObject(), callback);
		} catch(Exception e){
			callback.onError(e.getMessage());
		}
	}

	@Override
	public void postMessage(String payload, BackgroundJsCallback callback) {
		final JSONObject requestObject = preparePostMessage(payload);
		try{
			sendExtensionMessage(requestObject.getJavaScriptObject(), callback);
		} catch(Exception e){
			callback.onError(e.getMessage());
		}
	}
	
	/**
	 * Prepare communication object to send with the message.
	 * @param payload
	 * @return
	 */
	private JSONObject preparePostMessage(String payload) {
		JSONObject respObj = new JSONObject();
		respObj.put("payload", new JSONString(payload));
		return respObj;
	}

	/**
	 * Call the background page and execute function.
	 * @param data
	 * @param handler
	 * @throws JavaScriptException
	 */
	private final native void sendExtensionMessage(JavaScriptObject data, BackgroundJsCallback handler) throws JavaScriptException /*-{
		chrome.runtime.getBackgroundPage($entry(function(backgroundPage){
			var receiver = $entry(function(result) {
				handler.@com.google.gwt.chrome.def.BackgroundJsCallback::onSuccess(Ljava/lang/Object;)(result);
			});
			try{
				backgroundPage.gwt.dev.background.callAction(data, receiver);
			} catch(e){
				handler.@com.google.gwt.chrome.def.BackgroundJsCallback::onError(Ljava/lang/String;)(e.message);
			}
		}));
	}-*/;
}
