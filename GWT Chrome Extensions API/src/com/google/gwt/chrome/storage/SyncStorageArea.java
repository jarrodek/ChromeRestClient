package com.google.gwt.chrome.storage;

import com.google.gwt.chrome.def.SimpleJSObject;
import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;

/**
 * Items under the "sync" storage area are synced using Chrome Sync.
 * 
 * @author jarrod
 * 
 */
public class SyncStorageArea implements StorageArea {
	/**
	 * The maximum number of items that can be stored in sync storage.
	 * <p>
	 * Updates that would cause this limit to be exceeded will fail immediately
	 * and set chrome.runtime.lastError.
	 * </p>
	 * <p>
	 * Value: 512
	 * </p>
	 */
	public static final int MAX_ITEMS = 512;
	/**
	 * The maximum number of set, remove, or clear operations that can be
	 * performed each minute, sustained over 10 minutes.
	 * <p>
	 * Updates that would cause this limit to be exceeded fail immediately and
	 * set chrome.runtime.lastError.
	 * </p>
	 * <p>
	 * Value: 10
	 * </p>
	 */
	public static final int MAX_SUSTAINED_WRITE_OPERATIONS_PER_MINUTE = 10;
	/**
	 * The maximum number of set, remove, or clear operations that can be
	 * performed each hour.
	 * <p>
	 * Updates that would cause this limit to be exceeded fail immediately and
	 * set chrome.runtime.lastError.
	 * </p>
	 * <p>
	 * Value: 1,000
	 * </p>
	 */
	public static final int MAX_WRITE_OPERATIONS_PER_HOUR = 1000;
	/**
	 * The maximum total amount (in bytes) of data that can be stored in sync
	 * storage, as measured by the JSON stringification of every value plus
	 * every key's length.
	 * <p>
	 * Updates that would cause this limit to be exceeded fail immediately and
	 * set chrome.runtime.lastError.
	 * </p>
	 * <p>
	 * Value: 102,400 B
	 * </p>
	 */
	public static final int QUOTA_BYTES = 102400;
	/**
	 * The maximum size (in bytes) of each individual item in sync storage, as
	 * measured by the JSON stringification of its value plus its key length.
	 * <p>
	 * Updates containing items larger than this limit will fail immediately and
	 * set chrome.runtime.lastError.
	 * </p>
	 * <p>
	 * Value: 4,096 B
	 * </p>
	 */
	public static final int QUOTA_BYTES_PER_ITEM = 4096;
	
	final StorageAreaImpl impl;
	protected SyncStorageArea(boolean isAvailable){
		if(isAvailable){
			impl = GWT.create(SyncStorageAreaImpl.class);
		} else {
			impl = GWT.create(SyncStorageAreaWebImpl.class);
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
