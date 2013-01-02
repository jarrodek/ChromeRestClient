package com.google.gwt.xhr2.client;

import com.google.gwt.core.client.JavaScriptException;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Document;
import com.google.gwt.file.client.Blob;
import com.google.gwt.xhr2.client.ReadyStateChangeHandler;
/**
 * The native XMLHttpRequest (Level 2) object. 
 * 
 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/"
 * >http://www.w3.org/TR/XMLHttpRequest2/</a>/
 */
public class XMLHttpRequest2 extends JavaScriptObject {
	/*
	 * NOTE: Testing discovered that for some bizarre reason, on Mozilla, the
	 * JavaScript <code>XmlHttpRequest.onreadystatechange</code> handler
	 * function maybe still be called after it is deleted. The theory is that
	 * the callback is cached somewhere. Setting it to null or an empty function
	 * does seem to work properly, though.
	 * 
	 * On IE, there are two problems: Setting onreadystatechange to null (as
	 * opposed to an empty function) sometimes throws an exception. With
	 * particular (rare) versions of jscript.dll, setting onreadystatechange
	 * from within onreadystatechange causes a crash. Setting it from within a
	 * timeout fixes this bug (see issue 1610).
	 * 
	 * End result: *always* set onreadystatechange to an empty function (never
	 * to null). Never set onreadystatechange from within onreadystatechange
	 * (always in a setTimeout()).
	 */

	/**
	 * When constructed, the XMLHttpRequest object must be in the UNSENT state.
	 */
	public static final int UNSENT = 0;

	/**
	 * The OPENED state is the state of the object when the open() method has
	 * been successfully invoked. During this state request headers can be set
	 * using setRequestHeader() and the request can be made using send().
	 */
	public static final int OPENED = 1;

	/**
	 * The HEADERS_RECEIVED state is the state of the object when all response
	 * headers have been received.
	 */
	public static final int HEADERS_RECEIVED = 2;

	/**
	 * The LOADING state is the state of the object when the response entity
	 * body is being received.
	 */
	public static final int LOADING = 3;

	/**
	 * The DONE state is the state of the object when either the data transfer
	 * has been completed or something went wrong during the transfer (infinite
	 * redirects for instance).
	 */
	public static final int DONE = 4;

	/**
	 * Creates an XMLHttpRequest object.
	 * 
	 * @return the created object
	 */
	public static native XMLHttpRequest2 create() /*-{
		// Don't check window.XMLHttpRequest, because it can
		// cause cross-site problems on IE8 if window's URL
		// is javascript:'' .
		if ($wnd.XMLHttpRequest) {
			return new $wnd.XMLHttpRequest();
		} else {
			try {
				return new $wnd.ActiveXObject('MSXML2.XMLHTTP.3.0');
			} catch (e) {
				return new $wnd.ActiveXObject("Microsoft.XMLHTTP");
			}
		}
	}-*/;

	protected XMLHttpRequest2() {
	}

	/**
	 * Aborts the current request.
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest/#abort"
	 * >http://www.w3.org/TR/XMLHttpRequest/#abort</a>.
	 */
	public final native void abort() /*-{
		this.abort();
	}-*/;

	/**
	 * Clears the {@link ReadyStateChangeHandler}.
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#event-xhr-readystatechange"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#event-xhr-readystatechange</a>.
	 * 
	 * @see #clearOnReadyStateChange()
	 */
	public final native void clearOnReadyStateChange() /*-{
		var self = this;
		$wnd.setTimeout(function() {
			// Using a function literal here leaks memory on ie6
			// Using the same function object kills HtmlUnit
			self.onreadystatechange = new Function();
		}, 0);
	}-*/;

