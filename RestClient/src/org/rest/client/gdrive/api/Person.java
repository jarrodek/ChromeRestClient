package org.rest.client.gdrive.api;

import com.google.gwt.core.client.JavaScriptObject;

public class Person extends JavaScriptObject{
	protected Person(){}
	
	
	
	public final native String getName() /*-{ return this.name.$t; }-*/;
	public final native String getEmail() /*-{ return this.email.$t; }-*/;
	
}
