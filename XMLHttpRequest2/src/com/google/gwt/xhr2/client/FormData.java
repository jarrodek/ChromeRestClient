package com.google.gwt.xhr2.client;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.file.client.Blob;

public class FormData extends JavaScriptObject {
	protected FormData(){}
	
	public static native FormData create()/*-{
		return new $wnd.FormData();
	}-*/;
		
	public final native void append(String name, Blob value) /*-{
		this.append(name, value);
	}-*/;
	
	public final native void append(String name, String value) /*-{
		this.append(name, value);
	}-*/;
}
