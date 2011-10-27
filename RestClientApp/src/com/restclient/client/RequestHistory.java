package com.restclient.client;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Set;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONValue;
import com.google.gwt.storage.client.Storage;
import com.restclient.client.request.RequestParameters;

/**
 * JSON object saved in local storage looks like:
 * [
 * 	PARAMETERS_DATA,
 * 	PARAMETERS_DATA2,
 * 	...
 * ]
 * 
 * @author jarrod
 *
 */
public class RequestHistory {
	
	private static final String HISTORY_LIST_STORAGE_KEY = "historyList";
	
	private static final int MAX_HISTORY_ITEMS;
	static{
		MAX_HISTORY_ITEMS = 60;
	}
	
	static List<RequestHistoryItem> items = new ArrayList<RequestHistoryItem>(MAX_HISTORY_ITEMS);
	/**
	 * History list comparator by timestamp.
	 * @author Paweł Psztyć
	 *
	 */
	static class HistoryItemsComparator implements Comparator<RequestHistoryItem>{
		@Override
		public int compare(RequestHistoryItem o1, RequestHistoryItem o2) {
			if(o1 == null) return 1;
			if(o2 == null) return -1;
			long u1 = o1.getUpdated();
			long u2 = o2.getUpdated();
			if( u1 > u2 ) return -1;
			if( u1 < u2 ) return 1;
			return 0;
		}
	}
	
	private static HistoryItemsComparator updateComparator = new HistoryItemsComparator();
	/**
	 * Check if need to restore from local storage.
	 * If need it fill items list with stored values.
	 */
	private static void checkRestore(){
		if( items.size() > 0 ){
			return;
		}
		Storage storage = Storage.getLocalStorageIfSupported();
		if( storage == null ){
			return;
		}
		String stringData = storage.getItem(HISTORY_LIST_STORAGE_KEY);
		
		if( stringData == null || stringData.isEmpty() ){
			return;
		}
		
		JSONValue value = JSONParser.parseLenient(stringData);
		if (value == null) {
			return;
		}
		JSONArray arr = value.isArray();
		if (arr == null) {
			return;
		}
		
		int len = arr.size();
		for(int i=0; i<len;i++){
			JSONValue values = arr.get(i);
			items.add( new RequestHistoryItem(values) );
		}
		if( RestApp.isDebug() ){
			Log.debug("Restored history from local storge. List has: "+items.size()+" elements.");
		}
	}
	
	
	/**
	 * Store current list in local storage.
	 */
	public static void store(){
		checkRestore();
		if( items.size() == 0 ){
			return;
		}
		Storage storage = Storage.getLocalStorageIfSupported();
		if( storage == null ){
			return;
		}
		
		JSONArray array = new JSONArray();
		for (RequestHistoryItem listItem : items){
			array.set(array.size(), listItem.toJSON());
		}
		storage.setItem(HISTORY_LIST_STORAGE_KEY, array.toString());
	}
	
	/**
	 * Add to history list current request parameters state.
	 */
	public static void addCurentParametersMap(){
		checkRestore();
		Collections.sort(items, updateComparator);
		
		
		JSONObject data = RequestParameters.toJSON();
		RequestHistoryItem item = new RequestHistoryItem(data);
		RequestHistoryItem listItem = getEqual(item);
		long time = new Date().getTime();
		if( listItem == null ){
			if( RestApp.isDebug() ){
				Log.debug("Adding new item to history.");
				Log.debug(items.size() +" : "+ MAX_HISTORY_ITEMS);
			}
			if(items.size() > MAX_HISTORY_ITEMS){
				items.remove(MAX_HISTORY_ITEMS-1); // remove oldest one
				if( RestApp.isDebug() ){
					Log.debug("Remove oldest history item.");
				}
			}
			item.setUpdated( time );
			items.add( item );
		} else {
//			Log.debug("Update existing history item (same values).");
			listItem.setUpdated( time );
		}
	}
	/**
	 * Check if history list has equal element. If has return it.
	 * Equal mean:
	 * - same headers
	 * - same URL
	 * - same request BODY
	 * - same METHOD
	 * - same encoding
	 * 
	 * @param item
	 * @return found element or null if none found.
	 */
	private static RequestHistoryItem getEqual(RequestHistoryItem item){
		for( RequestHistoryItem listItem : items ){
			if(isEqual(listItem, item)){
				return listItem;
			}
		}
		return null;
	}
	/**
	 * Check if giver source History object is equal to another history object.
	 * 
	 * Equal mean:
	 * - same headers
	 * - same URL
	 * - same request BODY
	 * - same METHOD
	 * - same encoding
	 * 
	 * 
	 * @param source item to compare to
	 * @param item checked item
	 * @return
	 */
	private static boolean isEqual(RequestHistoryItem source, RequestHistoryItem item){
//		Log.debug(source.getRequestUrl()+" : "+item.getRequestUrl());
		if(!source.getRequestUrl().equals( item.getRequestUrl() )){
			return false;
		}
//		Log.debug(source.getFormEncoding()+" : "+item.getFormEncoding());
		if(!source.getFormEncoding().equals( item.getFormEncoding() )){
			return false;
		}
//		Log.debug(source.getMethod()+" : "+item.getMethod());
		if(!source.getMethod().equals( item.getMethod() )){
			return false;
		}
//		Log.debug(source.getPostData()+" : "+item.getPostData());
		if(!source.getPostData().equals( item.getPostData() )){
			return false;
		}
		LinkedHashMap<String, String> sourceHeaders = source.getHeaders();
		LinkedHashMap<String, String> itemHeaders = item.getHeaders();
//		Log.debug(sourceHeaders.size()+" : "+itemHeaders.size());
		if( sourceHeaders.size() != itemHeaders.size() ){
			return false;
		}
		Set<String> keys = sourceHeaders.keySet();
		Iterator<String> keysIt = keys.iterator();
		while(keysIt.hasNext()){
			String key = keysIt.next();
			if(!itemHeaders.containsKey( key )){
				return false;
			}
			String headerValue = sourceHeaders.get( key );
			if( !headerValue.equals( itemHeaders.get(key) ) ){
				return false;
			}
		}
		
		return true;
	}
	
	/**
	 * Get history items from list.
	 * @param start zero-based index. 
	 * @param limit zero-based index.
	 * @return list of results. never NULL.
	 */
	public static List<RequestHistoryItem> getHistory(int start, int limit){
		checkRestore();
		Collections.sort(items, updateComparator);
		List<RequestHistoryItem> result = new ArrayList<RequestHistoryItem>();
		int listSize = items.size();
		int end = start + limit;
		if(start>listSize-1){
			if( RestApp.isDebug() ){
				Log.warn("Requested elemets out of list box. From: "+start+", to: "+end);
			}
			return result;
		}
		
		int maxIndex = Math.min( end, (listSize-1));
//		Log.debug("Max item index: "+maxIndex+", start: "+start);
		for( int i=start; i<=maxIndex; i++ ){
			result.add( items.get(i) );
		}
		
		return result;
	}
	/**
	 * Get current history size.
	 * @return Size of list od history items.
	 */
	public static int size(){
		checkRestore();
		return items.size();
	}
}
