package org.rest.client.storage.store;

import org.rest.client.jso.UrlRow;

import com.google.gwt.core.client.JsArray;

public class UrlHistoryStore {
	
	public interface StoreResultsCallback {
		void onSuccess(JsArray<UrlRow> result);
		void onError(Throwable e);
	}
	
	public interface StoreCallback {
		void onSuccess();
		void onError(Throwable e);
	}
	
	public final static native void put(String url, double time, StoreCallback callback) /*-{
		$wnd.arc.app.db.urls.insert(url, time)
		.then(function(){
			callback.@org.rest.client.storage.store.UrlHistoryStore.StoreCallback::onSuccess()();
		}, function(cause){
			callback.@org.rest.client.storage.store.UrlHistoryStore.StoreCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	
	/**
	 * Update URL record for with last use time
	 * @param rowId ID of record
	 * @param updateTime Event time
	 * @param callback 
	 */
	public final native static void update(String url, double updateTime, final StoreCallback callback) /*-{
		$wnd.arc.app.db.urls.update(url, updateTime)
		.then(function(){
			callback.@org.rest.client.storage.store.UrlHistoryStore.StoreCallback::onSuccess()();
		}, function(cause){
			callback.@org.rest.client.storage.store.UrlHistoryStore.StoreCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	/**
	 * Get records by URL pattern
	 * @param query patter for "LIKE" query
	 * @param callback
	 */
	public final static native void query(String query, final StoreResultsCallback callback) /*-{
		$wnd.arc.app.db.urls.list(query)
		.then(function(result){
			callback.@org.rest.client.storage.store.UrlHistoryStore.StoreResultsCallback::onSuccess(Lcom/google/gwt/core/client/JsArray;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.UrlHistoryStore.StoreResultsCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
}
