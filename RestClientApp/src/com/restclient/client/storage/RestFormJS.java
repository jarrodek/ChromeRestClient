package com.restclient.client.storage;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * Class representing single row of RestForm database table.
 * 
 * @author jarrod
 * 
 */
public class RestFormJS extends JavaScriptObject {
	/**
	 * Empty.
	 */
	protected RestFormJS() {
	}

	/**
	 * Return name field.
	 * 
	 * @return name string
	 */
	public final String getName() {
		return this._getName();
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
	 * Gets database key.
	 * 
	 * @return
	 */
	public final int getId() {
		return this._getId();
	}

	/**
	 * Insert time
	 * 
	 * @return
	 */
	public final long getTime() {
		long time = 0;
		try {
			String _time = _getTime();
			time = Long.parseLong(_time);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return time;
	}

	/**
	 * Config data as json string.
	 * 
	 * @return
	 */
	public final String getData() {
		return this._getData();
	}

	/**
	 * Native get name.
	 * 
	 * @return name field value
	 */
	private native String _getName()/*-{
		return this.name;
	}-*/;

	/**
	 * Native getUrl.
	 * 
	 * @return url field value
	 */
	private native String _getUrl()/*-{
		return this.url;
	}-*/;

	/**
	 * @return
	 */
	public final native String _getTime()/*-{
		return this.time.toString();
	}-*/;

	private native int _getId()/*-{
		return this.id;
	}-*/;

	private native String _getData()/*-{
		return this.data;
	}-*/;
}
