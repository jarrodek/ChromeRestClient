package com.google.gwt.chrome.message;
/**
 * Interface used by Chrome message passing system to retrieve message from extension
 * @author jarrod
 *
 */
public interface ChromeMessageReceiver {
	/**
	 * Passed message must always have "payload" string and can have some data
	 * @param payload
	 * @param message
	 */
	void onMessage(String payload, String message);
	/**
	 * Called when error occur in background page 
	 * @param message
	 */
	void onBackgroundError(String message);
}
