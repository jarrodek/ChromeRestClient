package com.google.gwt.chrome.message;

import com.google.gwt.chrome.def.BackgroundJsCallback;
import com.google.gwt.chrome.def.BackgroundPageCallback;
import com.google.gwt.core.client.JavaScriptException;
import com.google.gwt.core.client.JavaScriptObject;
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
			final BackgroundPageCallback callback) {
		
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

			@Override
			public void onBackgroundError(String message) {
				error(message);
				callback.onError(message);
			}
		});
	}
	
	
	private JSONObject preparePostMessage() {
		JSONObject respObj = new JSONObject();
		return respObj;
	}

	
	private void sendExtensionMessage(String data)  throws JavaScriptException  {
		sendExtensionMessage(data, new ChromeMessageReceiver() {
			@Override
			public void onMessage(String payload, String message) {}

			@Override
			public void onBackgroundError(String message) {
				error(message);
			}
		});
	};
	
	private final native void error(String message) /*-{
		$wnd.console.error(message);
	}-*/;
	
	private final native void sendExtensionMessage(String data, ChromeMessageReceiver handler) throws JavaScriptException /*-{
		chrome.runtime.getBackgroundPage($entry(function(backgroundPage){
			var receiver = $entry(function(response) {
				if (typeof request == "string") {
					try{
						request = JSON.parse(request);
					}catch(e){
						$wnd.console.error('Error parse payload data',e);
					}
				}
				if (!(response && response.payload))
					return;
				if(typeof response.data == "object"){
					response.data = JSON.stringify(response.data);
				}
				handler.@com.google.gwt.chrome.message.ChromeMessageReceiver::onMessage(Ljava/lang/String;Ljava/lang/String;)(response.payload,response.data+"");
			});
			try{
				backgroundPage.requestAction(data, receiver);
			} catch(e){
				handler.@com.google.gwt.chrome.message.ChromeMessageReceiver::onBackgroundError(Ljava/lang/String;)(e.message);
				throw e;
			}
		}));
	}-*/;

	@Override
	public void postMessage(String payload, JavaScriptObject data) {
		final JSONObject respObj = preparePostMessage();
		if (data != null) {
			respObj.put("data", new JSONObject(data));
		}
		respObj.put("payload", new JSONString(payload));
		respObj.put("response", new JSONString("object"));
		sendExtensionJSOMessage(respObj.getJavaScriptObject());
	}

	

	@Override
	public void postMessage(String payload, JavaScriptObject data,
			final BackgroundJsCallback callback) {
		final JSONObject respObj = preparePostMessage();
		if (data != null) {
			respObj.put("data", new JSONObject(data));
		}
		respObj.put("payload", new JSONString(payload));
		respObj.put("response", new JSONString("object"));
		sendExtensionJSOMessage(respObj.getJavaScriptObject(), new ChromeJSOMessageReceiver() {
			
			@Override
			public void onBackgroundError(String message) {
				error(message);
				callback.onError(message);
			}

			@Override
			public void onMessage(String payload, JavaScriptObject message) {
				callback.onSuccess(message);
			}
		});
	}
	
	@Override
	public void postMessage(String payload, String data,
			final BackgroundJsCallback callback) {
		final JSONObject respObj = preparePostMessage();
		if (data != null) {
			respObj.put("data", new JSONString(data));
		}
		respObj.put("payload", new JSONString(payload));
		respObj.put("response", new JSONString("object"));
		sendExtensionJSOMessage(respObj.getJavaScriptObject(), new ChromeJSOMessageReceiver() {
			
			@Override
			public void onBackgroundError(String message) {
				error(message);
				callback.onError(message);
			}

			@Override
			public void onMessage(String payload, JavaScriptObject message) {
				callback.onSuccess(message);
			}
		});
	}
	
	
	private void sendExtensionJSOMessage(JavaScriptObject obj) throws JavaScriptException {
		sendExtensionJSOMessage(obj, new ChromeJSOMessageReceiver() {
			@Override
			public void onMessage(String payload, JavaScriptObject message) {}
			@Override
			public void onBackgroundError(String message) {
				error(message);
			}
		});
	}
	private final native void sendExtensionJSOMessage(JavaScriptObject data, ChromeJSOMessageReceiver handler) throws JavaScriptException /*-{
		chrome.runtime.getBackgroundPage($entry(function(backgroundPage){
			var receiver = $entry(function(response) {
				if (typeof request == "string") {
					try{
						request = JSON.parse(request);
					}catch(e){
						$wnd.console.error('Error parse payload data',e);
					}
				}
				if (!(response && response.payload))
					return;
				
				
				var responseAsObject = (response.response && response.response == 'object');
				if(responseAsObject){
					if(typeof response.data == 'string' || typeof response.data == 'number'){
						response.data = {'data':response.data};
					}
				} else {
					if(typeof response.data == "object"){
						response.data = JSON.stringify(response.data);
					}
				}
				handler.@com.google.gwt.chrome.message.ChromeJSOMessageReceiver::onMessage(Ljava/lang/String;Lcom/google/gwt/core/client/JavaScriptObject;)(response.payload,response.data);
			});
			try{
				backgroundPage.requestAction(data, receiver);
			} catch(e){
				handler.@com.google.gwt.chrome.message.ChromeJSOMessageReceiver::onBackgroundError(Ljava/lang/String;)(e.message);
				throw e;
			}
		}));
	}-*/;

	
}
