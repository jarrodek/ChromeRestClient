package com.google.gwt.xhr2.client;
/**
 * A ready-state callback for an {@link XMLHttpRequest2} object.
 */
public interface TimeoutHandler {
	/**
	 * This is called when the author specified timeout 
	 * has passed before the request could complete.
	 * See {@link XMLHttpRequest2#setOnTimeout}.
	 * @param event 
	 * 
	 * @param xhr
	 *            the object whose state has changed.
	 */
	void onTimeout(Response response, ProgressEvent event, RuntimeException exception);
}
