package com.kalicinscy.web.restclient.client;


import com.google.gwt.core.client.JavaScriptObject;

public class NodeAttribute extends JavaScriptObject {
	
	protected NodeAttribute() {}
	
	public final native String getName() /*-{
		return this.name;
	}-*/;
	public final native String getValue() /*-{
		return this.value;
	}-*/;
}
