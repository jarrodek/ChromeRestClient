package org.rest.client.task;

import java.util.HashMap;
import java.util.Iterator;

import org.rest.client.SyncAdapter;
import org.rest.client.storage.store.StoreKeys;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.chrome.storage.Storage;
import com.google.gwt.chrome.storage.StorageArea;
import com.google.gwt.chrome.storage.SyncStorageArea;
import com.google.gwt.core.client.Callback;
import com.google.gwt.core.shared.GWT;
import com.google.gwt.json.client.JSONBoolean;
import com.google.gwt.json.client.JSONObject;

/**
 * Read locally saved data (from LocalStorage) and set up SyncAdapter values.
 * The values will be overrided when SyncAdapter will sync all data.
 * 
 * @TODO: This app is using window.localstorage which is not compatible with Chrome Apps. In future release it must be replaced with chrome.storage API
 * 
 * @author Pawel Psztyc
 */
public class SetSyncDataTask implements LoadTask {
	LoaderWidget loaderWidget;
	TasksCallback callback;
	
	@Override
	public void run(final TasksCallback callback, final boolean lastRun) {
		if(loaderWidget != null){
			loaderWidget.setText("Setting up synced values");
		}
		this.callback = callback;
		
		HashMap<String, Boolean> oldValues = getOldStoreValues();
		if(oldValues != null){
			Storage store = GWT.create(Storage.class);
			SyncStorageArea sync = store.getSync();
			JSONObject passedValues = new JSONObject();
			
			Iterator<String> it = oldValues.keySet().iterator();
			while(it.hasNext()){
				String key = it.next();
				boolean value = oldValues.get(key).booleanValue();
				passedValues.put(key, JSONBoolean.getInstance(value));
			}
			sync.set(passedValues.getJavaScriptObject(), new StorageArea.StorageSimpleCallback() {
				
				@Override
				public void onError(String message) {
					Log.error("I was unable to upgrade storage from localStorage to storach.sync: " + message);
					if(lastRun){
						callback.onInnerTaskFinished(1);
						runSyncAdapter();
					} else {
						callback.onFailure(0);
					}
				}
				
				@Override
				public void onDone() {
					clearOldLocalStorage();
					callback.onInnerTaskFinished(1);
					runSyncAdapter();
				}
			});
		} else {
			callback.onInnerTaskFinished(1);
			runSyncAdapter();
		}
	}
	
	
	private void runSyncAdapter(){
		SyncAdapter.sync(new Callback<Void, Void>() {

			@Override
			public void onFailure(Void reason) {
				SyncAdapter.observe();
				callback.onInnerTaskFinished(1);
				callback.onSuccess();
			}

			@Override
			public void onSuccess(Void result) {
				SyncAdapter.observe();
				callback.onInnerTaskFinished(1);
				callback.onSuccess();
			}
		});
	}

	@Override
	public int getTasksCount() {
		return 2;
	}

	@Override
	public void setLoader(LoaderWidget loaderWidget) {
		this.loaderWidget = loaderWidget;
	}
	
	/**
	 * Upgrade from previous store if needed.
	 * @return
	 */
	private HashMap<String, Boolean> getOldStoreValues(){
		com.google.gwt.storage.client.Storage localStorage =  com.google.gwt.storage.client.Storage.getLocalStorageIfSupported();
		String debugValue = localStorage.getItem(StoreKeys.DEBUG_KEY);
		if(debugValue == null){
			//there must be no default previous values.
			return null;
		}
		
		String historyValue = localStorage.getItem(StoreKeys.HISTORY_KEY);
		String notificationValue = localStorage.getItem(StoreKeys.NOTIFICATIONS_ENABLED_KEY);
		String mvValue = localStorage.getItem(StoreKeys.MAGIC_VARS_ENABLED_KEY);
		String cmhValue = localStorage.getItem(StoreKeys.CODE_MIRROR_HEADERS_KEY);
		String cmpValue = localStorage.getItem(StoreKeys.CODE_MIRROR_PAYLOAD_KEY);
		
		HashMap<String, Boolean> map = new HashMap<>();
		map.put(StoreKeys.DEBUG_KEY, Boolean.valueOf(debugValue));
		map.put(StoreKeys.HISTORY_KEY, Boolean.valueOf(historyValue));
		map.put(StoreKeys.NOTIFICATIONS_ENABLED_KEY, Boolean.valueOf(notificationValue));
		map.put(StoreKeys.MAGIC_VARS_ENABLED_KEY, Boolean.valueOf(mvValue));
		map.put(StoreKeys.CODE_MIRROR_HEADERS_KEY, Boolean.valueOf(cmhValue));
		map.put(StoreKeys.CODE_MIRROR_PAYLOAD_KEY, Boolean.valueOf(cmpValue));
		return map;
	}
	
	private void clearOldLocalStorage(){
		com.google.gwt.storage.client.Storage localStorage =  com.google.gwt.storage.client.Storage.getLocalStorageIfSupported();
		localStorage.removeItem(StoreKeys.DEBUG_KEY);
		localStorage.removeItem(StoreKeys.HISTORY_KEY);
		localStorage.removeItem(StoreKeys.NOTIFICATIONS_ENABLED_KEY);
		localStorage.removeItem(StoreKeys.MAGIC_VARS_ENABLED_KEY);
		localStorage.removeItem(StoreKeys.CODE_MIRROR_HEADERS_KEY);
		localStorage.removeItem(StoreKeys.CODE_MIRROR_PAYLOAD_KEY);
	}
}
