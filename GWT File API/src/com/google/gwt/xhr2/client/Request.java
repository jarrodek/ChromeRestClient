package com.google.gwt.xhr2.client;


/**
 * An HTTP request that is waiting for a response. Requests can be queried for
 * their pending status or they can be canceled.
 * 
 */
public class Request {
	/**
	 * Returns an array of headers built by parsing the string of headers
	 * returned by the JavaScript <code>XmlHttpRequest</code> object.
	 * 
	 * @param xmlHttpRequest
	 * @return array of Header items
	 */
	static Header[] getHeaders(XMLHttpRequest2 xmlHttp) {
		String allHeaders = xmlHttp.getAllResponseHeaders();
		String[] unparsedHeaders = allHeaders.split("\n");
		Header[] parsedHeaders = new Header[unparsedHeaders.length];
		for (int i = 0, n = unparsedHeaders.length; i < n; ++i) {
			String unparsedHeader = unparsedHeaders[i];

			if (unparsedHeader.length() == 0) {
				continue;
			}

			int endOfNameIdx = unparsedHeader.indexOf(':');
			if (endOfNameIdx < 0) {
				continue;
			}

			final String name = unparsedHeader.substring(0, endOfNameIdx)
					.trim();
			final String value = unparsedHeader.substring(endOfNameIdx + 1)
					.trim();
			Header header = new Header() {
				@Override
				public String getName() {
					return name;
				}

				@Override
				public String getValue() {
					return value;
				}

				@Override
				public String toString() {
					return name + " : " + value;
				}
			};

			parsedHeaders[i] = header;
		}
		return parsedHeaders;
	}

	private static boolean isResponseReady(XMLHttpRequest2 xhr) {
		return xhr.getReadyState() == XMLHttpRequest2.DONE;
	}

	
	/**
	 * JavaScript XmlHttpRequest object that this Java class wraps. This field
	 * is not final because we transfer ownership of it to the HTTPResponse
	 * object and set this field to null.
	 */
	private XMLHttpRequest2 xmlHttpRequest;

	/**
	 * Constructs an instance of the Request object.
	 * 
	 * @param xmlHttpRequest
	 *            JavaScript XmlHttpRequest object instance
	 * @param timeoutMillis
	 *            number of milliseconds to wait for a response
	 */
	public Request(XMLHttpRequest2 xmlHttpRequest) {
		if (xmlHttpRequest == null) {
			throw new NullPointerException();
		}
		this.xmlHttpRequest = xmlHttpRequest;
	}

	/**
	 * Cancels a pending request. If the request has already been canceled or if
	 * it has timed out no action is taken.
	 */
	public void cancel() {
		/*
		 * There is a strange race condition that occurs on Mozilla when you
		 * cancel a request while the response is coming in. It appears that in
		 * some cases the onreadystatechange handler is still called after the
		 * handler function has been deleted and during the call to
		 * XmlHttpRequest.abort(). So we null the xmlHttpRequest here and that
		 * will prevent the fireOnResponseReceived method from calling the
		 * callback function.
		 * 
		 * Setting the onreadystatechange handler to null gives us the correct
		 * behavior in Mozilla but crashes IE. That is why we have chosen to
		 * fixed this in Java by nulling out our reference to the XmlHttpRequest
		 * object.
		 */
		if (xmlHttpRequest != null) {
			XMLHttpRequest2 xmlHttp = xmlHttpRequest;
			xmlHttpRequest = null;

			xmlHttp.clearOnReadyStateChange();
			xmlHttp.abort();
		}
	}

	/**
	 * Returns true if this request is waiting for a response.
	 * 
	 * @return true if this request is waiting for a response
	 */
	public boolean isPending() {
		if (xmlHttpRequest == null) {
			return false;
		}

		int readyState = xmlHttpRequest.getReadyState();

		/*
		 * Because we are doing asynchronous requests it is possible that we can
		 * call XmlHttpRequest.send and still have the
		 * XmlHttpRequest.getReadyState method return the state as
		 * XmlHttpRequest.OPEN. That is why we include open although it is not
		 * technically true since open implies that the request has not been
		 * sent.
		 */
		switch (readyState) {
		case XMLHttpRequest2.OPENED:
		case XMLHttpRequest2.HEADERS_RECEIVED:
		case XMLHttpRequest2.LOADING:
			return true;
		}

		return false;
	}

