package com.restclient.client.storage;

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
	public final String getLabel() {
		return this._getLabel();
	}

	/**
	 * Native getLabel.
	 * 
	 * @return label string
	 */
	private native String _getLabel()/*-{
		return this.label;
	}-*/;

	/**
	 * @return database ID
	 */
	public final int getId() {
		return this._getId();
	}

	private native int _getId()/*-{
		return this.ID;
	}-*/;

	/**
	 * @return "code" column value 
	 */
	public final int getCode() {
		return this._getCode();
	}

	private native int _getCode()/*-{
		return this.code;
	}-*/;

	/**
	 * @return "desc" column value
	 */
	public final String getDesc() {
		return this._getDesc();
	}

	private native String _getDesc()/*-{
		return this.desc;
	}-*/;

}
