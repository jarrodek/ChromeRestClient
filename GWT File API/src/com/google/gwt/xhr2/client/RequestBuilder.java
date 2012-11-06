package com.google.gwt.xhr2.client;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.google.gwt.core.client.JavaScriptException;
import com.google.gwt.file.client.Blob;
import com.google.gwt.file.client.File;
import com.google.gwt.http.client.RequestException;
import com.google.gwt.http.client.RequestPermissionException;
import com.google.gwt.xhr2.client.ReadyStateChangeHandler;

/**
 * Builder for constructing {@link com.google.gwt.xhr2.client.Request} objects.
 * 
 * @author jarrod
 */
public class RequestBuilder {
	
	/**
	 * The callback to call when the request completes. It's old method that use
	 * onreadystatechange. If it's possible use other callback handlers.
	 */
	private RequestCallback callback;
	/**
	 * This is called when the request has been aborted.
	 */
	private AbortHandler abortHandler;
	/**
	 * This is called when the request has failed.
	 */
	private ErrorHandler errorHandler;
	/**
	 * This is called when the request has completed (either in success or
	 * failure).
	 */
	private LoadEndHandler loadEndHandler;
	/**
	 * This is called when the request has successfully completed.
	 */
	private LoadHandler loadHandler;
	/**
	 * This is called when the request starts.
	 */
	private LoadStartHandler loadStartHandler;
	/**
	 * This is called while loading and sending data.
	 */
	private ProgressHandler progressHandler;
	/**
	 * This is called when the author specified timeout has passed before the
	 * request could complete.
	 */
	private TimeoutHandler timeoutHandler;

	/**
	 * Map of header name to value that will be added to the JavaScript
	 * XmlHttpRequest object before sending a request.
	 */
	private List<RequestHeader> headers;
	/**
	 * HTTP method to use when opening a JavaScript XmlHttpRequest object.
	 */
	private final String httpMethod;

	/**
	 * Password to use when opening a JavaScript XmlHttpRequest object.
	 */
	private String password;

	/**
	 * Request data to use when sending a JavaScript XmlHttpRequest object.
	 */
	private String requestData;
	/**
	 * Request {@link File} to send via JavaScript XmlHttpRequest object.
	 */
	private Blob reqestFile;
	/**
	 * Request {@link FormData} to send via JavaScript XmlHttpRequest object.
	 */
	private FormData requestFormData;

	/**
	 * Timeout in milliseconds before the request timeouts and fails. Default 0
	 * (no timeout)
	 */
	private int timeoutMillis = 0;

	/**
	 * URL to use when opening a JavaScript XmlHttpRequest object.
	 */
	private final String url;
	/**
	 * If true (default) request will follow redirects.
	 */
	private boolean followRedirects = true;
	/**
	 * True when user credentials are to be included in a cross-origin request.
	 * False when they are to be excluded in a cross-origin request and when
	 * cookies are to be ignored in its response. Initially false.
	 */
	private boolean withCredentials = false;

	/**
	 * User to use when opening a JavaScript XmlHttpRequest object.
	 */
	private String user;
	private ProgressHandler uploadProgressHandler;
	private LoadStartHandler uploadLoadStartHandler;
	private ErrorHandler uploadErrorHandler;
	private AbortHandler uploadAbortHandler;
	private UploadLoadHandler uploadLoadHandler;

	/**
	 * Creates a builder using the parameters values for configuration.
	 * 
	 * @param url
	 *            URL that has already has already been URL encoded. Please see
	 *            {@link com.google.gwt.http.client.URL#encode(String)} and
	 *            {@link com.google.gwt.http.client.URL#encodePathSegment(String)}
	 *            and
	 *            {@link com.google.gwt.http.client.URL#encodeQueryString(String)}
	 *            for how to do this.
	 * @param httpMethod
	 *            HTTP method to use for the request
	 * @throws IllegalArgumentException
	 *             if the httpMethod or URL are empty or null
	 */
	public RequestBuilder(String url, String httpMethod)
			throws IllegalArgumentException {

		if (url == null || url.trim().equals("")) {
			throw new IllegalArgumentException("Url cannot be empty");
		}
		if (httpMethod == null || httpMethod.trim().equals("")) {
			throw new IllegalArgumentException("httpMethod cannot be empty");
		}

		this.url = url;
		this.httpMethod = httpMethod;
	}

	/**
	 * Returns the callback previously set by
	 * {@link #setCallback(RequestCallback)}, or <code>null</code> if no
	 * callback was set.
	 * 
	 * @return the callback
	 */
	public RequestCallback getCallback() {
		return callback;
	}

	/**
	 * Sets the response handler for this request. This method <b>must</b> be
	 * called before calling {@link #send()}
	 * 
	 * @param callback
	 *            the callback
	 */
	public void setCallback(RequestCallback callback) {
		this.callback = callback;
	}

