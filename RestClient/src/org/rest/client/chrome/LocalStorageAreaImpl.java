package org.rest.client.chrome;

import org.rest.client.chrome.StorageArea.StorageItemsCallback;
import org.rest.client.chrome.StorageArea.StorageSimpleCallback;
import org.rest.client.chrome.StorageArea.StorageUseCallback;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * Items under the "sync" storage area are synced using Chrome Sync.
 * Native implementation.
 * @author jarrod
 * 
 */
public class LocalStorageAreaImpl {
	
	private LocalStorageAreaImpl(){}
	
	public final native void getBytesInUse(String[] keys, StorageUseCallback callback) /*-{
		chrome.storage.local.getBytesInUse(keys, $entry(function(bytesInUse){
			if(!bytesInUse && bytesInUse != 0){
				callback.@org.rest.client.chrome.StorageArea.StorageUseCallback::onError(Ljava/lang/String;)(chrome.runtime.lastError);
				return;
			}
			callback.@org.rest.client.chrome.StorageArea.StorageUseCallback::onCalculate(D)(bytesInUse);
		}));
	}-*/;

	
	public final native void clear(StorageSimpleCallback callback) /*-{
		chrome.storage.local.clear($entry(function(){
			callback.@org.rest.client.chrome.StorageArea.StorageSimpleCallback::onDone()();
		}));
	}-*/;

	public final native void set(JavaScriptObject data, StorageSimpleCallback callback) /*-{
		chrome.storage.local.set(data, $entry(function(){
			callback.@org.rest.client.chrome.StorageArea.StorageSimpleCallback::onDone()();
		}));
	}-*/;

	public final native void remove(String[] keys, StorageSimpleCallback callback) /*-{
		chrome.storage.local.remove(data, $entry(function(){
			callback.@org.rest.client.chrome.StorageArea.StorageSimpleCallback::onDone()();
		}));
	}-*/;
	
	
	public final native void get(JavaScriptObject keysWithDefaults,
			StorageItemsCallback callback) /*-{
		chrome.storage.local.get(keysWithDefaults, $entry(function(items){
			if(!items){
				callback.@org.rest.client.chrome.StorageArea.StorageItemsCallback::onError(Ljava/lang/String;)(chrome.runtime.lastError);
				return;
			}
			callback.@org.rest.client.chrome.StorageArea.StorageItemsCallback::onResult(Lcom/google/gwt/json/client/JSONObject;)(items);
		}));
	}-*/;

}
