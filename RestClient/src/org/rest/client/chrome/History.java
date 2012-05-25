package org.rest.client.chrome;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * Access to Chrome History API.
 * 
 * @author Paweł Psztyć
 * 
 */
public class History {
	
	public static class Query extends JavaScriptObject {
		protected Query(){}
		/**
		 * Create a query object with text
		 * @param text A free-text query to the history service. Leave empty to retrieve all pages.
		 * @return
		 */
		public final native static Query create(String text)/*-{
			return {"text":text};
		}-*/;
		/**
		 * A free-text query to the history service. Leave empty to retrieve all pages.
		 * @required
		 * @param text
		 */
		public final native void setText(String query) /*-{
			this.text = query;
		}-*/;
		public final native String getText() /*-{
			return this.text;
		}-*/;
		/**
		 * The maximum number of results to retrieve. Defaults to 100.
		 * @param maxResults
		 */
		public final native void setMaxResults(int maxResults) /*-{
			this.maxResults = maxResults;
		}-*/;
		public final native int getMaxResults() /*-{
			return this.maxResults;
		}-*/;
	}
	
	/**
	 * Returns History Chrome extensions API if supported (when app is loaded as
	 * Chrome extension).
	 * 
	 * @return access to class methods or NULL if not supported.
	 */
	public static History getHistoryIfSupported() {
		if (!isSupported()){
			return null;
		}
		return new History();
	}

	/**
	 * Check if API is available.
	 * 
	 * @return true if API is available.
	 */
	private static final native boolean isSupported()/*-{
		return !!(chrome && chrome.history);
	}-*/;
	
	/**
	 * Searches the history for the last visit time of each page matching the query.
	 * @param query
	 * @param callback
	 */
	public final native void search(Query query, HistorySearchCallback callback) /*-{
		var clb = $entry(function(items) {
			callback.@org.rest.client.chrome.HistorySearchCallback::onResult(Lorg/rest/client/chrome/JsArray;)(items);
		});
		chrome.history.search(query, clb);
	}-*/;
}
