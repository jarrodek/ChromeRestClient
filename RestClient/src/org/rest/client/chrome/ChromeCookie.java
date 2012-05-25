package org.rest.client.chrome;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * Wrapper for Chrome extensions Cookie object. Represents information about an
 * HTTP cookie.
 * 
 * @author Paweł Psztyć
 * 
 */
public class ChromeCookie extends JavaScriptObject {
	protected ChromeCookie(){}
	
	@SuppressWarnings("javadoc")
	public static final native ChromeCookie testCreate(String name, String value, 
			Long exp, String domain, boolean isSecure, boolean httpOnly, 
			String path, String storeId) /*-{
		var _this = {};
		_this.name = name;
		_this.value = value;
		if( exp != null){
			_this.expirationDate = exp;
			_this.session = false;
		} else {
			_this.session = true;
		}
		_this.domain = domain;
		_this.secure = isSecure;
		_this.httpOnly = httpOnly;
		_this.path = path;
		_this.storeId = storeId;
		return _this;
	}-*/;
	
	// {"domain":"127.0.0.1","hostOnly":true,"httpOnly":false,"name":"cookieName","path":"/","secure":false,"session":true,"storeId":"0","value":"\"cookie value\""}
	/**
	 * 
	 * @return The domain of the cookie (e.g. "www.google.com", "example.com").
	 */
	public final native String getDomain()/*-{
		return this.domain;
	}-*/;
	/**
	 * This is optional and can be null if there is no expiration date
	 * 
	 * @return The expiration date of the cookie as the number of seconds since
	 *         the UNIX epoch. Not provided for session cookies.
	 */
	public final native Long getExpirationDate() /*-{
		return this.expirationDate || null;
	}-*/;

	/**
	 * 
	 * @return True if the cookie is a host-only cookie (i.e. a request's host
	 *         must exactly match the domain of the cookie).
	 */
	public final native boolean isHostOnly()/*-{
		return !!(this.hostOnly);
	}-*/;

	/**
	 * 
	 * @return True if the cookie is marked as HttpOnly (i.e. the cookie is
	 *         inaccessible to client-side scripts).
	 */
	public final native boolean isHttpOnly()/*-{
		return !!(this.httpOnly);
	}-*/;

	/**
	 * 
	 * @return The name of the cookie.
	 */
	public final native String getName()/*-{
		return this.name;
	}-*/;

	/**
	 * 
	 * @return The path of the cookie.
	 */
	public final native String getPath()/*-{
		return this.path;
	}-*/;

	/**
	 * 
	 * @return True if the cookie is marked as Secure (i.e. its scope is limited
	 *         to secure channels, typically HTTPS).
	 */
	public final native boolean isSecure()/*-{
		return !!(this.secure);
	}-*/;

	/**
	 * 
	 * @return True if the cookie is a session cookie, as opposed to a
	 *         persistent cookie with an expiration date.
	 */
	public final native boolean isSession()/*-{
		return !!(this.session);
	}-*/;

	/**
	 * 
	 * @return The ID of the cookie store containing this cookie, as provided in
	 *         getAllCookieStores().
	 */
	public final native String getStoreId()/*-{
		return this.storeId;
	}-*/;

	/**
	 * 
	 * @return The value of the cookie.
	 */
	public final native String getValue()/*-{
		return this.value;
	}-*/;
}
