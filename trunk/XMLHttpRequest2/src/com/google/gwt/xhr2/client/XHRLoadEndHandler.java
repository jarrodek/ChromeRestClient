package com.google.gwt.xhr2.client;
/**
 * A ready-state callback for an {@link XMLHttpRequest2} object.
 */
public interface XHRLoadEndHandler {
	/**
	 * This is called when the request has completed (either in success or failure). 
	 * See {@link XMLHttpRequest2#setOnLoadEnd}.
	 * 
	 * @param xhr
	 *            the object whose state has changed.
	 */
	void onLoadEnd(ProgressEvent event);
}