	/**
	 * Gets all the HTTP response headers, as a single string.
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#the-getallresponseheaders-method"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#the-getallresponseheaders-method</a>.
	 * 
	 * @return the response headers.
	 */
	public final native String getAllResponseHeaders() /*-{
		if( this.readyState == 0 || this.readyState == 1){
			return "";
		}
		return this.getAllResponseHeaders();
	}-*/;
	/**
	 * 
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#the-getallresponseheaders-method"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#the-getallresponseheaders-method</a>.
	 * 
	 * @return the response headers.
	 */
	public final native void overrideMimeType(String mime) /*-{
		this.overrideMimeType(mime);
	}-*/;
	/**
	 * Get's the current ready-state.
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-readystate"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-readystate</a>.
	 * 
	 * @return the ready-state constant
	 */
	public final native int getReadyState() /*-{
		return this.readyState;
	}-*/;

	/**
	 * Gets an HTTP response header.
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-getresponseheader"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-getresponseheader</a>.
	 * 
	 * @param header
	 *            the response header to be retrieved
	 * @return the header value
	 */
	public final native String getResponseHeader(String header) /*-{
		if( this.readyState == 0 || this.readyState == 1){
			return null;
		} 
		return this.getResponseHeader(header);
	}-*/;

	/**
	 * the text response entity body.
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#the-responsetext-attribute"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#the-responsetext-attribute</a>.
	 * and <a href="http://www.w3.org/TR/XMLHttpRequest2/#text-response-entity-body"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#text-response-entity-body</a>
	 * @return the text response entity body.
	 */
	public final native String getResponseText() /*-{
		return this.responseText;
	}-*/;
	
	/**
	 * the text response XML entity body.
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-responsexml"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-responsexml</a>.
	 * and <a href="http://www.w3.org/TR/XMLHttpRequest2/#text-response-entity-body"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#text-response-entity-body</a>
	 * @return the text response entity body.
	 */
	public final native Document getResponseXML() /*-{
		return this.responseXML;
	}-*/;

	/**
	 * Gets the HTTP status code.
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#the-status-attribute"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#the-status-attribute</a>.
	 * 
	 * @return the HTTP status code.
	 */
	public final native int getStatus() /*-{
		return this.status;
	}-*/;

	/**
	 * Gets HTTP the status text.
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-statustext"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-statustext</a>.
	 * 
	 * @return the HTTP status text
	 */
	public final native String getStatusText() /*-{
		return this.statusText;
	}-*/;
	/**
	 * Gets HTTP response body.
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-responsebody"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-responsebody</a>.
	 * 
	 * @return the response body text
	 */
	public final native byte[] getResponseBody() /*-{
		return this.responseBody;
	}-*/;
	/**
	 * Gets HTTP response blob.
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-responseblob"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-responseblob</a>.
	 * 
	 * @return the response body text
	 */
	public final native Blob getResponseBlob() /*-{
		return this.responseBlob;
	}-*/;
	
	/**
	 * 
	 * @return the response as a Blob.
	 */
	public final native Blob getResponseAsBlob() throws JavaScriptException /*-{
		return this.response;
	}-*/;
	/**
	 * 
	 * @return the response as a String.
	 */
	public final native String getResponseAsString() throws JavaScriptException /*-{
		return this.response;
	}-*/;
	/**
	 * 
	 * @return the response as a Document.
	 */
	public final native Document getResponseAsDocument() throws JavaScriptException /*-{
		return this.response;
	}-*/;

	/**
	 * Opens an asynchronous connection.
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-open"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-open</a>.
	 * 
	 * @param httpMethod
	 *            the HTTP method to use
	 * @param url
	 *            the URL to be opened
	 */
	public final native void open(String httpMethod, String url) /*-{
		this.open(httpMethod, url, true);
	}-*/;

	/**
	 * Opens an asynchronous connection.
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-open"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-open</a>.
	 * 
	 * @param httpMethod
	 *            the HTTP method to use
	 * @param url
	 *            the URL to be opened
	 * @param user
	 *            user to use in the URL
	 */
	public final native void open(String httpMethod, String url, String user) /*-{
		this.open(httpMethod, url, true, user);
	}-*/;

