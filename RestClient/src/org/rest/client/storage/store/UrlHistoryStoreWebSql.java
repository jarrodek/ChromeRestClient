package org.rest.client.storage.store;

import org.rest.client.jso.UrlRow;

import com.google.gwt.core.client.JsArray;

public class UrlHistoryStoreWebSql {
	
	public interface StoreResultCallback {
		void onSuccess(UrlRow result);
		void onError(Throwable e);
	}
	
	public interface StoreResultsCallback {
		void onSuccess(JsArray<UrlRow> result);
		void onError(Throwable e);
	}
	
	public interface StoreCallback {
		void onSuccess();
		void onError(Throwable e);
	}
	
	public final native void put(UrlRow obj, StoreResultCallback callback) /*-{
		$wnd.arc.app.db.websql.addUrlHistory(obj.url, obj.time)
		.then(function(result){
			callback.@org.rest.client.storage.store.UrlHistoryStoreWebSql.StoreResultCallback::onSuccess(Lorg/rest/client/jso/UrlRow;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.UrlHistoryStoreWebSql.StoreResultCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	
	/**
	 * Update URL record for with last use time
	 * @param rowId ID of record
	 * @param updateTime Event time
	 * @param callback 
	 */
	public final native void updateUrlUseTime(int rowId, double updateTime, final StoreCallback callback) /*-{
		$wnd.arc.app.db.websql.updateUrlHistory(rowId, updateTime)
		.then(function(){
			callback.@org.rest.client.storage.store.UrlHistoryStoreWebSql.StoreCallback::onSuccess()();
		}, function(cause){
			callback.@org.rest.client.storage.store.UrlHistoryStoreWebSql.StoreCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	/**
	 * Get records by URL pattern
	 * @param query patter for "LIKE" query
	 * @param callback
	 */
	public final native void getByUrl(String query,
			final StoreResultsCallback callback) /*-{
		$wnd.arc.app.db.websql.getHistoryUrls(query)
		.then(function(result){
			callback.@org.rest.client.storage.store.UrlHistoryStoreWebSql.StoreResultsCallback::onSuccess(Lcom/google/gwt/core/client/JsArray;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.UrlHistoryStoreWebSql.StoreResultsCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
}
