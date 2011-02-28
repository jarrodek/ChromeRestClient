package com.google.gwt.xhr2.client;
/**
 * An XHR request handler.
 * From "client" side (for {@link RequestBuilder}) use {@link ErrorHandler}
 */
public interface XHRErrorHandler {
	/**
	 * This is called when the request has failed.
	 * {@link XMLHttpRequest2#setOnError}.
	 * 
	 * @param resp
	 *            the object whose state has changed.
	 */
	void onError(ProgressEvent event);
}
