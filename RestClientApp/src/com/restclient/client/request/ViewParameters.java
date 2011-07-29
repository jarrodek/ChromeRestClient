package com.restclient.client.request;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONValue;
import com.google.gwt.storage.client.Storage;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.Window.ClosingEvent;
import com.google.gwt.user.client.Window.ClosingHandler;
import com.restclient.client.event.BodyTabOpenEvent;
import com.restclient.client.event.HeadersTabOpenEvent;
/**
 * Holder for UI parameters.
 * Save and restore UI state from local storage.
 * @author jarrod
 */
public class ViewParameters {
	/**
	 * Store data to local storage.
	 */
	public static void store() {
		JSONObject data = new JSONObject();
		JSONNumber headersTab = new JSONNumber( headersOpenedTab );
		JSONNumber dataTab = new JSONNumber( dataOpenedTab );
		data.put("headersTab", headersTab);
		data.put("dataTab", dataTab);
		Storage store = Storage.getLocalStorageIfSupported();
		if( store != null ){
			store.setItem("viewParams", data.toString());
//			Log.debug("Saved state: "+data.toString());
		}
	}
	/**
	 * Restore data from local storage
	 */
	public static void restore() {
		Storage store = Storage.getLocalStorageIfSupported();
		if( store == null ){
			return;
		}
		String data = store.getItem("viewParams");
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
			headersOpenedTab = (int) headersTabJS.doubleValue();
			dataOpenedTab = (int) dataTabJS.doubleValue();
		}catch(NullPointerException e){}
	}
	
	//private fields
	/**
	 * Opened tab in HEADERS form field.
	 */
	private static int headersOpenedTab = 0;
	/**
	 * Opened tab in Data form field.
	 */
	private static int dataOpenedTab = 0;
	/**
	 * Reset UI controls state to default
	 */
	public static void reset(){
		headersOpenedTab = 0;
		dataOpenedTab = 0;
	}
	
	
	/**
	 * Sets opened tab in HEADERS form field.
	 * It's can be 0 - for raw data input or 1 for form inputs.
	 * @param opened Tab number 
	 */
	public static void setHeadersOpenedTab(int opened, boolean storeData){
		headersOpenedTab = opened;
		if( storeData ) {
			store();
		}
	}
	/**
	 * Sets opened tab in DATA form field.
	 * It's can be 0 - for raw data input, 1 for form inputs, 2 for file field.
	 * @param opened Tab number 
	 */
	public static void setDataOpenedTab(int opened, boolean storeData){
		dataOpenedTab = opened;
		if( storeData ) {
			store();
		}
	}
	/**
	 * Gets current opened headers tab.
	 * @return Opened tab.
	 */
	public static int getHeadersOpenedTab(){
		return headersOpenedTab;
	}
	/**
	 * Gets current opened data tab.
	 * @return Opened tab.
	 */
	public static int getDataOpenedTab(){
		return dataOpenedTab;
	}
	
	
	public static void setRestoredState(EventBus eventBus) {
		eventBus.fireEventFromSource(new BodyTabOpenEvent(dataOpenedTab), ViewParameters.class);
		eventBus.fireEventFromSource(new HeadersTabOpenEvent(headersOpenedTab), ViewParameters.class);
	}
	
	public static void observeChanges(EventBus eventBus){
		Window.addWindowClosingHandler(new ClosingHandler() {
			@Override
			public void onWindowClosing(ClosingEvent event) {
//				Log.debug("Saving UI state.");
				store();
			}
		});
		
		BodyTabOpenEvent.register(eventBus, new BodyTabOpenEvent.Handler() {
			@Override
			public void onOpen(int tabPosition, Object source) {
				if( source==null || !source.equals(ViewParameters.class) ){
//					Log.debug("Body opened tab changed");
					dataOpenedTab = tabPosition;
					store();
				}
			}
		});
		
		HeadersTabOpenEvent.register(eventBus, new HeadersTabOpenEvent.Handler() {
			@Override
			public void onOpen(int tabPosition, Object source) {
				if( source==null || !source.equals(ViewParameters.class) ){
//					Log.debug("Headers opened tab changed");
					headersOpenedTab = tabPosition;
					store();
				}
			}
		});
	}
}
