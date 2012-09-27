package org.rest.client.chrome;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * Object mapping each key that changed to its corresponding StorageChange for that item.
 * @author jarrod
 *
 */
public class StorageChangeObject extends JavaScriptObject {
	protected StorageChangeObject(){}
	
	public final native JavaScriptObject getNewValue() /*-{
		return this.newValue;
	}-*/;
	
	public final native JavaScriptObject getOldValue() /*-{
		return this.oldValue;
	}-*/;
}
