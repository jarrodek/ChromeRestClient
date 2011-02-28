package com.google.gwt.xhr2.client;
/**
 * A ready-state callback for an {@link XMLHttpRequest2} object.
 */
public interface XHRLoadStartHandler {
	/**
	 * This is called when the request starts. See
	 * {@link XMLHttpRequest2#setOnLoadStart}.
	 * 
	 * @param xhr
	 *            the object whose state has changed.
	 */
	void onLoadStart(ProgressEvent event);
}
