package com.google.gwt.chrome.storage;

import com.google.gwt.chrome.storage.Storage.StorageChangeHandler;

public class StorageImpl {
	
	private StorageImpl(){}
	
	
	final native boolean isAvailable() /*-{
		return !!($wnd.chrome.storage && !$wnd.chrome.storage.gwtDev);
	}-*/;
	
	final native String getLastError() /*-{
		if(!!($wnd.chrome.storage && !$wnd.chrome.storage.gwtDev))
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
	/**
	 * TODO: implement it!
	 * @param handler
	 */
	private final native void addWebChangeHandler(StorageChangeHandler handler) /*-{
		$wnd.addEventListener("chrome-storage-onchanged", function(e){
			handler.@com.google.gwt.chrome.storage.Storage.StorageChangeHandler::onChange(Lcom/google/gwt/chrome/storage/StorageChangeObject;Ljava/lang/String;)({oldValue:e.data.changes.oldValue,newValue:e.data.changes.newValue}, e.data.areaName);
		}, false);
	}-*/;
	
	
	//
	private final native void addExtensionChangeHandler(StorageChangeHandler handler) /*-{
		$wnd.chrome.storage.onChanged.addListener(function(changes, areaName) {
			handler.@com.google.gwt.chrome.storage.Storage.StorageChangeHandler::onChange(Lcom/google/gwt/chrome/storage/StorageChangeObject;Ljava/lang/String;)(changes, areaName);
		});
	}-*/;
}
