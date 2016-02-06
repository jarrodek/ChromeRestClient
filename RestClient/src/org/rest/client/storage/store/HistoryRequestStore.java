package org.rest.client.storage.store;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArray;

public class HistoryRequestStore {
	
	
	public interface StoreResultCallback {
		void onSuccess(JavaScriptObject result);
		void onError(Throwable e);
	}
	
	public interface StoreInsertCallback {
		void onSuccess(int inserId);
		void onError(Throwable e);
	}
	
	public interface StoreResultsCallback {
		void onSuccess(JsArray<JavaScriptObject> result);
		void onError(Throwable e);
	}
	
	public interface StoreSimpleCallback {
		void onSuccess();
		void onError(Throwable e);
	}
	
	public interface StoreDeleteCallback {
		/**
		 * @param deleted A number of deleted entries.
		 */
		void onSuccess(int deleted);
		void onError(Throwable e);
	}
	
	/**
	 * Insert Request data into history table.
	 * 
	 * @param obj The data to insert
	 * @param key - <b>NULL</b> (do nothing here)
	 * @param callback The callback to call after insert.
	 */
	public final native static void insert(JavaScriptObject obj, StoreInsertCallback callback) /*-{
		$wnd.arc.app.db.requests.insert(obj, 'history')
		.then(function(result){
			callback.@org.rest.client.storage.store.HistoryRequestStore.StoreInsertCallback::onSuccess(I)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.HistoryRequestStore.StoreInsertCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	

	public final native static void getByKey(int key, final StoreResultCallback callback) /*-{
		$wnd.arc.app.db.requests.getRequest(key, 'history')
		.then(function(result){
			callback.@org.rest.client.storage.store.HistoryRequestStore.StoreResultCallback::onSuccess(Lcom/google/gwt/core/client/JavaScriptObject;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.HistoryRequestStore.StoreResultCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	
	/**
	 * This type of query is not available for this table.
	 */
	public final native static void all(final StoreResultsCallback callback) /*-{
		$wnd.arc.app.db.requests.list('history')
		.then(function(result){
			callback.@org.rest.client.storage.store.HistoryRequestStore.StoreResultsCallback::onSuccess(Lcom/google/gwt/core/client/JsArray;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.HistoryRequestStore.StoreResultsCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	
	public final native static void remove(int key, final StoreSimpleCallback callback) /*-{
		$wnd.arc.app.db.requests.remove(key, 'history')
		.then(function(){
			callback.@org.rest.client.storage.store.HistoryRequestStore.StoreSimpleCallback::onSuccess()();
		}, function(cause){
			callback.@org.rest.client.storage.store.HistoryRequestStore.StoreSimpleCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	
	public final native static void deleteHistory(final StoreDeleteCallback callback) /*-{
		$wnd.arc.app.db.requests.removeAll('history')
		.then(function(count){
			callback.@org.rest.client.storage.store.HistoryRequestStore.StoreDeleteCallback::onSuccess(I)(count);
		}, function(cause){
			callback.@org.rest.client.storage.store.HistoryRequestStore.StoreDeleteCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	/**
	 * Get from database data only for history list. It's include: database ID, URL and method field.
	 * @param callback
	 */
	public final native static void queryHistory(String query, int limit, int offset, final StoreResultsCallback callback) /*-{
		var opts = {};
		if (query) {
			opts.query = query;
		}
		if (typeof limit !== 'undefined' && limit >= 0) {
			opts.limit = limit;
		}
		if (typeof offset !== 'undefined' && offset >= 0) {
			opts.offset = offset;
		}
		$wnd.arc.app.db.requests.query('history', opts)
		.then(function(result){
			callback.@org.rest.client.storage.store.HistoryRequestStore.StoreResultsCallback::onSuccess(Lcom/google/gwt/core/client/JsArray;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.HistoryRequestStore.StoreResultsCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
}
