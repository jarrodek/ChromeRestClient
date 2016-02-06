package org.rest.client.storage.store;

import org.rest.client.jso.HeaderRow;


import com.google.gwt.core.client.JsArray;

public class HeadersStore {

	public interface StoreResultsCallback {
		void onSuccess(JsArray<HeaderRow> result);
		void onError(Throwable e);
	}

	/**
	 * Get headers by its name (for "LIKE" query type) and given type (either request or response).
	 * @param name
	 * @param type
	 * @param callback
	 */
	public final static native void query(String name, String type, final StoreResultsCallback callback) /*-{
		$wnd.arc.app.db.headers.list(name, type)
		.then(function(result){
			callback.@org.rest.client.storage.store.HeadersStore.StoreResultsCallback::onSuccess(Lcom/google/gwt/core/client/JsArray;)(result);
		}, function(cause){
			$wnd.arc.app.analytics.sendException('HeadersStore::query' + JSON.stringify(cause));
			callback.@org.rest.client.storage.store.HeadersStore.StoreResultsCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;

	
}
