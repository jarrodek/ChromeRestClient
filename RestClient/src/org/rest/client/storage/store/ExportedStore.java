package org.rest.client.storage.store;

import org.rest.client.jso.ExportedDataItem;

import com.google.gwt.core.client.JsArray;
import com.google.gwt.core.client.JsArrayInteger;

/**
 * Service for database connection with ID of RestForms that already has been
 * sent to application sever
 * 
 * @author Paweł Psztyć
 * 
 */
public class ExportedStore {
	
	public interface StoreResultsCallback {
		void onSuccess(JsArray<ExportedDataItem> result);
		void onError(Throwable e);
	}
	public interface StoreInsertListCallback {
		void onSuccess(JsArrayInteger insertId);
		void onError(Throwable e);
	}
	/**
	 * Insert data.
	 * @param exportedArray
	 * @param callback
	 */
	public final static native void insertExported(JsArray<ExportedDataItem> exportedArray, final StoreInsertListCallback callback) /*-{
		$wnd.arc.app.db.exported.insert(exportedArray)
		.then(function(result){
			callback.@org.rest.client.storage.store.ExportedStore.StoreInsertListCallback::onSuccess(Lcom/google/gwt/core/client/JsArrayInteger;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.ExportedStore.StoreInsertListCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	
	public final static native void getExportedByReferenceIds(JsArrayInteger referenceList, final StoreResultsCallback callback) /*-{
		$wnd.arc.app.db.exported.query(referenceList)
		.then(function(result){
			callback.@org.rest.client.storage.store.ExportedStore.StoreResultsCallback::onSuccess(Lcom/google/gwt/core/client/JsArray;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.ExportedStore.StoreResultsCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	
}
