package com.google.gwt.chrome.storage;

import com.google.gwt.chrome.storage.Storage.StorageChangeHandler;

public class StorageImpl {
	
	private StorageImpl(){}
	
	
	final native boolean isAvailable() /*-{
		return !!($wnd.chrome.storage);
	}-*/;
	
	final native String getLastError() /*-{
		if(!!($wnd.chrome.storage))
			return $wnd.chrome.runtime.lastError || null;
		return null;
	}-*/;
	
	
	public void addChangeHandler(StorageChangeHandler handler){
		if(isAvailable()){
			addExtensionChangeHandler(handler);
		} else {
			addWebChangeHandler(handler);
		}
	}
	
	private final native void addWebChangeHandler(StorageChangeHandler handler) /*-{
		$wnd.addEventListener("storage", function(e){
			handler.@com.google.gwt.chrome.storage.Storage.StorageChangeHandler::onChange(Lcom/google/gwt/chrome/storage/StorageChangeObject;Ljava/lang/String;)({oldValue:e.oldValue,newValue:e.newValue}, "local");
		}, false);
	}-*/;
	
	
	//
	private final native void addExtensionChangeHandler(StorageChangeHandler handler) /*-{
		chrome.storage.onChanged.addListener(function(changes, areaName) {
			handler.@com.google.gwt.chrome.storage.Storage.StorageChangeHandler::onChange(Lcom/google/gwt/chrome/storage/StorageChangeObject;Ljava/lang/String;)(changes, areaName);
		});
	}-*/;
}
