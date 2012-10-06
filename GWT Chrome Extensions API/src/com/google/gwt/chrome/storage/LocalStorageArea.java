package com.google.gwt.chrome.storage;

import com.google.gwt.chrome.def.SimpleJSObject;
import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;

/**
 * Items under the "local" storage area are local to each machine.
 * 
 * @author jarrod
 * 
 */
public class LocalStorageArea implements StorageArea {
	/**
	 * The maximum amount (in bytes) of data that can be stored in local
	 * storage, as measured by the JSON stringification of every value plus
	 * every key's length. This value will be ignored if the extension has the
	 * unlimitedStorage permission. Updates that would cause this limit to be
	 * exceeded fail immediately and set chrome.runtime.lastError.
	 */
	public static final int QUOTA_BYTES = 5242880;
	
	final StorageAreaImpl impl;
	
	protected LocalStorageArea(boolean isAvailable){
		if(isAvailable){
			impl = GWT.create(LocalStorageAreaImpl.class);
		} else {
			impl = GWT.create(LocalStorageAreaWebImpl.class);
		}
	}

	@Override
	public void getBytesInUse(String key, StorageUseCallback callback) {
		impl.getBytesInUse(new String[]{key}, callback);
	}

	@Override
	public void getBytesInUse(String[] keys, StorageUseCallback callback) {
		impl.getBytesInUse(keys, callback);
	}

	@Override
	public void clear(StorageSimpleCallback callback) {
		impl.clear(callback);
	}

	@Override
	public void set(JavaScriptObject data, StorageSimpleCallback callback) {
		impl.set(data, callback);
	}

	@Override
	public void remove(String key, StorageSimpleCallback callback) {
		impl.remove(new String[]{key}, callback);
	}

	@Override
	public void remove(String[] keys, StorageSimpleCallback callback) {
		impl.remove(keys, callback);
	}

	@Override
	public void get(final String key, final StorageItemCallback callback) {
		JSONObject obj = new JSONObject();
		obj.put(key, new JSONString(""));
		get(obj.getJavaScriptObject(), new StorageItemsCallback() {
			
			@Override
			public void onResult(JavaScriptObject data) {
				
				
				SimpleJSObject obj = data.cast();
				String[] keys = obj.getKeys();
				for(String _key : keys){
					if(_key.equals(key)){
						callback.onResult(obj.getString(_key));
						return;
					}
				}
				callback.onResult("");
			}
			
			@Override
			public void onError(String message) {
				callback.onError(message);
			}
		});
	}

	@Override
	public void get(String[] keys, StorageItemsCallback callback) {
		JSONObject obj = new JSONObject();
		for(String key : keys){
			obj.put(key, new JSONString(""));
		}
		get(obj.getJavaScriptObject(), callback);
	}

	@Override
	public void get(JavaScriptObject keysWithDefaults,
			StorageItemsCallback callback) {
		impl.get(keysWithDefaults, callback);
	}
}
