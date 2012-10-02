package com.google.gwt.xhr2.client;

import com.google.gwt.dom.client.Document;
import com.google.gwt.file.client.Blob;

/**
 * {@link XMLHttpRequest2} response object
 * 
 * @author jarrod
 * 
 */
public class Response {

	private final XMLHttpRequest2 xhr2;

	/**
	 * Creates new response object
	 * 
	 * @param xhr2
	 */
	public Response(XMLHttpRequest2 xhr2) {
		this.xhr2 = xhr2;
	}

	public Header[] getHeaders() {
		return Request.getHeaders(this.xhr2);
	}

	/**
	 * Return the HTTP status code.
	 * 
	 * @return the HTTP status code
	 */
	public int getStatus() {
		return xhr2.getStatus();
	}

	/**
	 * Return the HTTP status text.
	 * 
	 * @return the HTTP status text.
	 */
	public String getStatusText() {
		return xhr2.getStatusText();
	}

	/**
	 * Returns the header field value from the response of which the field name
	 * matches header, unless the field name is <b>Set-Cookie</b> or
	 * <b>Set-Cookie2</b>.
	 * <p>
	 * See <a href=
	 * "http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-getresponseheader"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-
	 * getresponseheader</a>
	 * </p>
	 * <h3>Example</h3>
	 * 
	 * <pre>
	 * var client = new XMLHttpRequest();
	 * client.open("GET", "unicorns-are-teh-awesome.txt", true);
	 * client.send();
	 * client.onreadystatechange = function() {
	 *  if(this.readyState == 2) {
	 * 		print(client.getResponseHeader("Content-Type"));
	 * 	}
	 * }
	 * The print() function will get to process something like:
	 * 
	 * text/plain; charset=UTF-8
	 * </pre>
	 * 
	 * @param header
	 *            name
	 * @return the header field value
	 */
	public String getResponseHeader(String header) {
		return xhr2.getResponseHeader(header);
	}

	/**
	 * Return all the HTTP headers, excluding headers that are a
	 * case-insensitive match for <b>Set-Cookie</b> or <b>Set-Cookie2</b>,
	 * inflated, as a single string, with each header line separated by a U+000D
	 * CR U+000A LF pair, excluding the status line, and with each header name
	 * and header value separated by a U+003A COLON U+0020 SPACE pair.
	 * <p>
	 * See <a href=
	 * "http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-getallresponseheaders"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-
	 * getallresponseheaders</a>
	 * </p>
	 * 
	 * <h3>Example</h3> For the following script:
	 * 
	 * <pre>
	 * var client = new XMLHttpRequest();<br/>
	 * client.open("GET", "narwhals-too.txt", true);
	 * client.send();
	 * client.onreadystatechange = function() {
	 * 	if(this.readyState == 2) {
	 * 		print(this.getAllResponseHeaders());
	 * 	}
	 * }
	 * </pre>
	 * 
	 * The print() function will get to process something like:
	 * 
	 * <pre>
	 * Date: Sun, 24 Oct 2004 04:58:38 GMT
	 * Server: Apache/1.3.31 (Unix)
	 * Keep-Alive: timeout=15, max=99
	 * Connection: Keep-Alive
	 * Transfer-Encoding: chunked
	 * Content-Type: text/plain; charset=utf-8
	 * </pre>
	 * 
	 * @return Return all the HTTP headers
	 */
	public String getAllResponseHeaders() {
		return xhr2.getAllResponseHeaders();
	}

	/**
	 * Overwrites mime type of response
	 * 
	 * @param mime
	 */
	public void overrideMimeType(String mime) {
		xhr2.overrideMimeType(mime);
	}

	/**
	 * The text response entity body.
	 * <p>
	 * See <a
	 * href="http://www.w3.org/TR/XMLHttpRequest2/#the-responsetext-attribute"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#the-responsetext-attribute</a>.
	 * and <a
	 * href="http://www.w3.org/TR/XMLHttpRequest2/#text-response-entity-body"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#text-response-entity-body</a>
	 * 
	 * @return the text response entity body.
	 */
	public String getResponseText() {
		return xhr2.getResponseText();
	};

	/**
	 * the text response XML entity body.
	 * <p>
	 * See <a href=
	 * "http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-responsexml"
	 * >http
	 * ://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-responsexml</a>. and
	 * <a href="http://www.w3.org/TR/XMLHttpRequest2/#text-response-entity-body"
	 * >http://www.w3.org/TR/XMLHttpRequest2/#text-response-entity-body</a>
	 * 
	 * @return the text response entity body.
	 */
	public Document getResponseXML() {
		return xhr2.getResponseXML();
	};

	/**
	 * Gets HTTP response body.
	 * <p>
	 * See <a href=
	 * "http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-responsebody"
	 * >http
	 * ://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-responsebody</a>.
	 * 
	 * @return the response body text
	 */
	public byte[] getResponseBody() {
		return xhr2.getResponseBody();
	};

	/**
	 * Gets HTTP response blob.
	 * <p>
	 * See <a href=
	 * "http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-responseblob"
	 * >http
	 * ://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-responseblob</a>.
	 * 
	 * @return the response body text
	 */
	public Blob getResponseBlob() {
		return xhr2.getResponseBlob();
	};
}
