package org.rest.client.storage.store;

import org.rest.client.jso.HeaderRow;

import com.google.gwt.core.client.JsArray;

public class HeadersStoreWebSql {

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
	public final native void getHeaders(String name, String type, final StoreResultsCallback callback) /*-{
		arc.app.db.websql.getHeadersByName(name, type)
		.then(function(result){
			callback.@org.rest.client.storage.store.HeadersStoreWebSql.StoreResultsCallback::onSuccess(Lcom/google/gwt/core/client/JsArray;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.HeadersStoreWebSql.StoreResultsCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;

	
}