	/**
	 * Sets a request header with the given name and value. If a header with the
	 * specified name has already been set then the new value overwrites the
	 * current value.
	 * 
	 * @return
	 */
	public List<RequestHeader> getHeaders() {
		return headers;
	}

	/**
	 * Sets a request header with the given name and value. If a header with the
	 * specified name has already been set then the new value will be combined
	 * with previous one as comma separated list (According to section 4.2 of <a
	 * href="http://www.ietf.org/rfc/rfc2616">RFC 2616</a>).
	 * 
	 * <b>note</b>
	 * 
	 * @param key
	 *            header token
	 * @param value
	 *            header value <b>NOTE:</b> The empty string is legal and
	 *            represents the empty header value.
	 * @throws IllegalArgumentException
	 *             if header token is null or empty.
	 */
	public void setHeader(final String key, String value)
			throws IllegalArgumentException {
		if (key == null || key.equals("")) {
			throw new IllegalArgumentException("Header token cannot be null.");
		}
		if (this.headers == null) {
			this.headers = new ArrayList<RequestHeader>();
		}
		
		Collections.sort(headers, new RequestHeader.HeadersComparator());
		RequestHeader found = null;
		for(RequestHeader item : headers){
			if(item.getName().toLowerCase().equals(key.toLowerCase())){
				found = item;
				break;
			}
		}
		if(found != null){ // RFC 2616
			String currentValue = found.getValue();
			value = currentValue + ", " + value;
			headers.remove(found);
		}
		this.headers.add(new RequestHeader(key, value));
	}

	/**
	 * Removes previously set header (if eny) and create new value.
	 * 
	 * @param key
	 *            header token
	 * @param value
	 *            header value <b>NOTE:</b> The empty string is legal and
	 *            represents the empty header value.
	 * @throws IllegalArgumentException
	 *             if header token is null or empty.
	 */
	public void replaceHeader(String key, String value)
			throws IllegalArgumentException {
		if (key == null || key.equals("")) {
			throw new IllegalArgumentException("Header token cannot be null.");
		}
	}

	/**
	 * Sets all headers list overwriting all previous set list.
	 * 
	 * @param map
	 *            of headers.
	 */
	public void setHeaders(List<RequestHeader> headers) {
		this.headers = headers;
	}

	/**
	 * Get user password.
	 * 
	 * @return password or <b>null</b>
	 */
	public String getPassword() {
		return password;
	}

	/**
	 * Sets the password to use in the request URL. This is ignored if there is
	 * no user specified.
	 * 
	 * @param password
	 */
	public void setPassword(String password) {
		this.password = password;
	}

	/**
	 * @return requestData or <b>null</b>
	 */
	public String getRequestData() {
		return requestData;
	}

	/**
	 * Sets Request data to send with {@link XMLHttpRequest2}
	 * 
	 * @param requestData
	 */
	public void setRequestData(String requestData) {
		this.requestData = requestData;
	}

	/**
	 * 
	 * @return reqestFile or <b>null</b>
	 */
	public Blob getReqestFile() {
		return reqestFile;
	}

	/**
	 * Sets {@link File} to send with request.
	 * 
	 * @param reqestFile
	 */
	public void setReqestFile(Blob reqestFile) {
		this.reqestFile = reqestFile;
	}

	/**
	 * 
	 * @return requestFormData or <b>null</b>
	 */
	public FormData getRequestFormData() {
		return requestFormData;
	}

	/**
	 * Sets {@link FormData} to send vith request.
	 * 
	 * @param requestFormData
	 */
	public void setRequestFormData(FormData requestFormData) {
		this.requestFormData = requestFormData;
	}

	/**
	 * Get request timeout.
	 * 
	 * @return timeout in milliseconds
	 */
	public int getTimeoutMillis() {
		return timeoutMillis;
	}

	/**
	 * Sets request timeout.
	 * 
	 * @param timeoutMillis
	 *            in milliseconds
	 */
	public void setTimeoutMillis(int timeoutMillis) {
		this.timeoutMillis = timeoutMillis;
	}

	/**
	 * Get user value.
	 * 
	 * @return user or <b>null</b>
	 */
	public String getUser() {
		return user;
	}

	/**
	 * Set request user.
	 * 
	 * @param user
	 */
	public void setUser(String user) {
		this.user = user;
	}

	/**
	 * Get request method.
	 * 
	 * @return method According to section 9 of <a
	 *         href="http://www.ietf.org/rfc/rfc2616">RFC 2616</a>.
	 */
	public String getHttpMethod() {
		return httpMethod;
	}

	/**
	 * Get reqest URL.
	 * 
	 * @return
	 */
	public String getUrl() {
		return url;
	}

	

