package com.google.gwt.xhr2.client;
/**
 * A ready-state callback for an {@link XMLHttpRequest2} object.
 */
public interface LoadEndHandler {
	/**
	 * This is called when the request has completed (either in success or failure). 
	 * See {@link XMLHttpRequest2#setOnLoadEnd}.
	 */
	void onLoadEnd(ProgressEvent event);
}
