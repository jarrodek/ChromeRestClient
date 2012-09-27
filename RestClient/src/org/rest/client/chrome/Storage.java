package org.rest.client.chrome;

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
	
	private Storage(){}
	
	/**
	 * 
	 * @return null if not 
	 */
	public static Storage getStorageIfAvailable(){
		if(isAvailable()){
			return new Storage();
		}
		return null;
	}
	
	private final static native boolean isAvailable() /*-{
		return !!($wnd.chrome.storage);
	}-*/;
	
	/**
	 * 
	 * @return Items under the "local" storage area are local to each machine.
	 */
	public LocalStorageArea getLocal(){
		return new LocalStorageArea();
	}
	/**
	 * 
	 * @return Items under the "sync" storage area are synced using Chrome Sync.
	 */
	public SyncStorageArea getSync(){
		return new SyncStorageArea();
	}
	
	public void addChangeHandler(StorageChangeHandler handler){
		_addChangeHandler(handler);
	}
	
	private final native void _addChangeHandler(StorageChangeHandler handler) /*-{
		chrome.storage.onChanged.addListener(function(changes, areaName) {
			handler.@org.rest.client.chrome.Storage.StorageChangeHandler::onChange(Lorg/rest/client/chrome/StorageChangeObject;Ljava/lang/String;)(changes, areaName);
		});
	}-*/;
}
