package org.rest.client.storage.websql;

import java.util.Date;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.json.client.JSONValue;

/**
 * Class representing single row of RestForm database table.
 * 
 * @author jarrod
 * 
 */
public class RestForm extends JavaScriptObject {
	/**
	 * Empty.
	 */
	protected RestForm() {
	}

	public static final native RestForm create() /*-{
		return {
			name : null,
			url : null,
			data : null,
			time : Date.now()
		}
	}-*/;
	/**
	 * Sets form name.
	 * @param name
	 */
	public final native void setName(String name)/*-{
		this.name = name;
	}-*/;
	/**
	 * Sets form URL
	 * @param url
	 */
	public final native void setUrl(String url)/*-{
		this.url = url;
	}-*/;
	/**
	 * Sets form serialized data
	 * @param data
	 */
	public final native void setData(String data)/*-{
		this.data = data
	}-*/;
	

	/**
	 * Return name field.
	 * 
	 * @return name field value
	 */
	public final native String getName()/*-{
		return this.name;
	}-*/;

	/**
	 * @return URL value
	 */
	public final native String getUrl()/*-{
		return this.url;
	}-*/;

	/**
	 * @return
	 */
	public final native String _getTime()/*-{
		return this.time.toString();
	}-*/;

	/**
	 * @return database key
	 */
	public final native int getId()/*-{
		return this.id;
	}-*/;

	/**
	 * 
	 * @return Configuration data as JSON string.
	 */
	public final native String getData()/*-{
		return this.data;
	}-*/;

	/**
	 * Insert time.
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
	
	public final native void setTime(Date date) /*-{
		this.time = date.getTime();
	}-*/;

	public final JSONObject toJSON() {

		JSONValue dataValue = null;
		JSONObject obj = null;
		try {
			dataValue = JSONParser.parseLenient(getData());
			obj = dataValue.isObject();
		} catch (Exception e) {
			return null;
		}
		if (obj == null) {
			return null;
		}
		JSONObject result = new JSONObject();
		result.put("n", new JSONString(getName() == null ? "" : getName()));
		result.put("d", obj);
		return result;
	}

}
