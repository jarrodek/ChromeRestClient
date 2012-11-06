package com.google.gwt.chrome.message;

import java.util.HashMap;

import com.google.gwt.chrome.def.BackgroundPageCallback;
import com.google.gwt.core.client.GWT;
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
	static boolean isDebug = false;
	static{
		isDebug = !GWT.isProdMode();
	}
	
	
	public ChromeCSmessagePassingImpl() {
		handleContentScriptMessages(new ChromeMessageReceiver() {
			@Override
			public void onMessage(String payload, String message) {
				handleExternalMessage(payload, message);
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

	/**
	 * 
	 * @param handler
	 */
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

	private JSONObject preparePostMessage() {
		JSONObject respObj = new JSONObject();
		respObj.put("source", new JSONString("dev:gwt"));
		return respObj;
	}

	private final native void sendExtensionMessage(String respObj)/*-{
		$wnd.postMessage(respObj, $wnd.location.href);
	}-*/;

	private final void handleExternalMessage(final String payload,
			final String message) {
		if (messageCallbackList.containsKey(payload)) {
			messageCallbackList.get(payload).onSuccess(message);
			messageCallbackList.remove(payload);
		}
	}
}
