package org.rest.client.chrome;

import com.google.gwt.core.client.Callback;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;

/**
 * @todo this class must be replaced in production mode to class that can handle
 *       message passing via Chrome API
 * @author jarrod
 * 
 */
public class ChromeMessagePassingImpl implements ChromeMessagePassing {

	public ChromeMessagePassingImpl() {
		
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
	public void postMessage(String payload, String data,
			final Callback<String, Throwable> callback) {
		final JSONObject respObj = preparePostMessage();
		if (data != null) {
			respObj.put("data", new JSONString(data));
		}
		respObj.put("payload", new JSONString(payload));
		sendExtensionMessage(respObj.toString(), new ChromeMessageReceiver() {
			@Override
			public void onMessage(String payload, String message) {
				callback.onSuccess(message);
			}
		});
	}
	
	
	private JSONObject preparePostMessage() {
		JSONObject respObj = new JSONObject();
		return respObj;
	}

	
	private void sendExtensionMessage(String data) {
		sendExtensionMessage(data, new ChromeMessageReceiver() {
			@Override
			public void onMessage(String payload, String message) {}
		});
	};
	
	private final native void sendExtensionMessage(String data, ChromeMessageReceiver handler)/*-{
		//get background page
		var bg = chrome.extension.getBackgroundPage();
		var receiver = $entry(function(response) {
			if (!(response && response.payload))
				return;
			handler.@org.rest.client.chrome.ChromeMessageReceiver::onMessage(Ljava/lang/String;Ljava/lang/String;)(response.payload,response.data);
		});
		bg.requestAction(data, receiver);
	}-*/;

}
