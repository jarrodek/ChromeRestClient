package com.google.gwt.xhr2.client;

/**
 * The primary interface a caller must implement to receive a response to a
 * {@link com.google.gwt.http.client.Request}.
 * 
 * <h3>Required Module</h3> Modules that use this interface should inherit
 * <code>com.google.gwt.http.HTTP</code>.
 * 
 */
public interface RequestCallback {
	/**
	 * Called when a pending {@link com.google.gwt.http.client.Request}
	 * completes normally. Note this method is called even when the status code
	 * of the HTTP response is not "OK", 200.
	 * 
	 * @param request
	 *            the object that generated this event
	 * @param resp
	 *            an instance of the {@link com.google.gwt.http.client.Response}
	 *            class
	 */
	void onResponseReceived(Request request, Response resp);

	/**
	 * Called when a {@link com.google.gwt.http.client.Request} does not
	 * complete normally. A
	 * {@link com.google.gwt.http.client.RequestTimeoutException
	 * RequestTimeoutException} is one example of the type of error that a
	 * request may encounter.
	 * 
	 * @param request
	 *            the request object which has experienced the error condition,
	 *            may be null if the request was never generated
	 * @param exception
	 *            the error that was encountered
	 */
	void onError(Request request, Throwable exception);
}
