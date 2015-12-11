package com.google.gwt.chrome.storage;

import com.google.gwt.chrome.def.BackgroundJsCallback;
import com.google.gwt.chrome.def.BackgroundPageCallback;
import com.google.gwt.chrome.message.BackgroundMessage;
import com.google.gwt.chrome.storage.StorageArea.StorageItemsCallback;
import com.google.gwt.chrome.storage.StorageArea.StorageSimpleCallback;
import com.google.gwt.chrome.storage.StorageArea.StorageUseCallback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONString;

/**
 * Implementation of local storage for web applications (not extensions).
 * @author Paweł Psztyć
 * 
 */
public class LocalStorageAreaWebImpl implements StorageAreaImpl {
	BackgroundMessage chromeMessagePassing = GWT.create(BackgroundMessage.class);
	
	private LocalStorageAreaWebImpl(){}
	/**
	 * This method is not available for web applications. 
	 * @param keys
	 * @param callback Immediately return 0 
	 */
	@Override
	public final void getBytesInUse(String[] keys, final StorageUseCallback callback) {
		JSONArray ja = null;
		if(keys != null){
			ja = new JSONArray();
			for(String key : keys){
				ja.set(ja.size(), new JSONString(key));
			}
		}
		
		chromeMessagePassing.postMessage("storage.local.getBytesInUse", ja == null ? null : ja.getJavaScriptObject(), new BackgroundJsCallback() {
			
			@Override
			public void onSuccess(JavaScriptObject message) {
				Double d = null;
				String s = message.toString();
				try{
					d = Double.parseDouble(s);
				} catch(Exception e){}
				double result = d == null ? 0 : d;
				callback.onCalculate(result);
			}
			
			@Override
			public void onError(String message) {
				callback.onError(message);
			}
			
		});
	};

	@Override
	public final void clear(final StorageSimpleCallback callback) {
		chromeMessagePassing.postMessage("storage.local.clear", null, new BackgroundPageCallback() {
			@Override
			public void onSuccess(String message) {
				callback.onDone();
			}
			
			@Override
			public void onError(String message) {
				callback.onError(message);
			}
		});
	};
	@Override
	public final void set(JavaScriptObject data, final StorageSimpleCallback callback) {
		chromeMessagePassing.postMessage("storage.local.set", data, new BackgroundJsCallback() {
			@Override
			public void onSuccess(JavaScriptObject message) {
				callback.onDone();
			}
			
			@Override
			public void onError(String message) {
				callback.onError(message);
			}
		});
	}
	
	@Override
	public final void remove(String[] keys, final StorageSimpleCallback callback) {
		JSONArray o = new JSONArray();
		for(String key : keys){
			o.set(o.size(), new JSONString(key));
		}
		chromeMessagePassing.postMessage("storage.local.remove", o.getJavaScriptObject(), new BackgroundJsCallback() {
			@Override
			public void onSuccess(JavaScriptObject message) {
				callback.onDone();
			}
			
			@Override
			public void onError(String message) {
				callback.onError(message);
			}
		});
	};
	
	@Override
	public final void get(JavaScriptObject keysWithDefaults,
			final StorageItemsCallback callback){
		
		chromeMessagePassing.postMessage("storage.local.get", keysWithDefaults, new BackgroundJsCallback() {
			@Override
			public void onSuccess(JavaScriptObject message) {
				callback.onResult(message);
			}
			
			@Override
			public void onError(String message) {
				callback.onError(message);
			}
		});
	}
}
