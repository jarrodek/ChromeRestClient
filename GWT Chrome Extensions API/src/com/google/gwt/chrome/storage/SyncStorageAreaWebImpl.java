package com.google.gwt.chrome.storage;

import com.google.gwt.chrome.def.BackgroundJsCallback;
import com.google.gwt.chrome.message.BackgroundMessage;
import com.google.gwt.chrome.storage.StorageArea.StorageItemsCallback;
import com.google.gwt.chrome.storage.StorageArea.StorageSimpleCallback;
import com.google.gwt.chrome.storage.StorageArea.StorageUseCallback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONString;

/**
 * Items under the "sync" storage area are synced using Chrome Sync.
 * Native implementation.
 * @author jarrod
 * 
 */
public class SyncStorageAreaWebImpl implements StorageAreaImpl {
	
	private final BackgroundMessage messagePassing;
	
	private SyncStorageAreaWebImpl(){
		messagePassing = GWT.create(BackgroundMessage.class); 
	}
	
	@Override
	public void getBytesInUse(String[] keys, final StorageUseCallback callback) {
		messagePassing.postMessage("storage.sync.getBytesInUse", new BackgroundJsCallback() {
			
			@Override
			public void onSuccess(Object message) {
				int _result = -1;
				try{
					_result = Integer.parseInt(String.valueOf((String) message)); 
				} catch(Exception e){
					callback.onError(e.getMessage());
					return;
				}
				callback.onCalculate(_result);
			}
			
			@Override
			public void onError(String message) {
				callback.onError(message);
			}
		});
	}

	@Override
	public void clear(final StorageSimpleCallback callback) {
		messagePassing.postMessage("storage.sync.clear", new BackgroundJsCallback() {
			@Override
			public void onSuccess(Object message) {
				callback.onDone();
			}
			
			@Override
			public void onError(String message) {
				callback.onError(message);
			}
		});
	}

	@Override
	public void set(JavaScriptObject data, final StorageSimpleCallback callback) {
		messagePassing.postMessage("storage.sync.set", data, new BackgroundJsCallback() {
			@Override
			public void onSuccess(Object message) {
				callback.onDone();
			}
			
			@Override
			public void onError(String message) {
				callback.onError(message);
			}
		});
	}

	@Override
	public void remove(String[] keys, final StorageSimpleCallback callback) {
		JSONArray arr = new JSONArray();
		for(String key : keys){
			arr.set(arr.size(), new JSONString(key));
		}
		messagePassing.postMessage("storage.sync.remove", arr.getJavaScriptObject(), new BackgroundJsCallback() {
			@Override
			public void onSuccess(Object message) {
				callback.onDone();
			}
			
			@Override
			public void onError(String message) {
				callback.onError(message);
			}
		});
	}

	@Override
	public void get(JavaScriptObject keysWithDefaults,
			final StorageItemsCallback callback) {
		
		messagePassing.postMessage("storage.sync.get", keysWithDefaults, new BackgroundJsCallback() {
			@Override
			public void onSuccess(Object message) {
				callback.onResult((JavaScriptObject) message);
			}
			@Override
			public void onError(String message) {
				callback.onError(message);
			}
		});
	}

	@Override
	public void get(final StorageItemsCallback callback) {
		messagePassing.postMessage("storage.sync.get", new BackgroundJsCallback() {
			@Override
			public void onSuccess(Object message) {
				callback.onResult((JavaScriptObject) message);
			}
			@Override
			public void onError(String message) {
				callback.onError(message);
			}
		});
	}
}