	/**
	 * True when user credentials are to be included in a cross-origin request.
	 * False when they are to be excluded in a cross-origin request and when
	 * cookies are to be ignored in its response. Initially false.
	 * 
	 * @param withCredentials
	 *            the withCredentials to set
	 */
	public void setWithCredentials(boolean withCredentials) {
		this.withCredentials = withCredentials;
	}

	/**
	 * @return the withCredentials
	 */
	public boolean isWithCredentials() {
		return withCredentials;
	}

	/**
	 * This is called when the request has been aborted. This method <b>must</b>
	 * be called before calling {@link #send()}
	 * 
	 * @param abortHandler
	 *            the abortHandler to set
	 */
	public final void setAbortHandler(AbortHandler abortHandler) {
		this.abortHandler = abortHandler;
	}
	public final void setUploadAbortHandler(AbortHandler abortHandler) {
		this.uploadAbortHandler = abortHandler;
	}

	/**
	 * This is called when the request has failed. This method <b>must</b> be
	 * called before calling {@link #send()}
	 * 
	 * @param errorHandler
	 *            the errorHandler to set
	 */
	public final void setErrorHandler(ErrorHandler errorHandler) {
		this.errorHandler = errorHandler;
	}
	public final void setUploadErrorHandler(ErrorHandler errorHandler) {
		this.uploadErrorHandler = errorHandler;
	}

	/**
	 * This is called when the request has completed (either in success or
	 * failure). This method <b>must</b> be called before calling
	 * {@link #send()}
	 * 
	 * @param loadEndHandler
	 *            the loadEndHandler to set
	 */
	public final void setLoadEndHandler(LoadEndHandler loadEndHandler) {
		this.loadEndHandler = loadEndHandler;
	}

	/**
	 * This is called when the request has successfully completed. This method
	 * <b>must</b> be called before calling {@link #send()}
	 * 
	 * @param loadHandler
	 *            the loadHandler to set
	 */
	public final void setLoadHandler(LoadHandler loadHandler) {
		this.loadHandler = loadHandler;
	}
	
	public final void setUploadLoadHandler(UploadLoadHandler loadHandler) {
		this.uploadLoadHandler = loadHandler;
	}
	/**
	 * This is called when the request starts. This method <b>must</b> be called
	 * before calling {@link #send()}
	 * 
	 * @param loadStartHandler
	 *            the loadStartHandler to set
	 */
	public final void setLoadStartHandler(LoadStartHandler loadStartHandler) {
		this.loadStartHandler = loadStartHandler;
	}
	public final void setUploadLoadStartHandler(LoadStartHandler loadStartHandler) {
		this.uploadLoadStartHandler = loadStartHandler;
	}
	/**
	 * This is called while loading and sending data.
	 * 
	 * @param progressHandler
	 *            the progressHandler to set This method <b>must</b> be called
	 *            before calling {@link #send()}
	 */
	public final void setProgressHandler(ProgressHandler progressHandler) {
		this.progressHandler = progressHandler;
	}
	
	public final void setUploadProgressHandler(ProgressHandler progressHandler){
		this.uploadProgressHandler = progressHandler;
	}
	
	
	/**
	 * This is called when the author specified timeout has passed before the
	 * request could complete.
	 * 
	 * @param timeoutHandler
	 *            the timeoutHandler to set
	 */
	public final void setTimeoutHandler(TimeoutHandler timeoutHandler) {
		this.timeoutHandler = timeoutHandler;
	}

	/**
	 * @param followRedirects
	 *            the followRedirects to set
	 */
	public final void setFollowRedirects(boolean followRedirects) {
		this.followRedirects = followRedirects;
	}
	
	/**
	 * Check if request will follow redirects
	 * 
	 * @return the followRedirects
	 */
	public boolean isFollowRedirects() {
		return followRedirects;
	}

