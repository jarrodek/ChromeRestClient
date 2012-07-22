package org.rest.client.request;

import org.rest.client.RestClient;
import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.store.HistoryRequestStoreWebSql;
import org.rest.client.ui.desktop.StatusNotification;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.Callback;

public class RequestsHistory {
	
	static final HistoryRequestStoreWebSql store;
	static boolean initialized = false;
	static{
		store = RestClient.getClientFactory().getHistoryRequestStore();
		store.open(new StoreResultCallback<Boolean>() {
			@Override
			public void onSuccess(Boolean result) {
				initialized = true;
			}
			
			@Override
			public void onError(Throwable e) {}
		});
	}
	
	
	/**
	 * Remove all history items from storage.
	 */
	public static void clearHistory(final Callback<Boolean, Throwable> callback){
		if(!initialized){
			StatusNotification.notify("History Store not ready.", StatusNotification.TYPE_CRITICAL, StatusNotification.TIME_MEDIUM);
			if(RestClient.isDebug()){
				Log.warn("Unable to clear history. History store not ready or errror occured.");
			}
			callback.onFailure(null);
			return;
		}
		
		if(RestClient.isDebug()){
			Log.debug("Clear history list.");
		}
		store.deleteHistory(new StoreResultCallback<Boolean>() {
			
			@Override
			public void onSuccess(Boolean result) {
				callback.onSuccess(true);
			}
			
			@Override
			public void onError(Throwable e) {
				callback.onFailure(e);
			}
		});
	}
	
}
