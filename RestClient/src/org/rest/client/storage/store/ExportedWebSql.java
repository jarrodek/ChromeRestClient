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
public class ExportedWebSql {
	
	public interface StoreResultCallback {
		void onSuccess(ExportedDataItem result);
		void onError(Throwable e);
	}
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
	public final native void insertExported(JsArray<ExportedDataItem> exportedArray, final StoreInsertListCallback callback) /*-{
		$wnd.arc.app.db.websql.insertExported(exportedArray)
		.then(function(result){
			callback.@org.rest.client.storage.store.ExportedWebSql.StoreInsertListCallback::onSuccess(Lcom/google/gwt/core/client/JsArrayInteger;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.ExportedWebSql.StoreInsertListCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	
	public final native void getExportedByReferenceIds(JsArrayInteger referenceList, final StoreResultsCallback callback) /*-{
		$wnd.arc.app.db.websql.getExportedByReferenceIds(referenceList)
		.then(function(result){
			callback.@org.rest.client.storage.store.ExportedWebSql.StoreResultsCallback::onSuccess(Lcom/google/gwt/core/client/JsArray;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.ExportedWebSql.StoreResultsCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	
}