	/**
	 * Sends an HTTP request based on the current builder configuration. If no
	 * request headers have been set, the header "Content-Type" will be used
	 * with a value of "text/plain; charset=utf-8".
	 * 
	 * @return
	 * @throws RequestException
	 */
	public Request send() throws RequestException {
		XMLHttpRequest2 xmlHttpRequest = XMLHttpRequest2.create();
		try {
			if (user != null && password != null) {
				xmlHttpRequest.open(httpMethod, url, user, password);
			} else if (user != null) {
				xmlHttpRequest.open(httpMethod, url, user);
			} else {
				xmlHttpRequest.open(httpMethod, url);
			}
		} catch (JavaScriptException e) {
			RequestPermissionException requestPermissionException = new RequestPermissionException(
					url);
			requestPermissionException.initCause(new RequestException(e
					.getMessage()));
			throw requestPermissionException;
		}

		setHeaders(xmlHttpRequest);
		//xmlHttpRequest.setAsBlob(true);
		final Request request = new Request(xmlHttpRequest);
		
		if (this.abortHandler != null) {
			xmlHttpRequest.setOnAbort(new XHRAbortHandler() {
				@Override
				public void onAbort(ProgressEvent event) {
					request.fireOnAbort(abortHandler, event);
				}
			});
		}
		if( this.uploadAbortHandler != null ){
			xmlHttpRequest.setUploadOnAbort( new XHRAbortHandler() {
				@Override
				public void onAbort(ProgressEvent event) {
					request.fireOnAbort(uploadAbortHandler, event);
				}
			});
		}
		
		if (this.errorHandler != null) {
			xmlHttpRequest.setOnError(new XHRErrorHandler() {
				@Override
				public void onError(ProgressEvent event) {
					request.fireOnError(errorHandler);
				}
			});
		}
		if (this.uploadErrorHandler != null) {
			xmlHttpRequest.setUploadOnError(new XHRErrorHandler() {
				@Override
				public void onError(ProgressEvent event) {
					request.fireOnError(uploadErrorHandler);
				}
			});
		}
		
		if (this.loadEndHandler != null) {
			xmlHttpRequest.setOnLoadEnd(new XHRLoadEndHandler() {
				@Override
				public void onLoadEnd(ProgressEvent event) {
					request.fireOnLoadEnd(loadEndHandler, event);
				}
			});
		}

		if (this.loadHandler != null) {
			xmlHttpRequest.setOnLoad( new XHRLoadHandler() {
				@Override
				public void onLoad(ProgressEvent event) {
					request.fireOnResponseReceived(loadHandler, event);
				}				
			});
		}
		if (this.uploadLoadHandler != null) {
			xmlHttpRequest.setUploadOnLoad( new XHRLoadHandler() {
				@Override
				public void onLoad(ProgressEvent event) {
					request.fireOnUploadLoadEnd(uploadLoadHandler, event);
				}				
			});
		}

		if (this.loadStartHandler != null) {
			xmlHttpRequest.setOnLoadStart(new XHRLoadStartHandler() {
				@Override
				public void onLoadStart(ProgressEvent event) {
					request.fireOnLoadStart(loadStartHandler, event);
				}
			});
		}
		
		if (this.uploadLoadStartHandler != null) {
			xmlHttpRequest.setUploadOnLoadStart(new XHRLoadStartHandler() {
				@Override
				public void onLoadStart(ProgressEvent event) {
					request.fireOnLoadStart(uploadLoadStartHandler, event);
				}
			});
		}
		
		if (this.progressHandler != null) {
			xmlHttpRequest.setOnProgress(new XHRProgressHandler() {
				@Override
				public void onProgress(ProgressEvent event) {
					request.fireProgress(progressHandler, event);
				}
			});
		}
		if (this.uploadProgressHandler != null) {
			xmlHttpRequest.setUploadOnProgress(new XHRProgressHandler() {
				@Override
				public void onProgress(ProgressEvent event) {
					request.fireProgress(uploadProgressHandler, event);
				}
			});
		}

		if (this.timeoutHandler != null) {
			xmlHttpRequest.setOnTimeout(new XHRTimeoutHandler() {
				@Override
				public void onTimeout(ProgressEvent event) {
					request.fireOnTimeout(timeoutHandler, event);
				}
			});
		}
		
		if (this.callback != null) {
			xmlHttpRequest.setOnReadyStateChange(new ReadyStateChangeHandler() {
				@Override
				public void onReadyStateChange(XMLHttpRequest2 xhr) {
					if (xhr.getReadyState() == XMLHttpRequest2.DONE) {
						xhr.clearOnReadyStateChange();
						request.fireOnResponseReceived(callback);
					}
				}
			});
		}
		
		xmlHttpRequest.setTimeout(this.timeoutMillis);
		
		try {
			if( requestFormData != null ){
				xmlHttpRequest.send( requestFormData );
			} else if( requestData != null ){
				xmlHttpRequest.send(requestData);
			} else {
				xmlHttpRequest.send();
			}
		} catch (JavaScriptException e) {
			throw new RequestException(e.getMessage());
		}

		return request;
	}
	
	
	private void setHeaders(XMLHttpRequest2 xmlHttpRequest)
			throws RequestException {
		if (headers == null || headers.size() == 0) { // default header
			if( requestFormData == null ){ //FormData create own Content-Type header
				xmlHttpRequest.setRequestHeader("Content-Type",
						"text/plain; charset=utf-8");
			}
		} else {
			
			for(RequestHeader item : headers){
				if(item == null) continue;
				String token = item.getName();
				if (token.equals("")) continue;
				String value = item.getValue();
				try {
					xmlHttpRequest.setRequestHeader(token, value);
				} catch (JavaScriptException e) {
					throw new RequestException(e.getMessage());
				}
			}
		}
	}
}
