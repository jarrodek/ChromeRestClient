package com.google.gwt.chrome.cookie;

import com.google.gwt.core.client.JavaScriptObject;

public final class CookieQuery extends JavaScriptObject {
	protected CookieQuery() {
	}

	/**
	 * The URL with which the cookie to retrieve is associated. This argument
	 * may be a full URL, in which case any data following the URL path (e.g.
	 * the query string) is simply ignored. If host permissions for this URL are
	 * not specified in the manifest file, the API call will fail.
	 * 
	 * @param url
	 */
	public native void setUrl(String url) /*-{
		this.url = url;
	}-*/;

	/**
	 * 
	 * @param name
	 *            The name of the cookie to retrieve.
	 */
	public native void setName(String name) /*-{
		this.name = name;
	}-*/;
	/**
	 * 
	 * @return Domain parameter
	 */
	public native String getDomain() /*-{
		return this.domain;
	}-*/;
	/**
	 * Restricts the retrieved cookies to those whose domains match or are subdomains of this one.
	 * @param domain
	 */
	public native void setDomain(String domain) /*-{
		this.domain = domain;
	}-*/;

	public native String getPath() /*-{
		return this.path;
	}-*/;
	/**
	 * Restricts the retrieved cookies to those whose path exactly matches this string.
	 * @param path
	 */
	public native void setPath(String path) /*-{
		this.path = path;
	}-*/;
	
	public native boolean isSecure() /*-{
		return this.secure;
	}-*/;
	/**
	 * Filters the cookies by their Secure property.
	 * @param secure
	 */
	public native void setSecure(boolean secure) /*-{
		this.secure = secure;
	}-*/;

	public native boolean isSession() /*-{
		return this.session;
	}-*/;
	/**
	 * Filters out session vs. persistent cookies.
	 * @param session
	 */
	public native void setSession(boolean session) /*-{
		this.session = session;
	}-*/;

	/**
	 * 
	 * @param storeId
	 *            Optional. The ID of the cookie store in which to look for the
	 *            cookie. By default, the current execution context's cookie
	 *            store will be used.
	 */
	public native void setStoreId(String storeId) /*-{
		this.storeId = storeId;
	}-*/;

	/**
	 * 
	 * @return The URL with which the cookie to retrieve is associated.
	 */
	public native String getUrl() /*-{
		return this.url;
	}-*/;

	/**
	 * 
	 * @return The name of the cookie.
	 */
	public native String getName() /*-{
		return this.name;
	}-*/;

	/**
	 * @return The ID of the cookie store in which to look for the cookie.
	 */
	public native String getStoreId() /*-{
		return this.storeId || null;
	}-*/;
}
