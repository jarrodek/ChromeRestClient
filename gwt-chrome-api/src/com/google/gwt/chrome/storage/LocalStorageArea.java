package com.google.gwt.chrome.storage;

import com.google.gwt.chrome.def.SimpleJSObject;
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
	
	
	protected LocalStorageArea(){}
	
	/**
	 * The maximum amount (in bytes) of data that can be stored in local
	 * storage, as measured by the JSON stringification of every value plus
	 * every key's length. This value will be ignored if the extension has the
	 * unlimitedStorage permission. Updates that would cause this limit to be
	 * exceeded fail immediately and set chrome.runtime.lastError.
	 * 
	 * @return Quota for data size.
	 */
	public final native int getQuotaBytes() /*-{
		return $wnd.chrome.storage.local.QUOTA_BYTES;
	}-*/;

	@Override
	public void getBytesInUse(String key, StorageUseCallback callback) {
		getBytesInUse(new String[]{key}, callback);
	}

	@Override
	public final native void getBytesInUse(String[] keys, StorageUseCallback callback) /*-{
		$wnd.chrome.storage.local.getBytesInUse(keys, $entry(function(bytesInUse){
			if(!bytesInUse && bytesInUse != 0){
				callback.@com.google.gwt.chrome.storage.StorageArea.StorageUseCallback::onError(Ljava/lang/String;)(chrome.runtime.lastError);
				return;
			}
			callback.@com.google.gwt.chrome.storage.StorageArea.StorageUseCallback::onCalculate(D)(bytesInUse);
		}));
	}-*/;

	@Override
	public final native void clear(StorageSimpleCallback callback) /*-{
		$wnd.chrome.storage.local.clear($entry(function(){
			callback.@com.google.gwt.chrome.storage.StorageArea.StorageSimpleCallback::onDone()();
		}));
	}-*/;

	@Override
	public final native void set(JavaScriptObject data, StorageSimpleCallback callback) /*-{
		$wnd.chrome.storage.local.set(data, $entry(function(){
			callback.@com.google.gwt.chrome.storage.StorageArea.StorageSimpleCallback::onDone()();
		}));
	}-*/;

	@Override
	public void remove(String key, StorageSimpleCallback callback) {
		remove(new String[]{key}, callback);
	}

	@Override
	public final native void remove(String[] keys, StorageSimpleCallback callback) /*-{
		$wnd.chrome.storage.local.remove(data, $entry(function(){
			callback.@com.google.gwt.chrome.storage.StorageArea.StorageSimpleCallback::onDone()();
		}));
	}-*/;

	@Override
	public void get(final String key, final StorageItemCallback callback) {
		JSONObject obj = new JSONObject();
		obj.put(key, null);
		get(obj.getJavaScriptObject(), new StorageItemsCallback() {
			@Override
			public void onResult(JavaScriptObject data) {
				if(data == null){
					callback.onResult(null);
					return;
				}
				SimpleJSObject obj = data.cast();
				String[] keys = obj.getKeys();
				for(String _key : keys){
					if(_key.equals(key)){
						callback.onResult(obj.getString(_key));
						return;
					}
				}
				callback.onResult(null);
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
	public final native void get(JavaScriptObject keysWithDefaults,
			StorageItemsCallback callback) /*-{
		$wnd.chrome.storage.local.get(keysWithDefaults, $entry(function(items){
			if(!items){
				callback.@com.google.gwt.chrome.storage.StorageArea.StorageItemsCallback::onError(Ljava/lang/String;)(chrome.runtime.lastError);
				return;
			}
			callback.@com.google.gwt.chrome.storage.StorageArea.StorageItemsCallback::onResult(Lcom/google/gwt/core/client/JavaScriptObject;)(items);
		}));
	}-*/;

	@Override
	public final native void get(final StorageItemsCallback callback) /*-{
		$wnd.chrome.storage.local.get(null, $entry(function(items){
			if(!chrome.runtime.lastError){
				callback.@com.google.gwt.chrome.storage.StorageArea.StorageItemsCallback::onError(Ljava/lang/String;)(chrome.runtime.lastError);
				return;
			}
			callback.@com.google.gwt.chrome.storage.StorageArea.StorageItemsCallback::onResult(Lcom/google/gwt/core/client/JavaScriptObject;)(items);
		}));
	}-*/;
}
