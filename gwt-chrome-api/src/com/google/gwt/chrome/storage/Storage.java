package com.google.gwt.chrome.storage;

import com.google.gwt.core.client.GWT;

public class Storage {
	
	public interface StorageChangeHandler {
		/**
		 * Fired when one or more items change.
		 * @param data Object mapping each key that changed to its corresponding StorageChange for that item.
		 * @param area Name The name of the storage area ("sync" or "local") the changes are for.
		 */
		void onChange(StorageChangeObject data, String areaName);
	}
	/**
	 * Local storage area
	 */
	public static final String LOCAL = "local";
	/**
	 * Sync storage area
	 */
	public static final String SYNC = "sync";
	
	private static StorageImpl impl = GWT.create(StorageImpl.class);
	
	/**
	 * 
	 * @return Items under the "local" storage area are local to each machine.
	 */
	public LocalStorageArea getLocal(){
		return GWT.create(LocalStorageArea.class);
	}
	/**
	 * 
	 * @return Items under the "sync" storage area are synced using Chrome Sync.
	 */
	public SyncStorageArea getSync(){
		return GWT.create(SyncStorageArea.class);
	}
	/**
	 * Add change handler to the storage.
	 * It will be called everty time when any value in all storage areas will cahnge.
	 * @param handler A handler to be called.
	 */
	public void addChangeHandler(StorageChangeHandler handler){
		impl.addChangeHandler(handler);
	}
}
