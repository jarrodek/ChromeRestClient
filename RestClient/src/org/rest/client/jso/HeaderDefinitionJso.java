package org.rest.client.jso;

import com.google.gwt.core.client.JavaScriptObject;

public class HeaderDefinitionJso extends JavaScriptObject {
	protected HeaderDefinitionJso(){}
	/**
	 * 
	 * @return Header name, e.g. "Accept-Ranges"
	 */
	public final native String getKey() /*-{ return this.key; }-*/;
	/**
	 * 
	 * @return Header description e.g. "What partial content range types this server supports"
	 */
	public final native String getDesc() /*-{ return this.desc; }-*/;
	/**
	 * 
	 * @return Header example usage e.g. "Accept-Ranges: bytes"
	 */
	public final native String getExample() /*-{ return this.example; }-*/;
}
