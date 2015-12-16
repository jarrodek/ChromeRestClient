package org.rest.client.util;

import org.rest.client.storage.store.StoreKeys;

import com.google.gwt.chrome.storage.Storage;
import com.google.gwt.chrome.storage.StorageArea.StorageItemCallback;
import com.google.gwt.chrome.storage.StorageArea.StorageSimpleCallback;
import com.google.gwt.chrome.storage.StorageResult;
import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.JsArrayString;
import com.google.gwt.core.shared.GWT;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;

public class JSONHeadersUtils {
	
	/**
	 * 
	 * @return saved in local storage headers values for JSON response
	 */
	public static void getJSONHeadersList(final Callback<String[], Throwable> callback){
		Storage store = GWT.create(Storage.class);
		store.getLocal().get(StoreKeys.JSON_HEADERS_KEY, new StorageItemCallback<JsArrayString>() {
		
			@Override
			public void onResult(StorageResult<JsArrayString> data){
				if(data == null){
					callback.onFailure(new Throwable("Unable to get JSON headers list from local store"));
					return;
				}
				JsArrayString arr = data.get(StoreKeys.JSON_HEADERS_KEY);
				if(arr == null){
					callback.onFailure(new Throwable("Unable to get JSON headers list from local store. Result is null."));
					return;
				}
				String[] res = new String[arr.length()];
				for(int i=0; i<arr.length(); i++){
					res[i] = arr.get(i);
				}
				callback.onSuccess(res);
			}
			@Override
			public void onError(String message){
				callback.onFailure(new Throwable("Unable to get JSON headers list from local store. Storage seems to be unabailable: " + message));
			}
		});
	}
	
	
	public static void store(String[] newArray, final Callback<Boolean, Throwable> callback) {
		final JSONArray data = new JSONArray();
		for(String header : newArray){
			if(header == null){
				continue;
			}
			JSONString headerValue = new JSONString(header);
			data.set(data.size(), headerValue);
		}
		Storage store = GWT.create(Storage.class);
		JSONObject jso = new JSONObject();
		jso.put(StoreKeys.JSON_HEADERS_KEY, data);
		store.getLocal().set(jso.getJavaScriptObject(), new StorageSimpleCallback(){

			@Override
			public void onDone() {
				callback.onSuccess(true);
			}

			@Override
			public void onError(String message) {
				callback.onFailure(new Throwable(message));
			}
		});
	}
}
