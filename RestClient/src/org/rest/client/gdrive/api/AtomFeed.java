package org.rest.client.gdrive.api;

import com.google.gwt.core.client.JavaScriptObject;

public class AtomFeed extends JavaScriptObject{
	protected AtomFeed(){}
	
	
	public final native String getVersion() /*-{ return this.version; }-*/;
	public final native String getEncoding() /*-{ return this.encoding; }-*/;
	public final native Feed getFeed() /*-{ return this.feed; }-*/;
}
