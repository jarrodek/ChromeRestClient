package org.rest.client.task;

import org.rest.client.SyncAdapter;
import org.rest.client.storage.store.LocalStore;

import com.google.gwt.storage.client.Storage;
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
	
	@Override
	public void run(TasksCallback callback, boolean lastRun) {
		if(loaderWidget != null){
			loaderWidget.setText("Setting up synced values");
		}
		
		final Storage store = Storage.getLocalStorageIfSupported();
		//first, restore local value, for quick access
		String debugValue = store.getItem(LocalStore.DEBUG_KEY);
		String historyValue = store.getItem(LocalStore.HISTORY_KEY);
		String notificationsValue = store.getItem(LocalStore.NOTIFICATIONS_ENABLED_KEY);
		String magicVarsValue = store.getItem(LocalStore.MAGIC_VARS_ENABLED_KEY);
		if(debugValue != null && debugValue.equals("true")){
			SyncAdapter.debug = true;
		} else {
			SyncAdapter.debug = (false);
		}
		if(historyValue == null || historyValue.equals("true")){
			SyncAdapter.history = (true);
		} else {
			SyncAdapter.history = (false);
		}
		if(notificationsValue != null && notificationsValue.equals("true")){
			SyncAdapter.notifications = (true);
		} else {
			SyncAdapter.notifications = (false);
		}
		if(magicVarsValue != null && magicVarsValue.equals("true")){
			SyncAdapter.magicVars = (true);
		} else {
			SyncAdapter.magicVars = (false);
		}
		callback.onInnerTaskFinished(1);
		SyncAdapter.sync();
		SyncAdapter.observe();
		
		callback.onInnerTaskFinished(1);
		callback.onSuccess();
	}

	@Override
	public int getTasksCount() {
		return 2;
	}

	@Override
	public void setLoader(LoaderWidget loaderWidget) {
		this.loaderWidget = loaderWidget;
	}

}
