package org.rest.client.jso;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArrayString;

public class PendingAnalytics extends JavaScriptObject {
	protected PendingAnalytics(){}
	
	public final native String getType() /*-{
		return this.type;
	}-*/;
	
	public final native JsArrayString getParams() /*-{
		return this.params;
	}-*/;
	
}
