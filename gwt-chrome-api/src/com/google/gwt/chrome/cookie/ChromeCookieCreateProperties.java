package com.google.gwt.chrome.cookie;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * Details about the cookie being set.
 * To create an instance of this object use {@link ChromeCookieCreateProperties#create()} function.
 * @author Pawel Psztyc
 *
 */
public final class ChromeCookieCreateProperties extends JavaScriptObject {
	protected ChromeCookieCreateProperties() {
	}
	/**
	 * Create an instance of an overlay JS object.
	 * This is only method to create an instance of this object.
	 * @return Instance of this object
	 */
	public static final native ChromeCookieCreateProperties create() /*-{
		return {};
	}-*/; 
	
	public native String getUrl() /*-{
		return this.url;
	}-*/;

	/**
	 * The request-URI to associate with the setting of the cookie. This value
	 * can affect the default domain and path values of the created cookie. If
	 * host permissions for this URL are not specified in the manifest file, the
	 * API call will fail.
	 * 
	 * @param url
	 */
	public native void setUrl(String url) /*-{
		this.url = url;
	}-*/;

	public native String getName() /*-{
		return this.name;
	}-*/;

	/**
	 * The name of the cookie. Empty by default if omitted.
	 * 
	 * @param name
	 */
	public native void setName(String name) /*-{
		this.name = name;
	}-*/;

	public native String getValue() /*-{
		return this.value;
	}-*/;

	/**
	 * The value of the cookie. Empty by default if omitted.
	 * 
	 * @param value
	 */
	public native void setValue(String value) /*-{
		this.value = value;
	}-*/;

	public native String getDomain() /*-{
		return this.domain;
	}-*/;

	/**
	 * The domain of the cookie. If omitted, the cookie becomes a host-only
	 * cookie.
	 * 
	 * @param domain
	 */
	public native void setDomain(String domain) /*-{
		this.domain = domain;
	}-*/;

	public native String getPath() /*-{
		return this.path;
	}-*/;

	/**
	 * The path of the cookie. Defaults to the path portion of the url
	 * parameter.
	 * 
	 * @param path
	 */
	public native void setPath(String path) /*-{
		this.path = path;
	}-*/;

	public native boolean isSecure() /*-{
		return this.secure || false;
	}-*/;

	/**
	 * Whether the cookie should be marked as Secure. Defaults to false.
	 * 
	 * @param secure
	 */
	public native void setSecure(boolean secure) /*-{
		this.secure = secure;
	}-*/;

	/**
	 * Whether the cookie should be marked as HttpOnly. Defaults to false.
	 * 
	 * @return
	 */
	public native boolean isHttpOnly() /*-{
		return this.httpOnly || false;
	}-*/;

	/**
	 * Whether the cookie should be marked as HttpOnly. Defaults to false.
	 * 
	 * @param httpOnly
	 */
	public native void setHttpOnly(boolean httpOnly) /*-{
		this.httpOnly = httpOnly;
	}-*/;

	public native double getExpirationDate() /*-{
		return this.expirationDate || 0;
	}-*/;

	/**
	 * The expiration date of the cookie as the number of seconds since the UNIX
	 * epoch. If omitted, the cookie becomes a session cookie.
	 * 
	 * @param expirationDate
	 */
	public native void setExpirationDate(double expirationDate) /*-{
		this.expirationDate = expirationDate;
	}-*/;

	public native String getStoreId() /*-{
		return this.storeId;
	}-*/;

	/**
	 * The ID of the cookie store in which to set the cookie. By default, the
	 * cookie is set in the current execution context's cookie store.
	 * 
	 * @param storeId
	 */
	public native void setStoreId(String storeId) /*-{
		this.storeId = storeId;
	}-*/;

}
