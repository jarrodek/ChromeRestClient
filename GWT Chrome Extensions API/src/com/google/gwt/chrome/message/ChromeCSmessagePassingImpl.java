package com.google.gwt.chrome.message;

import java.util.HashMap;

import com.google.gwt.chrome.def.BackgroundJsCallback;
import com.google.gwt.chrome.def.BackgroundPageCallback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;

/**
 * @todo this class must be replaced in production mode to class that can handle
 *       message passing via Chrome API
 * @author jarrod
 * 
 */
public class ChromeCSmessagePassingImpl implements ChromeMessagePassing {

	private static HashMap<String, BackgroundPageCallback> messageCallbackList = new HashMap<String, BackgroundPageCallback>();
	private static HashMap<String, BackgroundJsCallback> messagesJSOCallbackList = new HashMap<String, BackgroundJsCallback>();
	static boolean isDebug;
	
	public ChromeCSmessagePassingImpl() {
		isDebug = !GWT.isProdMode();
		
		
		handleContentScriptMessages(new ChromeMessageReceiver() {
			@Override
			public void onMessage(String payload, String message) {
				handleExternalMessage(payload, message);
			}
			@Override
			public void onBackgroundError(String message) {
				error(message);
			}
		});
		handleContentScriptMessages(new ChromeJSOMessageReceiver() {
			
			@Override
			public void onMessage(String payload, JavaScriptObject message) {
				handleExternalMessage(payload, message);
			}
			
			@Override
			public void onBackgroundError(String message) {
				error(message);
			}
		});
		postMessage("setEnvironment", "{\"dev\":true}");
	}

	@Override
	public void postMessage(String payload, String data) {
		final JSONObject respObj = preparePostMessage();
		if (data != null) {
			respObj.put("data", new JSONString(data));
		}
		respObj.put("payload", new JSONString(payload));
		sendExtensionMessage(respObj.toString());
	}

	@Override
	public final void postMessage(String payload, String data,
			BackgroundPageCallback callback) {
		messageCallbackList.put(payload, callback);
		postMessage(payload, data);
	}

	private final native void handleContentScriptMessages(
			ChromeMessageReceiver handler)/*-{
		var rec = $entry(function(e) {
			if (e.origin != location.origin) {
				return;
			};
			var response = e.data;
			if (!(response && response.source && response.source == "dev:cs"))
				return;
			if (!(response && response.payload))
				return;
				
			var responseAsObject = (response.response && response.response == 'object');
			if(responseAsObject){
				//JSO receiver
				return;
			}
			
			if(typeof response.data == "object"){
				response.data = JSON.stringify(response.data);
			}
			
			if(@com.google.gwt.chrome.message.ChromeCSmessagePassingImpl::isDebug){
				console.log('Full response from background page:', response);
				console.log('Response from background page (payload):', response.payload);
				console.log('Response from background page (data):', response.data);
				$wnd.__latestbackgroundresponse = response;
			}
			handler.@com.google.gwt.chrome.message.ChromeMessageReceiver::onMessage(Ljava/lang/String;Ljava/lang/String;)(response.payload,response.data+"");
		});

		$wnd.addEventListener("message", rec, false);
		var e = $doc.createEvent('Events');
		e.initEvent('DEV:READY');
		$wnd.dispatchEvent(e);

	}-*/;
	/**
	 * Handle JSO type message
	 * @param handler
	 */
	private final native void handleContentScriptMessages(
			ChromeJSOMessageReceiver handler)/*-{
		var rec = $entry(function(e) {
			if (e.origin != location.origin) {
				return;
			};
			var response = e.data;
			if (!(response && response.source && response.source == "dev:cs"))
				return;
			if (!(response && response.payload))
				return;
				
			var responseAsObject = (response.response && response.response == 'object');
			if(!responseAsObject){
				//string receiver
				return;
			}
			
			if(typeof response.data != "object"){
				response.data = {data:response.data}
			}
			
			if(@com.google.gwt.chrome.message.ChromeCSmessagePassingImpl::isDebug){
				console.log('Full response from background page:', response);
				console.log('Response from background page (payload):', response.payload);
				console.log('Response from background page (data):', response.data);
				console.log('Response from background page (type):', typeof response.data);
				$wnd.__latestbackgroundresponse = response;
			}
			handler.@com.google.gwt.chrome.message.ChromeJSOMessageReceiver::onMessage(Ljava/lang/String;Lcom/google/gwt/core/client/JavaScriptObject;)(response.payload,response.data);
		});

		$wnd.addEventListener("message", rec, false);
	}-*/;
	
	
	private JSONObject preparePostMessage() {
		JSONObject respObj = new JSONObject();
		respObj.put("source", new JSONString("dev:gwt"));
		return respObj;
	}

	private final native void sendExtensionMessage(String respObj)/*-{
		$wnd.postMessage(respObj, $wnd.location.href);
	}-*/;
	private final native void sendExtensionMessage(JavaScriptObject respObj)/*-{
		$wnd.postMessage(respObj, $wnd.location.href);
	}-*/;

	private final void handleExternalMessage(final String payload,
			final String message) {
		if (messageCallbackList.containsKey(payload)) {
			messageCallbackList.get(payload).onSuccess(message);
			messageCallbackList.remove(payload);
		}
	}
	
	private final void handleExternalMessage(final String payload,
			final JavaScriptObject message) {
		if (messagesJSOCallbackList.containsKey(payload)) {
			messagesJSOCallbackList.get(payload).onSuccess(message);
			messagesJSOCallbackList.remove(payload);
		}
	}
	private final native void error(String message) /*-{
		$wnd.console.error(message);
	}-*/;
	
	
	
	
	@Override
	public void postMessage(String payload, JavaScriptObject data) {
		final JSONObject respObj = preparePostMessage();
		if (data != null) {
			respObj.put("data", new JSONObject(data));
		}
		respObj.put("payload", new JSONString(payload));
		respObj.put("response", new JSONString("object"));
		sendExtensionMessage(respObj.getJavaScriptObject());
	}

	@Override
	public void postMessage(String payload, JavaScriptObject data,
			BackgroundJsCallback callback) {
		messagesJSOCallbackList.put(payload, callback);
		postMessage(payload, data);
	}

	@Override
	public void postMessage(String payload, String data,
			BackgroundJsCallback callback) {
		messagesJSOCallbackList.put(payload, callback);
		final JSONObject respObj = preparePostMessage();
		if (data != null) {
			respObj.put("data", new JSONString(data));
		}
		respObj.put("payload", new JSONString(payload));
		respObj.put("response", new JSONString("object"));
		sendExtensionMessage(respObj.getJavaScriptObject());
	}
}
