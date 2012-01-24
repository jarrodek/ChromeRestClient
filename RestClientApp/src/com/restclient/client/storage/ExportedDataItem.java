package com.restclient.client.storage;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * Class representing database header table row.
 * 
 * @author jarrod
 * 
 */
public class ExportedDataItem extends JavaScriptObject {
	/**
	 * Const.
	 */
	protected ExportedDataItem() {
	}

	/**
	 * Get name field.
	 * 
	 * @return
	 */
	public final native int getReferenceId()/*-{
		return this.reference_id;
	}-*/;
	
	/**
	 * Get type field.
	 * 
	 * @return
	 */
	public final native String getType()/*-{
		return this.type;
	}-*/;
}
