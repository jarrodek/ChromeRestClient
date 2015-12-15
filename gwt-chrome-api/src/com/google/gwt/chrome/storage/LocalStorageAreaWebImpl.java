package com.google.gwt.chrome.storage;

import com.google.gwt.chrome.message.BackgroundMessage;
import com.google.gwt.chrome.storage.StorageArea.StorageItemsCallback;
import com.google.gwt.chrome.storage.StorageArea.StorageSimpleCallback;
import com.google.gwt.chrome.storage.StorageArea.StorageUseCallback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JavaScriptObject;

/**
 * Implementation of local storage for web applications (not extensions).
 * This class has been altered to serve chrome.storage.local only.
 * @author Paweł Psztyć
 * 
 */
public class LocalStorageAreaWebImpl implements StorageAreaImpl {
	BackgroundMessage chromeMessagePassing = GWT.create(BackgroundMessage.class);
	
	private LocalStorageAreaWebImpl(){}
	/**
	 * This method is not available for web applications. 
	 * @param keys
	 * @param callback Immediately return 0 
	 */
	@Override
	public final void getBytesInUse(String[] keys, final StorageUseCallback callback) {
		Storage.getStorage().getLocal().getBytesInUse(keys, callback);
	};

	@Override
	public final void clear(final StorageSimpleCallback callback) {
		Storage.getStorage().getLocal().clear(callback);
	};
	@Override
	public final void set(JavaScriptObject data, final StorageSimpleCallback callback) {
		Storage.getStorage().getLocal().set(data, callback);
	}
	
	@Override
	public final void remove(String[] keys, final StorageSimpleCallback callback) {
		Storage.getStorage().getLocal().remove(keys, callback);
	};
	
	@Override
	public final void get(JavaScriptObject keysWithDefaults,
			final StorageItemsCallback callback){
		Storage.getStorage().getLocal().get(keysWithDefaults, callback);
	}

	
	@Override
	public void get(StorageItemsCallback callback) {
		Storage.getStorage().getLocal().get(callback);
	}
}
