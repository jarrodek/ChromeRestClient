package org.rest.client.jso;

import com.google.gwt.core.client.JavaScriptObject;
/**
 * To read response redirect data from the background page.
 * @author Pawel Psztyc
 *
 */
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
