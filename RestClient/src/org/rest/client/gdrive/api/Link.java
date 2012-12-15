package org.rest.client.gdrive.api;

import com.google.gwt.core.client.JavaScriptObject;

public class Link extends JavaScriptObject{
	protected Link(){}
	
	
	
	public final native String getRel() /*-{ return this.rel; }-*/;
	public final native String getType() /*-{ return this.type; }-*/;
	public final native String getHref() /*-{ return this.href; }-*/;
	
}
