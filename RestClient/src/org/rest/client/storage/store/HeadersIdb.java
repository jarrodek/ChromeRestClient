package org.rest.client.storage.store;

import org.rest.client.jso.HeaderIdb;

import com.google.gwt.core.client.JsArray;

public class HeadersIdb {
	
	public static interface StoreResultsCallback {
		void onSuccess(JsArray<HeaderIdb> result);
		void onError(Throwable e);
	}
	
	public final static native void getHeaders(String name, String type, final StoreResultsCallback callback) /*-{
		var cp = name.replace(/%/gim, '');
		$wnd.arc.app.db.idb.getHeadersByName(cp, type)
		.then(function(result){
			callback.@org.rest.client.storage.store.HeadersIdb.StoreResultsCallback::onSuccess(Lcom/google/gwt/core/client/JsArray;)(result);
		}, function(cause){
			$wnd.arc.app.analytics.sendException('HeadersIdb::getHeaders' + JSON.stringify(cause));
			callback.@org.rest.client.storage.store.HeadersIdb.StoreResultsCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
}
