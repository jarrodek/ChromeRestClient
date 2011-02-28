package com.google.gwt.xhr2.client;
/**
 * A ready-state callback for an {@link XMLHttpRequest2} object.
 */
public interface AbortHandler {
	/**
	 * This is called when the request has been aborted. 
	 * For instance, by invoking the abort() method.
	 * {@link XMLHttpRequest2#setOnAbort}.
	 * 
	 * @param event
	 * 		{@link ProgressEvent}
	 */
	void onAbort(ProgressEvent event);
}
