package com.google.gwt.chrome.def;
/**
 * A callback from the background page.
 * @author Pawel Psztyc
 *
 */
public interface BackgroundJsCallback {
	/**
	 * Called when the request resulted with success.
	 * Message can be any JavaScript object: Object, String, null, Number etc. It can't be undefined, though. 
	 * @param message Response from the background page.
	 */
	void onSuccess(Object message);
	/**
	 * An error callback.
	 * @param message Error message from the background page.
	 */
	void onError(String message);
}
