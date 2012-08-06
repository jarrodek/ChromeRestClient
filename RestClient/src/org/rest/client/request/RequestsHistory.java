package org.rest.client.request;

import org.rest.client.RestClient;
import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.store.HistoryRequestStoreWebSql;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.Callback;

public class RequestsHistory {
	
	
	/**
	 * Remove all history items from storage.
	 */
	public static void clearHistory(final Callback<Boolean, Throwable> callback){
		
		if(RestClient.isDebug()){
			Log.debug("Clear history list.");
		}
		
		HistoryRequestStoreWebSql store = RestClient.getClientFactory().getHistoryRequestStore();
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
