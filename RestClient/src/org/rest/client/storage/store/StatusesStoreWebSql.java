package org.rest.client.storage.store;

import org.rest.client.storage.websql.StatusCodeRow;

public class StatusesStoreWebSql {
	
	public interface StoreResultCallback {
		
		void onSuccess(StatusCodeRow result);
		void onError(Throwable e);
	}
	
	public static final native void get(int code, StoreResultCallback callback) /*-{
		$wnd.arc.app.db.websql.getStatusCode(code)
		.then(function(result){
			callback.@org.rest.client.storage.store.StatusesStoreWebSql.StoreResultCallback::onSuccess(Lorg/rest/client/storage/websql/StatusCodeRow;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.StatusesStoreWebSql.StoreResultCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
}
