package org.rest.client;

import org.rest.client.storage.store.LocalStore;

import com.google.gwt.chrome.storage.Storage.StorageChangeHandler;
import com.google.gwt.chrome.storage.StorageArea.StorageItemsCallback;
import com.google.gwt.chrome.storage.StorageChangeObject;
import com.google.gwt.chrome.storage.SyncStorageArea;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.storage.client.Storage;

/**
 * Adapter for chrome.sync API.
 * @author jarrod
 *
 */
public class SyncAdapter {
	
	private static boolean debug = false;
	private static boolean history = true;
	private static boolean notifications = false;
	private static boolean observing = false;
	
	public static void sync(){
		com.google.gwt.chrome.storage.Storage chromeStore = com.google.gwt.chrome.storage.Storage.getStorage();
		final Storage store = Storage.getLocalStorageIfSupported();
		SyncStorageArea sync = chromeStore.getSync();
		JSONObject query = new JSONObject();
		query.put(LocalStore.DEBUG_KEY, new JSONString("false"));
		query.put(LocalStore.HISTORY_KEY, new JSONString("true"));
		query.put(LocalStore.NOTIFICATIONS_ENABLED_KEY, new JSONString("false"));
		
		sync.get(query.getJavaScriptObject(), new StorageItemsCallback() {
			@Override
			public void onResult(JSONObject data) {
				if(data == null){
					return;
				}
				if(data.containsKey(LocalStore.DEBUG_KEY)){
					JSONString _debugValue = data.get(LocalStore.DEBUG_KEY).isString();
					if(_debugValue != null){
						if(_debugValue.stringValue().equals("true")){
							debug = true;
							store.setItem(LocalStore.DEBUG_KEY, "true");
						} else {
							debug = false;
							store.setItem(LocalStore.DEBUG_KEY, "false");
						}
					}
				}
				if(data.containsKey(LocalStore.HISTORY_KEY)){
					JSONString _historyValue = data.get(LocalStore.HISTORY_KEY).isString();
					if(_historyValue != null){
						if(_historyValue.stringValue().equals("true")){
							history = true;
							store.setItem(LocalStore.HISTORY_KEY, "true");
						} else {
							history = false;
							store.setItem(LocalStore.HISTORY_KEY, "false");
						}
					}
				}
				if(data.containsKey(LocalStore.NOTIFICATIONS_ENABLED_KEY)){
					JSONString _notificationsValue = data.get(LocalStore.NOTIFICATIONS_ENABLED_KEY).isString();
					if(_notificationsValue != null){
						if(_notificationsValue.stringValue().equals("true")){
							notifications = true;
							store.setItem(LocalStore.NOTIFICATIONS_ENABLED_KEY, "true");
						} else {
							notifications = false;
							store.setItem(LocalStore.NOTIFICATIONS_ENABLED_KEY, "false");
						}
					}
				}
			}
			
			@Override
			public void onError(String message) {
				
			}
		});
	}
	
	public static void observe(){
		if(observing) return;
		observing = true;
		com.google.gwt.chrome.storage.Storage chromeStore = com.google.gwt.chrome.storage.Storage.getStorage();
		chromeStore.addChangeHandler(new StorageChangeHandler() {
			@Override
			public void onChange(StorageChangeObject data, String areaName) {
				if(areaName.equals(com.google.gwt.chrome.storage.Storage.SYNC)){
					sync();
				}
			}
		});
	}
	

	public static boolean isDebug() {
		return debug;
	}

	public static void setDebug(boolean debug) {
		SyncAdapter.debug = debug;
	}

	public static boolean isHistory() {
		return history;
	}

	public static void setHistory(boolean history) {
		SyncAdapter.history = history;
	}

	public static boolean isNotifications() {
		return notifications;
	}

	public static void setNotifications(boolean notifications) {
		SyncAdapter.notifications = notifications;
	}
	
}