	/*
	 * Method called when the JavaScript XmlHttpRequest object's readyState
	 * reaches 4 (LOADED).
	 */
	void fireOnResponseReceived(RequestCallback callback) {
		Response response = null;
		try{
			response = handleReponseReceived();
		} catch( RuntimeException e){
			callback.onError(this, e);
			return;
		}
		callback.onResponseReceived(this, response);
	}
	
	void fireOnUploadLoadEnd(UploadLoadHandler callback, ProgressEvent event){
		callback.onLoaded(event);
	}
	
	void fireOnResponseReceived(LoadHandler callback, ProgressEvent event) {
		Response response = null;
		final XMLHttpRequest2 xhr = xmlHttpRequest;
		try{
			response = handleReponseReceived();
		} catch( RuntimeException e){
			Response r = new Response(xhr);
			callback.onError(r, e);
			return;
		}
		callback.onLoaded(response,event);
	}
	
	void fireOnError(ErrorHandler callback) {
		Response response = null;
		try{
			response = handleReponseReceived();
		} catch( RuntimeException e){
			callback.onError(response, e);
			return;
		}
		callback.onError(response, new RuntimeException("Unknown error"));
	}
	
	void fireOnTimeout(TimeoutHandler callback, ProgressEvent event){
		Response response = null;
		try{
			response = handleReponseReceived();
		} catch( RuntimeException e){
			callback.onTimeout(response, event, e);
			return;
		}
		callback.onTimeout(response, event, new RuntimeException("Unknown error"));
	}
	void fireOnLoadEnd(LoadEndHandler callback,
			ProgressEvent event) {
		callback.onLoadEnd(event);
	}
	void fireOnAbort(AbortHandler abortHandler, ProgressEvent event) {
		abortHandler.onAbort(event);
	}
	void fireOnLoadStart(LoadStartHandler loadStartHandler,
			ProgressEvent event) {
		loadStartHandler.onLoadStart(event);
	}
	void fireProgress(ProgressHandler progressHandler,
			ProgressEvent event) {
		progressHandler.onProgress(event);
	}
	/**
	 * 
	 * @return
	 * @throws RuntimeException
	 */
	Response handleReponseReceived() throws RuntimeException{
		if (xmlHttpRequest == null) {
			// the request has timed out at this point
			return null;
		}
		/*
		 * We cannot use cancel here because it would clear the contents of the
		 * JavaScript XmlHttpRequest2 object so we manually null out our
		 * reference to the JavaScriptObject
		 */
		final XMLHttpRequest2 xhr = xmlHttpRequest;
		xmlHttpRequest = null;
		String errorMsg = getBrowserSpecificFailure(xhr);
		if (errorMsg != null) {
			throw new RuntimeException(errorMsg);
		}
		return new Response(xhr);
	}

	/**
	 * Tests if the JavaScript <code>XmlHttpRequest.status</code> property is
	 * readable. This can return failure in two different known scenarios:
	 * 
	 * <ol>
	 * <li>On Mozilla, after a network error, attempting to read the status code
	 * results in an exception being thrown. See <a
	 * href="https://bugzilla.mozilla.org/show_bug.cgi?id=238559"
	 * >https://bugzilla.mozilla.org/show_bug.cgi?id=238559</a>.</li>
	 * <li>On Safari, if the HTTP response does not include any response text.
	 * See <a
	 * href="http://bugs.webkit.org/show_bug.cgi?id=3810">http://bugs.webkit.org
	 * /show_bug.cgi?id=3810</a>.</li>
	 * </ol>
	 * 
	 * @param xhr
	 *            the JavaScript <code>XmlHttpRequest</code> object to test
	 * @return a String message containing an error message if the
	 *         <code>XmlHttpRequest.status</code> code is unreadable or null if
	 *         the status code could be successfully read.
	 */
	private native String getBrowserSpecificFailure(XMLHttpRequest2 xhr) /*-{
		try {
			if (xhr.status === undefined) {
				return "XmlHttpRequest.status == undefined, please see Safari bug "
						+ "http://bugs.webkit.org/show_bug.cgi?id=3810 for more details";
			}
			return null;
		} catch (e) {
			return "Unable to read XmlHttpRequest.status; likely causes are a "
					+ "networking error or bad cross-domain request. Please see "
					+ "https://bugzilla.mozilla.org/show_bug.cgi?id=238559 for more "
					+ "details";
		}
	}-*/;	
}
