package com.google.gwt.chrome.message;

import com.google.gwt.chrome.def.BackgroundJsCallback;
import com.google.gwt.chrome.def.BackgroundPageCallback;
import com.google.gwt.core.client.JavaScriptObject;

/**
 * Class to call function in background page.
 * 
 * @author jarrod
 * 
 */
public class BackgroundMessage implements ChromeMessagePassing {

	private final ChromeMessagePassing impl;

	/**
	 * Create message passing to background page. If app is compiled an in
	 * extension env it will use chrome.runtime to get background page and make
	 * a request.
	 */
	public BackgroundMessage() {
		if (isApiAvailable()) {
			impl = new ChromeMessagePassingImpl();
		} else {
			impl = new ChromeCSmessagePassingImpl();
		}
	}
	
	

	private final native boolean isApiAvailable() /*-{
		return !!(chrome.runtime);
	}-*/;



	@Override
	public void postMessage(String payload, String data) {
		impl.postMessage(payload, data);
	}

	@Override
	public void postMessage(String payload, String data,
			BackgroundPageCallback callback) {
		impl.postMessage(payload, data, callback);
	}



	@Override
	public void postMessage(String payload, JavaScriptObject data) {
		impl.postMessage(payload, data);
	}



	@Override
	public void postMessage(String payload, JavaScriptObject data,
			BackgroundJsCallback callback) {
		impl.postMessage(payload, data, callback);
	}



	@Override
	public void postMessage(String payload, String data,
			BackgroundJsCallback callback) {
		impl.postMessage(payload, data, callback);
	}
}
