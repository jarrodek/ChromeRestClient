package org.rest.client.request;

import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import org.rest.client.RestClient;
import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.store.HistoryRequestStore;
import org.rest.client.storage.store.objects.HistoryObject;
import org.rest.client.ui.desktop.StatusNotification;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.Callback;

public class RequestsHistory {
	
	static final HistoryRequestStore store;
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
		
		store.all(new StoreResultCallback<Map<Long,HistoryObject>>() {
			@Override
			public void onSuccess(Map<Long, HistoryObject> result) {
				Set<Long> set = result.keySet();
				Iterator<Long> it = set.iterator();
				while(it.hasNext()){
					Long id = it.next();
					store.remove(id, new StoreResultCallback<Boolean>() {
						@Override
						public void onSuccess(Boolean result) {}
						@Override
						public void onError(Throwable e) {}
					});
				}
				callback.onSuccess(true);
			}
			
			@Override
			public void onError(Throwable e) {
				if(RestClient.isDebug()){
					Log.warn("Unable to clear history. History store error.", e);
				}
				callback.onFailure(e);
			}
		});
	}
	
}
