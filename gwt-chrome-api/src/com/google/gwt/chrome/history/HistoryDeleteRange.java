package com.google.gwt.chrome.history;

import com.google.gwt.core.client.JavaScriptObject;
/**
 * To create an instance of this object use {@link HistoryDeleteRange#create()} function.
 * @author Pawel Psztyc
 *
 */
public class HistoryDeleteRange extends JavaScriptObject {
	
	protected HistoryDeleteRange(){}
	/**
	 * Create an instance of an overlay JS object.
	 * This is only method to create an instance of this object.
	 * @return Instance of this object
	 */
	public static final native HistoryDeleteRange create() /*-{
		return {};
	}-*/; 
	/**
	 * 
	 * @param startTime Items added to history after this date, represented in milliseconds since the epoch.
	 */
	public final native void setStartTime(double startTime) /*-{
		this.startTime = startTime;
	}-*/;
	/**
	 * 
	 * @param endTime Items added to history before this date, represented in milliseconds since the epoch.
	 */
	public final native void setEndTime(double endTime) /*-{
		this.endTime = endTime;
	}-*/;
	
}
