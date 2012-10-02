package com.google.gwt.chrome.cookie;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * Wrapper for chrome callback object returned on cookie change.
 * chrome.cookies.onChanged.addListener(function(changeInfo) {...});
 * 
 * @author Paweł Psztyć
 * 
 */
public final class ChromeCookieChange extends JavaScriptObject {
	protected ChromeCookieChange(){}
	
	/**
	 * 
	 * @return True if a cookie was removed.
	 */
	public final native boolean isRemoved()/*-{
		return this.removed;
	}-*/;

	/**
	 * 
	 * @return Information about the cookie that was set or removed.
	 */
	public final native ChromeCookie getCookie()/*-{
		return this.cookie;
	}-*/;

	/**
	 * The underlying reason behind the cookie's change. If a cookie was
	 * inserted, or removed via an explicit call to "chrome.cookies.remove",
	 * "cause" will be "explicit". If a cookie was automatically removed due to
	 * expiry, "cause" will be "expired". If a cookie was removed due to being
	 * overwritten with an already-expired expiration date, "cause" will be set
	 * to "expired_overwrite". If a cookie was automatically removed due to
	 * garbage collection, "cause" will be "evicted". If a cookie was
	 * automatically removed due to a "set" call that overwrote it, "cause" will
	 * be "overwrite". Plan your response accordingly.
	 * 
	 * This parameter was added in version 12.0.707.0. You must omit this
	 * parameter in earlier versions, and you may omit it in any version. If you
	 * require this parameter, the manifest key minimum_chrome_version can
	 * ensure that your extension won't be run in an earlier browser version.
	 * 
	 * @return enumerated string ["evicted", "expired", "explicit",
	 *         "expired_overwrite", "overwrite"] or empty string if chrome
	 *         version is lower than 12.0.707.0
	 */
	public final native String getCause()/*-{
		return this.cause || "";
	}-*/;
}
