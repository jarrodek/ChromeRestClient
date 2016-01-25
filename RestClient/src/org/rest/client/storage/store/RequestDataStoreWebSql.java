package org.rest.client.storage.store;

import org.rest.client.jso.RequestObject;

import com.google.gwt.core.client.JsArray;
import com.google.gwt.core.client.JsArrayInteger;

public class RequestDataStoreWebSql {

	public interface StoreResultCallback {
		void onSuccess(RequestObject result);
		void onError(Throwable e);
	}
	
	public interface StoreInsertCallback {
		void onSuccess(int inserId);
		void onError(Throwable e);
	}
	
	public interface StoreInsertListCallback {
		void onSuccess(JsArrayInteger inserId);
		void onError(Throwable e);
	}
	
	public interface StoreResultsCallback {
		void onSuccess(JsArray<RequestObject> result);
		void onError(Throwable e);
	}
	
	public interface StoreSimpleCallback {
		void onSuccess();
		void onError(Throwable e);
	}
	
	/**
	 * Read
	 * @param key
	 * @param callback
	 */
	public final native void getByKey(int key, final StoreResultCallback callback) /*-{
		$wnd.arc.app.db.websql.getRequest(key)
		.then(function(obj){
			callback.@org.rest.client.storage.store.RequestDataStoreWebSql.StoreResultCallback::onSuccess(Lorg/rest/client/jso/RequestObject;)(obj);
		}, function(cause){
			callback.@org.rest.client.storage.store.RequestDataStoreWebSql.StoreResultCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	/**
	 * Read
	 * @param key
	 * @param callback
	 */
	public final native void getDefaultForProject(int projectId, final StoreResultCallback callback) /*-{
		$wnd.arc.app.db.websql.getProjectDefaultRequest(projectId)
		.then(function(obj){
			callback.@org.rest.client.storage.store.RequestDataStoreWebSql.StoreResultCallback::onSuccess(Lorg/rest/client/jso/RequestObject;)(obj);
		}, function(cause){
			callback.@org.rest.client.storage.store.RequestDataStoreWebSql.StoreResultCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	/**
	 * List
	 * @param callback
	 */
	public final native void getForProject(int projectId, final StoreResultsCallback callback) /*-{
		$wnd.arc.app.db.websql.getProjectRequests(projectId)
		.then(function(result){
			callback.@org.rest.client.storage.store.RequestDataStoreWebSql.StoreResultsCallback::onSuccess(Lcom/google/gwt/core/client/JsArray;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.RequestDataStoreWebSql.StoreResultsCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	/**
	 * List
	 * @param callback
	 */
	public final native void all(final StoreResultsCallback callback) /*-{
		$wnd.arc.app.db.websql.listRequestObjects()
		.then(function(result){
			callback.@org.rest.client.storage.store.RequestDataStoreWebSql.StoreResultsCallback::onSuccess(Lcom/google/gwt/core/client/JsArray;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.RequestDataStoreWebSql.StoreResultsCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	/**
	 * @param callback
	 */
	public final native void query(String query, int limit, int offset, final StoreResultsCallback callback) /*-{
		var opts = {
			'limit': limit,
			'offset': offset
		};
		if (query) {
			opts.query = query;
		}
		$wnd.arc.app.db.websql.queryRequestsTable(opts)
		.then(function(result){
			callback.@org.rest.client.storage.store.RequestDataStoreWebSql.StoreResultsCallback::onSuccess(Lcom/google/gwt/core/client/JsArray;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.RequestDataStoreWebSql.StoreResultsCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	
	/**
	 * Delete
	 * @param key
	 * @param callback
	 */
	public final native void remove(int key, StoreSimpleCallback callback) /*-{
		$wnd.arc.app.db.websql.deleteRequestObject(key)
		.then(function(){
			callback.@org.rest.client.storage.store.RequestDataStoreWebSql.StoreSimpleCallback::onSuccess()();
		}, function(cause){
			callback.@org.rest.client.storage.store.RequestDataStoreWebSql.StoreSimpleCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	/**
	 * Delete
	 * @param key
	 * @param callback
	 */
	public final native void removeNonProject(StoreSimpleCallback callback) /*-{
		$wnd.arc.app.db.websql.deleteNonProjectRequests()
		.then(function(){
			callback.@org.rest.client.storage.store.RequestDataStoreWebSql.StoreSimpleCallback::onSuccess()();
		}, function(cause){
			callback.@org.rest.client.storage.store.RequestDataStoreWebSql.StoreSimpleCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	/**
	 * Delete
	 * @param key
	 * @param callback
	 */
	public final native void removeByProject(int projectId, StoreSimpleCallback callback) /*-{
		$wnd.arc.app.db.websql.deleteRequestByProject(projectId)
		.then(function(){
			callback.@org.rest.client.storage.store.RequestDataStoreWebSql.StoreSimpleCallback::onSuccess()();
		}, function(cause){
			callback.@org.rest.client.storage.store.RequestDataStoreWebSql.StoreSimpleCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	/**
	 * Create
	 * @param obj
	 * @param key
	 * @param callback
	 */
	public final native void insert(RequestObject obj, final StoreInsertCallback callback) /*-{
		$wnd.arc.app.db.websql.insertRequestObject(obj)
		.then(function(result){
			callback.@org.rest.client.storage.store.RequestDataStoreWebSql.StoreInsertCallback::onSuccess(I)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.RequestDataStoreWebSql.StoreInsertCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	/**
	 * Create
	 * @param obj
	 * @param key
	 * @param callback
	 */
	public final native void importRequests(JsArray<RequestObject> list, final StoreInsertListCallback callback) /*-{
		$wnd.arc.app.db.websql.importRequests(list)
		.then(function(result){
			callback.@org.rest.client.storage.store.RequestDataStoreWebSql.StoreInsertListCallback::onSuccess(Lcom/google/gwt/core/client/JsArrayInteger;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.RequestDataStoreWebSql.StoreInsertListCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	/**
	 * Update
	 * @param obj
	 * @param key
	 * @param callback
	 */
	public final native void update(RequestObject obj, final StoreSimpleCallback callback) /*-{
		$wnd.arc.app.db.websql.updateRequestObject(obj)
		.then(function(){
			callback.@org.rest.client.storage.store.RequestDataStoreWebSql.StoreSimpleCallback::onSuccess()();
		}, function(cause){
			callback.@org.rest.client.storage.store.RequestDataStoreWebSql.StoreSimpleCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	/**
	 * 
	 * @param key
	 * @param callback
	 */
	public final native void updateName(String name, int key, StoreSimpleCallback callback) /*-{
		$wnd.arc.app.db.websql.updateRequestName(key, name)
		.then(function(){
			callback.@org.rest.client.storage.store.RequestDataStoreWebSql.StoreSimpleCallback::onSuccess()();
		}, function(cause){
			callback.@org.rest.client.storage.store.RequestDataStoreWebSql.StoreSimpleCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;

}
