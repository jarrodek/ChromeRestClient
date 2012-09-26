package org.rest.client.deprecated;

import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.json.client.JSONValue;
import com.google.gwt.user.client.rpc.IsSerializable;

public class RestForm implements IsSerializable {

	private int id;
	private String name;
	private String url;
	private String data;
	private long time = 0;
	public String key;

	public RestForm() {
	}

	/**
	 * @return the id
	 */
	public final int getId() {
		return id;
	}

	/**
	 * @param id
	 *            the id to set
	 */
	public final void setId(int id) {
		this.id = id;
	}

	/**
	 * @return the name
	 */
	public final String getName() {
		return name;
	}

	/**
	 * @param name
	 *            the name to set
	 */
	public final void setName(String name) {
		this.name = name;
	}

	/**
	 * @return the url
	 */
	public final String getUrl() {
		return url;
	}

	/**
	 * @param url
	 *            the url to set
	 */
	public final void setUrl(String url) {
		this.url = url;
	}

	/**
	 * @return the data
	 */
	public final String getData() {
		return data;
	}

	/**
	 * @param data
	 *            the data to set
	 */
	public final void setData(String data) {
		this.data = data;
	}

	// @Override
	// public int compareTo(RestForm o) {
	// return ( o == null || o.time == 0 ) ? -1
	// : -o.name.compareTo( name );
	// }

	@Override
	public boolean equals(Object o) {
		if (o instanceof RestForm) {
			return id == ((RestForm) o).id;
		}
		return false;
	}

	/**
	 * @param time
	 *            the time to set
	 */
	public void setTime(Long time) {
		this.time = time;
	}

	/**
	 * @return the time
	 */
	public Long getTime() {
		return time;
	}
	
	public JSONObject toJSON(){
		
		JSONValue dataValue = null;
		JSONObject obj = null;
		try{
			dataValue = JSONParser.parseStrict(data);
			obj = dataValue.isObject();
		} catch(Exception e){
			return null;
		}
		if(obj == null){
			return null;
		}
		JSONObject result = new JSONObject();
		result.put("n", new JSONString(name == null ? "" : name));
		result.put("d", obj);
		return result;
	}
}
