package com.google.gwt.xhr2.client;
/**
 * A ready-state callback for an {@link XMLHttpRequest2} object.
 */
public interface ProgressHandler {
	/**
	 * This is called while loading and sending data. See
	 * {@link XMLHttpRequest2#setOnProgress}.
	 * 
	 * @param event
	 * 		{@link ProgressEvent}
	 */
	void onProgress(ProgressEvent event);
}
