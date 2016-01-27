package org.rest.client.storage.store;

import org.rest.client.jso.UrlRow;

import com.google.gwt.core.client.JsArray;

public class UrlHistoryIdb {
	
	public interface StoreResultsCallback {
		void onSuccess(JsArray<UrlRow> result);
		void onError(Throwable e);
	}
	
	public interface StoreCallback {
		void onSuccess();
		void onError(Throwable e);
	}
	
	public final static native void put(String url, double time, StoreCallback callback) /*-{
		$wnd.arc.app.db.idb.putUrlHistory(url, time)
		.then(function(){
			callback.@org.rest.client.storage.store.UrlHistoryIdb.StoreCallback::onSuccess()();
		}, function(cause){
			callback.@org.rest.client.storage.store.UrlHistoryIdb.StoreCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	
	/**
	 * Get records by URL pattern
	 * @param query patter for "LIKE" query
	 * @param callback
	 */
	public final static native void getByUrl(String query,
			final StoreResultsCallback callback) /*-{
		$wnd.arc.app.db.idb.getHistoryUrls(query)
		.then(function(result){
			callback.@org.rest.client.storage.store.UrlHistoryIdb.StoreResultsCallback::onSuccess(Lcom/google/gwt/core/client/JsArray;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.UrlHistoryIdb.StoreResultsCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
}
