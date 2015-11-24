package com.google.gwt.chrome.message;

import java.util.logging.Logger;

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
	private static final Logger log = Logger.getLogger(BackgroundMessage.class.getName());

	/**
	 * Create message passing to background page. If app is compiled an in
	 * extension env it will use chrome.runtime to get background page and make
	 * a request.
	 */
	public BackgroundMessage() {
		if (isApiAvailable()) {
			log.info("Chrome API will be used to communicate with background page");
			impl = new ChromeMessagePassingImpl();
		} else {
			log.info("Content script will be used to communicate with background page");
			impl = new ChromeCSmessagePassingImpl();
		}
	}
	
	

	private final native boolean isApiAvailable() /*-{
		return !!(chrome.runtime.getBackgroundPage);
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
