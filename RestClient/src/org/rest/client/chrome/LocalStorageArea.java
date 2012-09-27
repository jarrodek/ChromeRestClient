package org.rest.client.chrome;

import java.util.Iterator;

import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.json.client.JSONValue;

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
	
	LocalStorageAreaImpl impl = GWT.create(LocalStorageAreaImpl.class);
	
	protected LocalStorageArea(){}

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
	public void get(String key, final StorageItemCallback callback) {
		JSONObject obj = new JSONObject();
		obj.put(key, new JSONString(""));
		get(obj.getJavaScriptObject(), new StorageItemsCallback() {
			
			@Override
			public void onResult(JSONObject data) {
				Iterator<String> it = data.keySet().iterator();
				if(!it.hasNext()){
					callback.onResult("");
					return;
				}
				String key = it.next();
				JSONValue valueObject = data.get(key);
				if(valueObject == null){
					callback.onResult("");
					return;
				}
				callback.onResult(valueObject.isString().stringValue());
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
