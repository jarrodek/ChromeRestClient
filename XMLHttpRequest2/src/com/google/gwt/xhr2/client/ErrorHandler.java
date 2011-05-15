package com.google.gwt.xhr2.client;
/**
 * A ready-state callback for an {@link XMLHttpRequest2} object.
 */
public interface ErrorHandler {
	/**
	 * This is called when the request has failed.
	 * {@link XMLHttpRequest2#setOnError}.
	 * 
	 * @param response
	 *            the object whose state has changed.
	 */
	void onError(Response response, RuntimeException exception);
}
