package com.google.gwt.chrome.history;

import com.google.gwt.core.client.JavaScriptObject;
/**
 * Query details obiect for the chrome.history API.
 * To create an instance of this object use {@link Query#create()} function.
 * @author Pawel Psztyc
 *
 */
public class Query extends JavaScriptObject {
	protected Query() {
	}
	/**
	 * Create an instance of an overlay JS object.
	 * This is only method to create an instance of this object.
	 * @return Instance of this object
	 */
	public static final native Query create(String query) /*-{
		return {text: query};
	}-*/;

	/**
	 * A free-text query to the history service. Leave empty to retrieve all
	 * pages.
	 * 
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
	 * 
	 * @param maxResults
	 */
	public final native void setMaxResults(int maxResults) /*-{
		this.maxResults = maxResults;
	}-*/;

	public final native int getMaxResults() /*-{
		return this.maxResults;
	}-*/;

	public final native Double getStartTime() /*-{
		return this.startTime;
	}-*/;

	/**
	 * Limit results to those visited after this date, represented in
	 * milliseconds since the epoch. If not specified, this defaults to 24 hours
	 * in the past.
	 * 
	 * @param startTime
	 */
	public final native void getStartTime(double startTime) /*-{
		this.startTime = startTime;
	}-*/;

	public final native Double getEndTime() /*-{
		return this.endTime;
	}-*/;

	/**
	 * Limit results to those visited before this date, represented in
	 * milliseconds since the epoch.
	 * 
	 * @param startTime
	 */
	public final native void getEndTime(double endTime) /*-{
		this.endTime = endTime;
	}-*/;

	public final native String toJSON() /*-{
		var tmp = {
			text : this.text
		};
		if (this.maxResults) {
			tmp.maxResults = this.maxResults;
		}
		if (this.endTime) {
			tmp.endTime = this.endTime;
		}
		if (this.startTime) {
			tmp.startTime = this.startTime;
		}
		return JSON.stringify(tmp);
	}-*/;
}
