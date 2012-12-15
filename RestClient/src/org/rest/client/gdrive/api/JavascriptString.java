package org.rest.client.gdrive.api;

import com.google.gwt.core.client.JavaScriptObject;

public class JavascriptString extends JavaScriptObject{
	protected JavascriptString(){}
	public final native String getStringValue() /*-{ return this; }-*/;
}
