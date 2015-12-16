package com.google.gwt.chrome.history;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArrayString;

public class HistoryRemoved extends JavaScriptObject {
	protected HistoryRemoved(){}
	
	/**
	 * True if all history was removed. If true, then {@link #getUrls()} will be empty.
	 * @return
	 */
	public final native boolean isAllHistory() /*-{ return this.allHistory; }-*/;
	/**
	 * 
	 * @return
	 */
	public final native JsArrayString getUrls() /*-{ return this.urls; }-*/;
}
