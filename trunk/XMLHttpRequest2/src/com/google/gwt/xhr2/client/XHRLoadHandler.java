package com.google.gwt.xhr2.client;
/**
 * A ready-state callback for an {@link XMLHttpRequest2} object.
 */
public interface XHRLoadHandler {
	/**
	 * This is called when the request has successfully completed.
	 * {@link XMLHttpRequest2#setOnLoad}.
	 * 
	 * @param xhr
	 *            the object whose state has changed.
	 */
	void onLoad(ProgressEvent event);
}
