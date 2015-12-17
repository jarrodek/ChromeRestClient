package com.google.gwt.chrome.cookie;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArrayInteger;

/**
 * Represents a cookie store in the browser. An incognito mode window, for
 * instance, uses a separate cookie store from a non-incognito window.
 * 
 * @author Pawel Psztyc
 *
 */
public final class CookieStore extends JavaScriptObject {
	protected CookieStore(){}
	/**
	 * 
	 * @return The unique identifier for the cookie store.
	 */
	public final native String getId() /*-{
		return this.id;
	}-*/;

	/**
	 * @return Identifiers of all the browser tabs that share this cookie store.
	 */
	public final native JsArrayInteger getTabIds() /*-{
		return this.tabIds;
	}-*/;

}
