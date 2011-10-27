package com.restclient.client.storage;

import com.google.gwt.core.client.JavaScriptException;
import com.google.gwt.core.client.JavaScriptObject;

/**
 * Class representing single row of URLs database table.
 * 
 * @author Paweł Psztyć
 * 
 */
public class UrlRow extends JavaScriptObject {
	/**
	 * Empty.
	 */
	protected UrlRow() {
	}

	/**
	 * Return url field.
	 * 
	 * @return url string
	 */
	public final String getUrl() {
		return this._getUrl();
	}

	/**
	 * @return database ID
	 */
	public final int getId() {
		return this._getId();
	}

	/**
	 * @return value for column time
	 */
	public final double getTime() {
		double time = 0;
		try {
			time = _getTime();
		} catch (JavaScriptException e) {
		}
		return time;
	}

	/**
	 * Native getUrl.
	 * 
	 * @return url string
	 */
	private native String _getUrl()/*-{
		return this.url;
	}-*/;

	/**
	 * @return
	 */
	public final native double _getTime()/*-{
		return this.time;
	}-*/;

	private native int _getId()/*-{
		return this.id;
	}-*/;
}
