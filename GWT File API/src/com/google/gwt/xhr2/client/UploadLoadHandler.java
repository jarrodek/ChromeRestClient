package com.google.gwt.xhr2.client;
/**
 * A ready-state callback for an {@link XMLHttpRequest2} object.
 */
public interface UploadLoadHandler {
	/**
	 * This is called when the request has successfully completed.
	 * {@link XMLHttpRequest2#setOnLoad}.
	 * @param event 
	 */
	void onLoaded(ProgressEvent event);
}
