package com.google.gwt.chrome.message;

import com.google.gwt.chrome.def.BackgroundJsCallback;
import com.google.gwt.core.client.JavaScriptObject;

/**
 * Class to call function in background page.
 * 
 * @author jarrod
 * 
 */
public class BackgroundMessage implements ChromeMessagePassing {

	private final ChromeMessagePassing impl;
	//private static final Logger log = Logger.getLogger(BackgroundMessage.class.getName());

	/**
	 * Create message passing to background page. If app is compiled an in
	 * extension env it will use chrome.runtime to get background page and make
	 * a request.
	 */
	public BackgroundMessage() {
		if (isApiAvailable()) {
			//log.info("Chrome API will be used to communicate with background page");
			impl = new ChromeMessagePassingImpl();
		} else {
			//log.info("Content script will be used to communicate with background page");
			impl = new ChromeCSmessagePassingImpl();
		}
	}
	
	
	/**
	 * Check if Chrome API is available.
	 * If can get background page it means that the API is available.
	 * @return false if need to use content script to access API.
	 */
	private final native boolean isApiAvailable() /*-{
		return !!(chrome.runtime.getBackgroundPage);
	}-*/;


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



	@Override
	public void postMessage(String payload, int data, BackgroundJsCallback callback) {
		impl.postMessage(payload, data, callback);
	}



	@Override
	public void postMessage(String payload, double data, BackgroundJsCallback callback) {
		impl.postMessage(payload, data, callback);
	}



	@Override
	public void postMessage(String payload, boolean data, BackgroundJsCallback callback) {
		impl.postMessage(payload, data, callback);
	}


	@Override
	public void postMessage(String payload, BackgroundJsCallback callback) {
		impl.postMessage(payload, callback);
	}
}
