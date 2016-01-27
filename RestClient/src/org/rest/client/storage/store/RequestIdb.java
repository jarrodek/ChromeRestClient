package org.rest.client.storage.store;

import org.rest.client.jso.HistoryObject;

import com.google.gwt.core.client.JsArray;

public class RequestIdb {
	
	public interface StoreInsertCallback {
		void onSuccess(int inserId);
		void onError(Throwable e);
	}
	
	public interface StoreResultsCallback {
		void onSuccess(JsArray<HistoryObject> result);
		void onError(Throwable e);
	}
	
	public interface StoreResultCallback {
		void onSuccess(HistoryObject result);
		void onError(Throwable e);
	}
	
	public final static native void put(HistoryObject obj, StoreInsertCallback callback) /*-{
		$wnd.arc.app.db.idb.importRequests([obj])
		.then(function(result){
			if(!result || result.length === 0){
				result = null;
			} else {
				result = result[0];
			}
			callback.@org.rest.client.storage.store.RequestIdb.StoreInsertCallback::onSuccess(I)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.RequestIdb.StoreInsertCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	
	public final static native void getHistoryItems(String url, String method, final StoreResultsCallback callback)/*-{
		$wnd.arc.app.db.idb.getRequestObjectsQueryArrayKey(url, method)
		.then(function(result){
			callback.@org.rest.client.storage.store.RequestIdb.StoreResultsCallback::onSuccess(Lcom/google/gwt/core/client/JsArray;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.RequestIdb.StoreResultsCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	
	public final static native void getByLegacyId(int legacyId, final StoreResultCallback callback)/*-{
		$wnd.arc.app.db.idb.getRequestObjectsByLegacyId(legacyId)
		.then(function(result){
			if(!result || result.length === 0){
				result = null;
			} else {
				result = result[0];
			}
			callback.@org.rest.client.storage.store.RequestIdb.StoreResultCallback::onSuccess(Lorg/rest/client/jso/HistoryObject;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.RequestIdb.StoreResultCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
}
