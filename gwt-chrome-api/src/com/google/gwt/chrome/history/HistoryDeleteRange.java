package com.google.gwt.chrome.history;

import com.google.gwt.core.client.JavaScriptObject;

public class HistoryDeleteRange extends JavaScriptObject {
	
	protected HistoryDeleteRange(){}
	
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
