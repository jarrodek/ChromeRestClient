package org.rest.client.dom.error;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * The DOMError interface describes an error object that contains an error name.
 * @author Pawel Psztyc
 *
 */
class DOMError extends JavaScriptObject {
	protected DOMError(){}
	
	/**
	 * @return Returns a DOMString representing one of the error type names.
	 */
	public final native String getName() /*-{
		return this.length;
	}-*/;
}
