package com.google.gwt.chrome.storage;

import com.google.gwt.chrome.storage.Storage.StorageChangeHandler;

public class StorageImpl {
	
	private StorageImpl(){}
	
	/**
	 * Check if storage API is available in the browser.
	 */
	final native boolean isAvailable() /*-{
		return !!($wnd.chrome.storage);
	}-*/;
	
	/**
	 * Add change handler to the storage.
	 * It will be called everty time when any value in all storage areas will cahnge.
	 * @param handler
	 */
	public final native void addChangeHandler(StorageChangeHandler handler) /*-{
		$wnd.chrome.storage.onChanged.addListener(function(changes, areaName) {
			handler.@com.google.gwt.chrome.storage.Storage.StorageChangeHandler::onChange(Lcom/google/gwt/chrome/storage/StorageChangeObject;Ljava/lang/String;)(changes, areaName);
		});
	}-*/;
}
