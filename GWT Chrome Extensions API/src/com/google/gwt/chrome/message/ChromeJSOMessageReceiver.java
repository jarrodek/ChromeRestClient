package com.google.gwt.chrome.message;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * Interface used by Chrome message passing system to retrieve message from extension
 * @author jarrod
 *
 */
public interface ChromeJSOMessageReceiver {
	/**
	 * Passed message must always have "payload" string and can have some data
	 * @param payload
	 * @param message
	 */
	void onMessage(String payload, JavaScriptObject message);
	/**
	 * Called when error occur in background page 
	 * @param message
	 */
	void onBackgroundError(String message);
}
