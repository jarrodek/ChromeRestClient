package org.rest.client.chrome;

import org.rest.client.chrome.StorageArea.StorageItemsCallback;
import org.rest.client.chrome.StorageArea.StorageSimpleCallback;
import org.rest.client.chrome.StorageArea.StorageUseCallback;

import com.google.gwt.core.client.JavaScriptObject;

public interface StorageAreaImpl {
	void getBytesInUse(String[] keys, StorageUseCallback callback);
	void clear(StorageSimpleCallback callback);
	void set(JavaScriptObject data, StorageSimpleCallback callback);
	void remove(String[] keys, StorageSimpleCallback callback);
	void get(JavaScriptObject keysWithDefaults, StorageItemsCallback callback);
}
