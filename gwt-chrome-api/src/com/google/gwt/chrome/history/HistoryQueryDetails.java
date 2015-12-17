package com.google.gwt.chrome.history;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * Create an object to be used with {@link History#getVisits()),
 * {@link History#addUrl()) or {@link History#deleteUrl())
 * 
 * To create an instance of this object use {@link HistoryQueryDetails#create()} function.
 * @author Pawel Psztyc
 *
 */
public class HistoryQueryDetails extends JavaScriptObject {
	protected HistoryQueryDetails() {
	}
	/**
	 * Create an instance of an overlay JS object.
	 * This is only method to create an instance of this object.
	 * @return Instance of this object
	 */
	public static final native HistoryQueryDetails create() /*-{
		return {};
	}-*/; 
	/**
	 * 
	 * @param url
	 *            The URL for which to retrieve visit information or add or to
	 *            remove. It must be in the format as returned from a call to
	 *            history.search.
	 */
	public final native void setUrl(String url) /*-{
		this.url = url;
	}-*/;

	public final native String getUrl() /*-{ return this.url; }-*/;
}
