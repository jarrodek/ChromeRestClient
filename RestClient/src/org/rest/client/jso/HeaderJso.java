package org.rest.client.jso;

import com.google.gwt.core.client.JavaScriptObject;

public final class HeaderJso extends JavaScriptObject {
	protected HeaderJso(){}
	/**
	 * @return Header name
	 */
	public native String getName() /*-{ return this.name; }-*/;
	/**
	 * @return Header value
	 */
	public native String getValue() /*-{ return this.value; }-*/;
}
