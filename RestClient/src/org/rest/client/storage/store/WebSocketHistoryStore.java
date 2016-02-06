package org.rest.client.storage.store;

import org.rest.client.jso.WebSocketObject;

import com.google.gwt.core.client.JsArray;

public class WebSocketHistoryStore {
	
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
	public final static native void add(WebSocketObject obj, final StoreInsertCallback callback) /*-{
		$wnd.arc.app.db.websockets.insert(obj.url, obj.time)
		.then(function(result){
			callback.@org.rest.client.storage.store.WebSocketHistoryStore.StoreInsertCallback::onSuccess(I)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.WebSocketHistoryStore.StoreInsertCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	
	/**
	 * Update
	 * @param obj
	 * @param callback
	 */
	public final static native void query(String query, final StoreResultsCallback callback) /*-{
		$wnd.arc.app.db.websockets.query(query)
		.then(function(result){
			callback.@org.rest.client.storage.store.WebSocketHistoryStore.StoreResultsCallback::onSuccess(Lcom/google/gwt/core/client/JsArray;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.WebSocketHistoryStore.StoreResultsCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
}
