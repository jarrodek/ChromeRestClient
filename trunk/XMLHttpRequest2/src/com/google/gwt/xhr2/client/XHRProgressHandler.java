package com.google.gwt.xhr2.client;
/**
 * A ready-state callback for an {@link XMLHttpRequest2} object.
 */
public interface XHRProgressHandler {
	/**
	 * This is called while loading and sending data. See
	 * {@link XMLHttpRequest2#setOnProgress}.
	 * 
	 * @param xhr
	 *            the xhr object.
	 * @param event
	 * 		{@link ProgressEvent}
	 */
	void onProgress(ProgressEvent event);
}
