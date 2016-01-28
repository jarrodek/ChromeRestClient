package org.rest.client.storage.store;

import org.rest.client.jso.HistoryObject;

import com.google.gwt.core.client.JsArray;

public class HistoryRequestStoreWebSql {
	
	
	public interface StoreResultCallback {
		void onSuccess(HistoryObject result);
		void onError(Throwable e);
	}
	
	public interface StoreInsertCallback {
		void onSuccess(int inserId);
		void onError(Throwable e);
	}
	
	public interface StoreResultsCallback {
		void onSuccess(JsArray<HistoryObject> result);
		void onError(Throwable e);
	}
	
	public interface StoreSimpleCallback {
		void onSuccess();
		void onError(Throwable e);
	}
	
	/**
	 * Insert Request data into history table.
	 * 
	 * @param obj The data to insert
	 * @param key - <b>NULL</b> (do nothing here)
	 * @param callback The callback to call after insert.
	 */
	public final native void put(HistoryObject obj, StoreInsertCallback callback) /*-{
		$wnd.arc.app.db.websql.insertHistoryObject(obj)
		.then(function(result){
			callback.@org.rest.client.storage.store.HistoryRequestStoreWebSql.StoreInsertCallback::onSuccess(I)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.HistoryRequestStoreWebSql.StoreInsertCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	

	public final native void getByKey(int key, final StoreResultCallback callback) /*-{
		$wnd.arc.app.db.websql.getHistoryObject(key)
		.then(function(result){
			callback.@org.rest.client.storage.store.HistoryRequestStoreWebSql.StoreResultCallback::onSuccess(Lorg/rest/client/jso/HistoryObject;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.HistoryRequestStoreWebSql.StoreResultCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	
	/**
	 * This type of query is not available for this table.
	 */
	public final native void all(final StoreResultsCallback callback) /*-{
		$wnd.arc.app.db.websql.getAllHistoryObjects()
		.then(function(result){
			callback.@org.rest.client.storage.store.HistoryRequestStoreWebSql.StoreResultsCallback::onSuccess(Lcom/google/gwt/core/client/JsArray;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.HistoryRequestStoreWebSql.StoreResultsCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	
	public final native void remove(int key, final StoreSimpleCallback callback) /*-{
		$wnd.arc.app.db.websql.removeHistoryObject(key)
		.then(function(){
			callback.@org.rest.client.storage.store.HistoryRequestStoreWebSql.StoreSimpleCallback::onSuccess()();
		}, function(cause){
			callback.@org.rest.client.storage.store.HistoryRequestStoreWebSql.StoreSimpleCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	
	public final native void deleteHistory(final StoreSimpleCallback callback) /*-{
		$wnd.arc.app.db.websql.truncateHistoryTable()
		.then(function(){
			callback.@org.rest.client.storage.store.HistoryRequestStoreWebSql.StoreSimpleCallback::onSuccess()();
		}, function(cause){
			callback.@org.rest.client.storage.store.HistoryRequestStoreWebSql.StoreSimpleCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	/**
	 * Get from database data only for history list. It's include: database ID, URL and method field.
	 * @param callback
	 */
	public final native void historyList(String query, int limit, int offset, final StoreResultsCallback callback) /*-{
		var opts = {
			'limit': limit,
			'offset': offset
		};
		if (query) {
			opts.query = query;
		}
		$wnd.arc.app.db.websql.queryHistoryTable(opts)
		.then(function(result){
			callback.@org.rest.client.storage.store.HistoryRequestStoreWebSql.StoreResultsCallback::onSuccess(Lcom/google/gwt/core/client/JsArray;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.HistoryRequestStoreWebSql.StoreResultsCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	
	public final native void getHistoryItems(String url, String method, final StoreResultsCallback callback)/*-{
		$wnd.arc.app.db.websql.getHistoryItems(url, method)
		.then(function(result){
			callback.@org.rest.client.storage.store.HistoryRequestStoreWebSql.StoreResultsCallback::onSuccess(Lcom/google/gwt/core/client/JsArray;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.HistoryRequestStoreWebSql.StoreResultsCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	
	public final native void updateHistoryItemTime(int rowId, double time, final StoreSimpleCallback callback)/*-{
		$wnd.arc.app.db.websql.updateHistoryTime(rowId, time)
		.then(function(result){
			callback.@org.rest.client.storage.store.HistoryRequestStoreWebSql.StoreSimpleCallback::onSuccess()();
		}, function(cause){
			callback.@org.rest.client.storage.store.HistoryRequestStoreWebSql.StoreSimpleCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
}
