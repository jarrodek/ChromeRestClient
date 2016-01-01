package com.google.gwt.chrome.storage;

import com.google.gwt.core.client.JavaScriptObject;

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
		$wnd.chrome.storage.local.remove(keys, $entry(function(){
			callback.@com.google.gwt.chrome.storage.StorageArea.StorageSimpleCallback::onDone()();
		}));
	}-*/;

	@Override
	public final native void get(JavaScriptObject keysWithDefaults,
			StorageItemsCallback callback) /*-{
		$wnd.chrome.storage.local.get(keysWithDefaults, $entry(function(items){
			if(!items){
				console.warn('$wnd.chrome.storage.local.get resulted with no values where some values should be available.', chrome.runtime.lastError);
				callback.@com.google.gwt.chrome.storage.StorageArea.StorageItemsCallback::onError(Ljava/lang/String;)(chrome.runtime.lastError);
				return;
			}
			callback.@com.google.gwt.chrome.storage.StorageArea.StorageItemsCallback::onResult(Lcom/google/gwt/core/client/JavaScriptObject;)(items);
		}));
	}-*/;

	@Override
	public final native void get(final StorageItemsCallback callback) /*-{
		$wnd.chrome.storage.local.get(null, $entry(function(items){
			if(chrome.runtime.lastError){
				callback.@com.google.gwt.chrome.storage.StorageArea.StorageItemsCallback::onError(Ljava/lang/String;)(chrome.runtime.lastError);
				return;
			}
			callback.@com.google.gwt.chrome.storage.StorageArea.StorageItemsCallback::onResult(Lcom/google/gwt/core/client/JavaScriptObject;)(items);
		}));
	}-*/;
}
