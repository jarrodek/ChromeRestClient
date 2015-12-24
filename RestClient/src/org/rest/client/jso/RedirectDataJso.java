package org.rest.client.jso;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArray;

/**
 * A class representing redirect data returned from the background page. 
 * @author Pawel Psztyc
 *
 */
public final class RedirectDataJso extends JavaScriptObject {
	protected RedirectDataJso(){}
	/**
	 * @return An URL where the request was redirected. 
	 */
	public native String getRedirectUrl() /*-{
		return this.redirectUrl;
	}-*/;
	/**
	 * @return Redirect status code
	 */
	public native int getStatusCode() /*-{
		return this.statusCode;
	}-*/;
	/**
	 * @return Redirect status message
	 */
	public native String getStatusLine() /*-{
		return this.statusLine;
	}-*/;
	/**
	 * @return true if the response comes from cache
	 */
	public native boolean isFromCache() /*-{
		return this.fromCache;
	}-*/;
	/**
	 * @return Headers send with redirect response.
	 */
	public native JsArray<HeaderJso> getResponseHeaders() /*-{
		return this.responseHeaders;
	}-*/;
	
}
