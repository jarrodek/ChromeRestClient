package com.google.gwt.chrome.storage;


import com.google.gwt.chrome.storage.StorageArea.StorageItemsCallback;
import com.google.gwt.chrome.storage.StorageArea.StorageSimpleCallback;
import com.google.gwt.chrome.storage.StorageArea.StorageUseCallback;
import com.google.gwt.core.client.JavaScriptObject;

/**
 * Items under the "sync" storage area are synced using Chrome Sync.
 * Native implementation.
 * @author jarrod
 * 
 */
public class SyncStorageAreaImpl implements StorageAreaImpl {
	
	private SyncStorageAreaImpl(){}
	
	@Override
	public final native void getBytesInUse(String[] keys, StorageUseCallback callback) /*-{
		chrome.storage.sync.getBytesInUse(keys, $entry(function(bytesInUse){
			if(!bytesInUse && bytesInUse != 0){
				callback.@com.google.gwt.chrome.storage.StorageArea.StorageUseCallback::onError(Ljava/lang/String;)(chrome.runtime.lastError);
				return;
			}
			callback.@com.google.gwt.chrome.storage.StorageArea.StorageUseCallback::onCalculate(D)(bytesInUse);
		}));
	}-*/;

	@Override
	public final native void clear(StorageSimpleCallback callback) /*-{
		chrome.storage.sync.clear($entry(function(){
			callback.@com.google.gwt.chrome.storage.StorageArea.StorageSimpleCallback::onDone()();
		}));
	}-*/;
	
	@Override
	public final native void set(JavaScriptObject data, StorageSimpleCallback callback) /*-{
		chrome.storage.sync.set(data, $entry(function(){
			callback.@com.google.gwt.chrome.storage.StorageArea.StorageSimpleCallback::onDone()();
		}));
	}-*/;
	
	@Override
	public final native void remove(String[] keys, StorageSimpleCallback callback) /*-{
		chrome.storage.sync.remove(data, $entry(function(){
			callback.@com.google.gwt.chrome.storage.StorageArea.StorageSimpleCallback::onDone()();
		}));
	}-*/;
	
	@Override
	public final native void get(JavaScriptObject keysWithDefaults,
			StorageItemsCallback callback) /*-{
		chrome.storage.sync.get(keysWithDefaults, $entry(function(items){
			if(!items){
				callback.@com.google.gwt.chrome.storage.StorageArea.StorageItemsCallback::onError(Ljava/lang/String;)(chrome.runtime.lastError);
				return;
			}
			callback.@com.google.gwt.chrome.storage.StorageArea.StorageItemsCallback::onResult(Lcom/google/gwt/json/client/JSONObject;)(items);
		}));
	}-*/;

}
