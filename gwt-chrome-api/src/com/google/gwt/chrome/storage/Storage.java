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
	/**
	 * Flag if chrome storage API is available. If not it must use different interface implementation.
	 */
	private final boolean isAvailable; 
	
	private Storage(boolean isAvailable){
		this.isAvailable = isAvailable;
	}
	
	private static StorageImpl impl = GWT.create(StorageImpl.class);
	
	/**
	 * If extension's storage object if unavailable (is dev mode) it use message passing to background page instead 
	 * @return Storage object. 
	 */
	public static Storage getStorage(){
		if(impl.isAvailable()){
			return new Storage(true);
		}
		return new Storage(false);
	}
	/**
	 * Details about the error which occurred.
	 * @return
	 */
	public String getLastError(){
		return impl.getLastError();
	}
	
	/**
	 * 
	 * @return Items under the "local" storage area are local to each machine.
	 */
	public LocalStorageArea getLocal(){
		return new LocalStorageArea(isAvailable);
	}
	/**
	 * 
	 * @return Items under the "sync" storage area are synced using Chrome Sync.
	 */
	public SyncStorageArea getSync(){
		return new SyncStorageArea(isAvailable);
	}
	
	public void addChangeHandler(StorageChangeHandler handler){
		impl.addChangeHandler(handler);
	}
}
