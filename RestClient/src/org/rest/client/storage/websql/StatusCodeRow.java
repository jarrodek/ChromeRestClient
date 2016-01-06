package org.rest.client.storage.websql;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * Class representing single row of Status Codes database table.
 * 
 * @author jarrod
 * 
 */
public class StatusCodeRow extends JavaScriptObject {
	/**
	 * Empty.
	 */
	protected StatusCodeRow() {
	}
	
	/**
	 * Return label field.
	 * 
	 * @return label string
	 */
	public final native String getLabel()/*-{
		return this.label;
	}-*/;

	/**
	 * 
	 * @return database ID
	 */
	public final native int getId()/*-{
		return this.ID;
	}-*/;

	/**
	 * 
	 * @return "code" column value
	 */
	public final native int getCode()/*-{
		return this.code;
	}-*/;

	/**
	 * 
	 * @return "desc" column value
	 */
	public final native String getDesc()/*-{
		return this.desc;
	}-*/;

}
