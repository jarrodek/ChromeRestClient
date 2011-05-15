package com.google.gwt.xhr2.client;
/**
 * A ready-state callback for an {@link XMLHttpRequest2} object.
 */
public interface LoadStartHandler {
	/**
	 * This is called when the request starts. See
	 * {@link XMLHttpRequest2#setOnLoadStart}.
	 */
	void onLoadStart(ProgressEvent event);
}