	/**
	 * Opens an asynchronous connection.
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-open"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-open</a>.
	 * 
	 * @param httpMethod
	 *            the HTTP method to use
	 * @param url
	 *            the URL to be opened
	 * @param user
	 *            user to use in the URL
	 * @param password
	 *            password to use in the URL
	 */
	public final native void open(String httpMethod, String url, String user,
			String password) /*-{
		this.open(httpMethod, url, true, user, password);
	}-*/;

	/**
	 * Initiates a request with no request data. This simply calls
	 * {@link #send(String)} with <code>null</code> as an argument, because the
	 * no-argument <code>send()</code> method is unavailable on Firefox.
	 */
	public final void send() {
		send((String) null);
	}

	/**
	 * Initiates a request with data. If there is no data, specify null.
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-send"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-send</a>.
	 * 
	 * @param requestData
	 *            the data to be sent with the request
	 */
	public final native void send(String requestData) /*-{
		this.send(requestData);
	}-*/;
	/**
	 * Initiates a request with File data.
	 * Data is an File type data (file object from fileList input type
	 * 
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-send"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-send</a>.
	 * and <a href="http://dev.w3.org/2006/webapi/FileAPI/#dfn-Blob"
	 * >http://dev.w3.org/2006/webapi/FileAPI/#dfn-Blob</a>
	 * @param data
	 *            the File data to be sent with the request
	 */
	public final native void send(Blob data) /*-{
		this.send(data);
	}-*/;
	/**
	 * Initiates a request with Form data object.
	 * Data is an {@link FormData} object 
	 * 
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-send"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-send</a>.
	 * and <a href="http://www.w3.org/TR/XMLHttpRequest2/#formdata"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#formdata</a>
	 * @param data
	 *            the File data to be sent with the request
	 */
	public final native void send(FormData data) /*-{
		this.send(data);
	}-*/;
	/**
	 * Sets the {@link ReadyStateChangeHandler} to be notified when the object's
	 * ready-state changes.
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest/#onreadystatechange"
	 * >http://www.w3.org/TR/XMLHttpRequest/#onreadystatechange</a>.
	 * 
	 * <p>
	 * Note: Applications <em>must</em> call {@link #clearOnReadyStateChange()}
	 * when they no longer need this object, to ensure that it is cleaned up
	 * properly. Failure to do so will result in memory leaks on some browsers.
	 * </p>
	 * 
	 * @param handler
	 *            the handler to be called when the ready state changes
	 * @see #clearOnReadyStateChange()
	 */
	public final native void setOnReadyStateChange(
			ReadyStateChangeHandler handler) /*-{
		// The 'this' context is always supposed to point to the xhr2 object in the
		// onreadystatechange handler, but we reference it via closure to be extra sure.
		var _this = this;
		this.onreadystatechange = $entry(function(e) {
			handler.@com.google.gwt.xhr2.client.ReadyStateChangeHandler::onReadyStateChange(Lcom/google/gwt/xhr2/client/XMLHttpRequest2;)(_this);
		});
	}-*/;
	/**
	 * Sets request load start event handler.
	 * @param handler
	 */
	public final native void setOnLoadStart(
			XHRLoadStartHandler handler) /*-{
		// The 'this' context is always supposed to point to the xhr2 object in the
		// onreadystatechange handler, but we reference it via closure to be extra sure.
		var _this = this;
		this.onloadstart = $entry(function(e) {
			ProgressEvent = @com.google.gwt.xhr2.client.ProgressEvent::initProgressEvent(ZDD);
			var event = ProgressEvent(e.lengthComputable,e.loaded,e.total);
			handler.@com.google.gwt.xhr2.client.XHRLoadStartHandler::onLoadStart(Lcom/google/gwt/xhr2/client/ProgressEvent;)(event);
		});
	}-*/;
	/**
	 * Sets load start event handler for upload event.
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#handler-xhr-onloadstart"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#handler-xhr-onloadstart</a>
	 * @param handler
	 */
	public final native void setUploadOnLoadStart(
			XHRLoadStartHandler handler) /*-{
		var _this = this;
		this.upload.onloadstart = $entry(function(e) {
			ProgressEvent = @com.google.gwt.xhr2.client.ProgressEvent::initProgressEvent(ZDD);
			var event = ProgressEvent(e.lengthComputable,e.loaded,e.total);
			handler.@com.google.gwt.xhr2.client.XHRLoadStartHandler::onLoadStart(Lcom/google/gwt/xhr2/client/ProgressEvent;)(event);
		});
	}-*/;
	
	
	/**
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#event-xhr-progress"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#event-xhr-progress</a>
	 * @param handler
	 */
	public final native void setOnProgress(
			XHRProgressHandler handler) /*-{
		var _this = this;
		this.onprogress = $entry(function(e) {
			ProgressEvent = @com.google.gwt.xhr2.client.ProgressEvent::initProgressEvent(ZDD);
			var event = ProgressEvent(e.lengthComputable,e.loaded,e.total);
			handler.@com.google.gwt.xhr2.client.XHRProgressHandler::onProgress(Lcom/google/gwt/xhr2/client/ProgressEvent;)(event);
		});
	}-*/;
	/**
	 * Sets progress event handler for upload event.
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#event-xhr-progress"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#event-xhr-progress</a>
	 * @param handler
	 */
	public final native void setUploadOnProgress(
			XHRProgressHandler handler) /*-{
		var _this = this;
		this.upload.onprogress = $entry(function(e) {
			ProgressEvent = @com.google.gwt.xhr2.client.ProgressEvent::initProgressEvent(ZDD);
			var event = ProgressEvent(e.lengthComputable,e.loaded,e.total);
			handler.@com.google.gwt.xhr2.client.XHRProgressHandler::onProgress(Lcom/google/gwt/xhr2/client/ProgressEvent;)(event);
		});
	}-*/;
	/**
	 * Sets Abort event handler for calling {@link XMLHttpRequest2#abort()} method.
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#event-xhr-abort"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#event-xhr-abort</a>
	 * @param handler
	 */
	public final native void setOnAbort(
			XHRAbortHandler handler) /*-{
		var _this = this;
		this.onabort = $entry(function(e) {
			ProgressEvent = @com.google.gwt.xhr2.client.ProgressEvent::initProgressEvent(ZDD);
			var event = ProgressEvent(e.lengthComputable,e.loaded,e.total);
			handler.@com.google.gwt.xhr2.client.XHRAbortHandler::onAbort(Lcom/google/gwt/xhr2/client/ProgressEvent;)(event);
		});
	}-*/;
	/**
	 * Sets Abort event handler for abort upload event.
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#event-xhr-abort"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#event-xhr-abort</a>
	 * @param handler
	 */
	public final native void setUploadOnAbort(
			XHRAbortHandler handler) /*-{
		var _this = this;
		this.upload.onabort = $entry(function(e) {
			ProgressEvent = @com.google.gwt.xhr2.client.ProgressEvent::initProgressEvent(ZDD);
			var event = ProgressEvent(e.lengthComputable,e.loaded,e.total);
			handler.@com.google.gwt.xhr2.client.XHRAbortHandler::onAbort(Lcom/google/gwt/xhr2/client/ProgressEvent;)(event);
		});
	}-*/;
	/**
	 * Sets load event handler.
	 * Called when the request has successfully completed.
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#event-xhr-load"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#event-xhr-load</a>
	 * @param handler
	 */
	public final native void setOnLoad(
			XHRLoadHandler handler) /*-{
		var _this = this;
		//$wnd.console.log(this);
		this.onload = $entry(function(e) {
			ProgressEvent = @com.google.gwt.xhr2.client.ProgressEvent::initProgressEvent(ZDD);
			var event = ProgressEvent(e.lengthComputable,e.loaded,e.total);
			handler.@com.google.gwt.xhr2.client.XHRLoadHandler::onLoad(Lcom/google/gwt/xhr2/client/ProgressEvent;)(event);
		});
	}-*/;
	/**
	 * Sets load event handler for request upload object.
	 * Called when the upload has successfully completed.
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#event-xhr-load"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#event-xhr-load</a>
	 * @param handler
	 */
	public final native void setUploadOnLoad(
			XHRLoadHandler handler) /*-{
		var _this = this;
		//$wnd.console.log(this);
		this.upload.onload = $entry(function(e) {
			ProgressEvent = @com.google.gwt.xhr2.client.ProgressEvent::initProgressEvent(ZDD);
			var event = ProgressEvent(e.lengthComputable,e.loaded,e.total);
			handler.@com.google.gwt.xhr2.client.XHRLoadHandler::onLoad(Lcom/google/gwt/xhr2/client/ProgressEvent;)(event);
		});
	}-*/;
	/**
	 * Sets timeout event handler.
	 * Called when the author specified timeout has passed before the request could complete.
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#event-xhr-timeout"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#event-xhr-timeout</a>
	 * @param handler
	 */
	public final native void setOnTimeout(
			XHRTimeoutHandler handler) /*-{
		var _this = this;
		this.ontimeout = $entry(function(e) {
			ProgressEvent = @com.google.gwt.xhr2.client.ProgressEvent::initProgressEvent(ZDD);
			var event = ProgressEvent(e.lengthComputable,e.loaded,e.total);
			handler.@com.google.gwt.xhr2.client.XHRTimeoutHandler::onTimeout(Lcom/google/gwt/xhr2/client/ProgressEvent;)(event);
		});
	}-*/;
	/**
	 * Sets timeout event handler.
	 * Called when the request has completed (either in success or failure).
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#event-xhr-loadend"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#event-xhr-loadend</a>
	 * @param handler
	 */
	public final native void setOnLoadEnd(XHRLoadEndHandler handler) /*-{
		var _this = this;
		this.onloadend = $entry(function(e) {
			ProgressEvent = @com.google.gwt.xhr2.client.ProgressEvent::initProgressEvent(ZDD);
			var event = ProgressEvent(e.lengthComputable,e.loaded,e.total);
			handler.@com.google.gwt.xhr2.client.XHRLoadEndHandler::onLoadEnd(Lcom/google/gwt/xhr2/client/ProgressEvent;)(event);
		});
	}-*/;
	/**
	 * Sets request error event handler.
	 * 
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#event-xhr-error"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#event-xhr-error</a>
	 * @param handler
	 */
	public final native void setOnError(XHRErrorHandler handler) /*-{
		var _this = this;
		this.onerror = $entry(function(e) {
			ProgressEvent = @com.google.gwt.xhr2.client.ProgressEvent::initProgressEvent(ZDD);
			var event = ProgressEvent(e.lengthComputable,e.loaded,e.total);
			handler.@com.google.gwt.xhr2.client.XHRErrorHandler::onError(Lcom/google/gwt/xhr2/client/ProgressEvent;)(event);
		});
	}-*/;
	/**
	 * Sets error event handler for upload object.
	 * 
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#event-xhr-error"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#event-xhr-error</a>
	 * @param handler
	 */
	public final native void setUploadOnError(XHRErrorHandler handler) /*-{
		var _this = this;
		this.upload.onerror = $entry(function(e) {
			ProgressEvent = @com.google.gwt.xhr2.client.ProgressEvent::initProgressEvent(ZDD);
			var event = ProgressEvent(e.lengthComputable,e.loaded,e.total);
			handler.@com.google.gwt.xhr2.client.XHRErrorHandler::onError(Lcom/google/gwt/xhr2/client/ProgressEvent;)(event);
		});
	}-*/;
	/**
	 * Sets a request header.
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-setrequestheader"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-setrequestheader</a>.
	 * <code>
	 * // The following script:
	 *	var client = new XMLHttpRequest();
	 *	client.open('GET', 'demo.cgi');
	 *	client.setRequestHeader('X-Test', 'one');
	 *	client.setRequestHeader('X-Test', 'two');
	 *	client.send();
	 *	
	 *	// ...would result in the following header being sent:
	 *	...
	 *	X-Test: one, two
	 *	...
	 *	</code>
	 * @param header
	 *            the header to be set
	 * @param value
	 *            the header's value
	 */
	public final native void setRequestHeader(String header, String value) /*-{
		this.setRequestHeader(header, value);
	}-*/;
	/**
	 * Sets request timeout.
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#request-timeout"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#request-timeout</a>
	 * 
	 * @param timeoutValue The request timeout. 
	 * 	The amount of milliseconds a request can take 
	 *  before being terminated. Initially zero.
	 */
	public final native void setTimeout(double timeoutValue)/*-{
		this.timeout = timeoutValue;
	}-*/;
	/**
	 * Gets request timeout.
	 * 
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#request-timeout"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#request-timeout</a>
	 * 
	 * @param timeoutValue The request timeout. 
	 * 	The amount of milliseconds a request can take 
	 *  before being terminated. Initially zero.
	 */
	public final native double getTimeout()/*-{
		return this.timeout;
	}-*/;
	/**
	 * Gets request timeout.
	 * 
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#as-blob-flag"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#as-blob-flag</a>
	 * 
	 * @param flag Either true or false. 
	 * 	When true responseBlob can be used. Initially false.
	 */
	public final native void setAsBlob(boolean flag)/*-{
		this.asBlob = flag;
	}-*/;
	/**
	 * Sets request timeout.
	 * 
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#as-blob-flag"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#as-blob-flag</a>
	 * 
	 * @param flag Either true or false. 
	 * 	When true responseBlob can be used. Initially false.
	 */
	public final native boolean getAsBlob()/*-{
		return this.asBlob;
	}-*/;
	/**
	 * Sets requests followRedirects flag.
	 * 
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-followredirects"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-followredirects</a>
	 * 
	 * @param flag True when redirects are to be followed. 
	 * False otherwise. Initially true.
	 */
	public final native void setFollowRedirects(boolean flag)/*-{
		this.followRedirects = flag;
	}-*/;
	/**
	 * Gets requests followRedirects flag.
	 * 
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-followredirects"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-followredirects</a>
	 * 
	 * @param flag True when redirects are to be followed. 
	 * False otherwise. Initially true.
	 */
	public final native boolean getFollowRedirects()/*-{
		return this.followRedirects;
	}-*/;
	/**
	 * Sets requests withCredentials flag.
	 * 
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#credentials-flag"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#credentials-flag</a>
	 * and <a href="http://www.w3.org/TR/XMLHttpRequest2/#user-credentials"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#user-credentials</a>
	 * </p>
	 * <b>NOTE:</b> The credentials flag has no effect when fetching same-origin resources
	 * 
	 * @param True when user credentials are to be included in a cross-origin request. 
	 * 	False when they are to be excluded in a cross-origin request and when cookies 
	 * 	are to be ignored in its response. Initially false.
	 */
	public final native void setWithCredentials(boolean flag)/*-{
		this.withCredentials = flag;
	}-*/;
	/**
	 * Gets requests withCredentials flag.
	 * 
	 * <p>
	 * See <a href="http://www.w3.org/TR/XMLHttpRequest2/#credentials-flag"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#credentials-flag</a>
	 * and <a href="http://www.w3.org/TR/XMLHttpRequest2/#user-credentials"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#user-credentials</a>
	 * 
	 * @param True when user credentials are to be included in a cross-origin request. 
	 * 	False when they are to be excluded in a cross-origin request and when cookies 
	 * 	are to be ignored in its response. Initially false.
	 */
	public final native boolean getWithCredentials()/*-{
		return this.withCredentials;
	}-*/;
	 
}
