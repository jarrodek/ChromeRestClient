package org.rest.client.gdrive.api;

import com.google.gwt.core.client.JavaScriptObject;

public class DriveObject extends JavaScriptObject {
	protected DriveObject(){}
	/**
	 * The type of file. This is always drive#file for file.
	 * @return type or NULL if excluded from response
	 */
	public final native String getKind() /*-{ return this.kind || null; }-*/;
}
