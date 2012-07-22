package org.rest.client.storage.websql;

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

	public static final native ExportedDataItem create() /*-{
		return {
			reference_id : -1,
			type : null,
			gaeKey : null
		};
	}-*/;

	public final native void setReferenceId(int reference_id) /*-{
		this.reference_id = reference_id;
	}-*/;

	public final native void setType(String type) /*-{
		this.type = type;
	}-*/;

	public final native void setAppEngineKey(String gaeKey) /*-{
		this.gaeKey = gaeKey;
	}-*/;

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

	public final native String getAppEngineKey() /*-{
		return this.gaeKey;
	}-*/;
}
