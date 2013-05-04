package org.rest.client.codemirror;

import com.google.gwt.core.client.JavaScriptObject;

public class CodeMirrorKeyMap extends JavaScriptObject {
	
	protected CodeMirrorKeyMap(){}
	
	public static final native CodeMirrorKeyMap create() /*-{
		return {};
	}-*/;
	
	/**
	 * @param value
	 *            The starting value of the editor.
	 */
	public final native void add(String code, String functionName) /*-{
		this[code] = functionName;
	}-*/;
}
