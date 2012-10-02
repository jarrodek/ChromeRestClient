package com.google.gwt.chrome.storage;


import com.google.gwt.chrome.storage.StorageArea.StorageItemsCallback;
import com.google.gwt.chrome.storage.StorageArea.StorageSimpleCallback;
import com.google.gwt.chrome.storage.StorageArea.StorageUseCallback;
import com.google.gwt.core.client.JavaScriptObject;

public interface StorageAreaImpl {
	void getBytesInUse(String[] keys, StorageUseCallback callback);
	void clear(StorageSimpleCallback callback);
	void set(JavaScriptObject data, StorageSimpleCallback callback);
	void remove(String[] keys, StorageSimpleCallback callback);
	void get(JavaScriptObject keysWithDefaults, StorageItemsCallback callback);
}
