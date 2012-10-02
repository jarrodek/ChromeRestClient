package com.google.gwt.chrome.storage;

import com.google.gwt.chrome.message.BackgroundMessage;
import com.google.gwt.chrome.storage.StorageArea.StorageItemsCallback;
import com.google.gwt.chrome.storage.StorageArea.StorageSimpleCallback;
import com.google.gwt.chrome.storage.StorageArea.StorageUseCallback;
import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;

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
		messagePassing.postMessage("storage.sync.getBytesInUse", "", new Callback<String, Throwable>() {
			@Override
			public void onSuccess(String result) {
				int _result = -1;
				try{
					_result = Integer.parseInt(result); 
				} catch(Exception e){
					callback.onError(e.getMessage());
				}
				callback.onCalculate(_result);
			}
			
			@Override
			public void onFailure(Throwable reason) {
				callback.onError(reason.getMessage());
			}
		});
	}

	@Override
	public void clear(final StorageSimpleCallback callback) {
		messagePassing.postMessage("storage.sync.clear", "", new Callback<String, Throwable>() {
			@Override
			public void onSuccess(String result) {
				callback.onDone();
			}
			
			@Override
			public void onFailure(Throwable reason) {
				callback.onDone();
			}
		});
	}

	@Override
	public void set(JavaScriptObject data, final StorageSimpleCallback callback) {
		JSONObject obj = new JSONObject(data);
		messagePassing.postMessage("storage.sync.set", obj.toString(), new Callback<String, Throwable>() {
			@Override
			public void onSuccess(String result) {
				callback.onDone();
			}
			
			@Override
			public void onFailure(Throwable reason) {
				callback.onDone();
			}
		});
	}

	@Override
	public void remove(String[] keys, final StorageSimpleCallback callback) {
		messagePassing.postMessage("storage.sync.remove", "", new Callback<String, Throwable>() {
			@Override
			public void onSuccess(String result) {
				callback.onDone();
			}
			
			@Override
			public void onFailure(Throwable reason) {
				callback.onDone();
			}
		});
	}

	@Override
	public void get(JavaScriptObject keysWithDefaults,
			final StorageItemsCallback callback) {
		JSONObject obj = new JSONObject(keysWithDefaults);
		messagePassing.postMessage("storage.sync.get", obj.toString(), new Callback<String, Throwable>() {
			@Override
			public void onSuccess(String result) {
				callback.onResult(JSONParser.parseStrict(result).isObject());
			}
			
			@Override
			public void onFailure(Throwable reason) {
				callback.onError(reason.getMessage());
			}
		});
	}
	
	

}
