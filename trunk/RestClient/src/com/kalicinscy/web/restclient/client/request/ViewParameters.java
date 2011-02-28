package com.kalicinscy.web.restclient.client.request;

import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONValue;
import com.kalicinscy.web.restclient.client.storage.LocalStorage;

public class ViewParameters {
	/**
	 * Store data to local storage.
	 */
	public void store() {
		JSONObject data = new JSONObject();
		JSONNumber headersTab = new JSONNumber( this.headersOpenedTab );
		JSONNumber dataTab = new JSONNumber( this.dataOpenedTab );
		data.put("headersTab", headersTab);
		data.put("dataTab", dataTab);
		LocalStorage.setValue("viewParams", data.toString());
	}
	/**
	 * Restore data from local storage
	 */
	public void restore() {
		String data = LocalStorage.getValue("viewParams");
		if(data == null) {
			return;
		}
		JSONValue value = JSONParser.parseLenient(data);
		JSONObject obj = value.isObject();
		if(obj==null) {
			return;
		}
		JSONNumber headersTabJS = null;
		JSONNumber dataTabJS = null;
		try{
			headersTabJS = obj.get("headersTab").isNumber();
			dataTabJS = obj.get("dataTab").isNumber();
			this.headersOpenedTab = (int) headersTabJS.doubleValue();
			this.dataOpenedTab = (int) dataTabJS.doubleValue();
		}catch(NullPointerException e){}
	}
	
	//private fields
	/**
	 * Opened tab in HEADERS form field.
	 */
	private int headersOpenedTab = 0;
	/**
	 * Opened tab in Data form field.
	 */
	private int dataOpenedTab = 0;
	/**
	 * Sets opened tab in HEADERS form field.
	 * It's can be 0 - for raw data input or 1 for form inputs.
	 * @param opened Tab number 
	 */
	public void setHeadersOpenedTab(int opened, boolean storeData){
		this.headersOpenedTab = opened;
		if( storeData ) {
			this.store();
		}
	}
	/**
	 * Sets opened tab in DATA form field.
	 * It's can be 0 - for raw data input, 1 for form inputs, 2 for file field.
	 * @param opened Tab number 
	 */
	public void setDataOpenedTab(int opened, boolean storeData){
		this.dataOpenedTab = opened;
		if( storeData ) {
			this.store();
		}
	}
	/**
	 * Gets current opened headers tab.
	 * @return Opened tab.
	 */
	public int getHeadersOpenedTab(){
		return this.headersOpenedTab;
	}
	/**
	 * Gets current opened data tab.
	 * @return Opened tab.
	 */
	public int getDataOpenedTab(){
		return this.dataOpenedTab;
	}
}
