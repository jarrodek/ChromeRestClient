package org.rest.client.storage.store;

import org.rest.client.jso.WebSocketObject;

import com.google.gwt.core.client.JsArray;

public class WebSocketDataStoreWebSql {
	
	public interface StoreInsertCallback {
		void onSuccess(int inserId);
		void onError(Throwable e);
	}
	
	public interface StoreResultsCallback {
		void onSuccess(JsArray<WebSocketObject> result);
		void onError(Throwable e);
	}
	
	/**
	 * Create
	 * @param obj
	 * @param key
	 * @param callback
	 */
	public final native void add(WebSocketObject obj, final StoreInsertCallback callback) /*-{
		$wnd.arc.app.db.websql.insertWebsocketData(obj.url, obj.time)
		.then(function(result){
			callback.@org.rest.client.storage.store.WebSocketDataStoreWebSql.StoreInsertCallback::onSuccess(I)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.WebSocketDataStoreWebSql.StoreInsertCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	
	/**
	 * Update
	 * @param obj
	 * @param callback
	 */
	public final native void query(String query, final StoreResultsCallback callback) /*-{
		$wnd.arc.app.db.websql.queryWebsocketData(query)
		.then(function(result){
			callback.@org.rest.client.storage.store.WebSocketDataStoreWebSql.StoreResultsCallback::onSuccess(Lcom/google/gwt/core/client/JsArray;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.WebSocketDataStoreWebSql.StoreResultsCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
}
