package org.rest.client.storage.store;

import org.rest.client.jso.RequestObject;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArray;
import com.google.gwt.core.client.JsArrayInteger;

public class RequestDataStore {

	public interface StoreResultCallback {
		void onSuccess(JavaScriptObject result);
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
		void onSuccess(JsArray<JavaScriptObject> result);
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
	public final native static void getByKey(int key, final StoreResultCallback callback) /*-{
		$wnd.arc.app.db.requests.getRequest(key, 'saved')
		.then(function(result){
			callback.@org.rest.client.storage.store.RequestDataStore.StoreResultCallback::onSuccess(Lcom/google/gwt/core/client/JavaScriptObject;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.RequestDataStore.StoreResultCallback::onError(Ljava/lang/Throwable;)(cause);
			$wnd.arc.app.analytics.sendException('RequestDataStore::getByKey::' + JSON.stringify(cause));
		});
	}-*/;
	/**
	 * List
	 * @param callback
	 */
	public final native static void all(final StoreResultsCallback callback) /*-{
		$wnd.arc.app.db.requests.list('saved')
		.then(function(result){
			callback.@org.rest.client.storage.store.RequestDataStore.StoreResultsCallback::onSuccess(Lcom/google/gwt/core/client/JsArray;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.RequestDataStore.StoreResultsCallback::onError(Ljava/lang/Throwable;)(cause);
			$wnd.arc.app.analytics.sendException('RequestDataStore::all::' + JSON.stringify(cause));
		});
	}-*/;
	/**
	 * @param callback
	 */
	public final native static void query(String query, int limit, int offset, final StoreResultsCallback callback) /*-{
		var opts = {};
		if (query) {
			opts.query = query;
		}
		if (typeof limit !== 'undefined' && limit >= 0) {
			opts.limit = limit;
		}
		if (typeof offset !== 'undefined' && offset >= 0) {
			opts.offset = offset;
		}
		$wnd.arc.app.db.requests.query('saved', opts)
		.then(function(result){
			callback.@org.rest.client.storage.store.RequestDataStore.StoreResultsCallback::onSuccess(Lcom/google/gwt/core/client/JsArray;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.RequestDataStore.StoreResultsCallback::onError(Ljava/lang/Throwable;)(cause);
			$wnd.arc.app.analytics.sendException('RequestDataStore::query::' + JSON.stringify(cause));
		});
	}-*/;
	/**
	 * Delete
	 * @param key
	 * @param callback
	 */
	public final native static void remove(int key, String type, StoreSimpleCallback callback) /*-{
		$wnd.arc.app.db.requests.remove(key, type)
		.then(function(){
			callback.@org.rest.client.storage.store.RequestDataStore.StoreSimpleCallback::onSuccess()();
		}, function(cause){
			callback.@org.rest.client.storage.store.RequestDataStore.StoreSimpleCallback::onError(Ljava/lang/Throwable;)(cause);
			$wnd.arc.app.analytics.sendException('RequestDataStore::remove' + JSON.stringify(cause));
		});
	}-*/;
	/**
	 * List
	 * @param callback
	 */
	public final native static void getForProject(int projectId, final StoreResultsCallback callback) /*-{
		$wnd.arc.app.db.requests.getProjectRequests(projectId)
		.then(function(result){
			callback.@org.rest.client.storage.store.RequestDataStore.StoreResultsCallback::onSuccess(Lcom/google/gwt/core/client/JsArray;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.RequestDataStore.StoreResultsCallback::onError(Ljava/lang/Throwable;)(cause);
			$wnd.arc.app.analytics.sendException('RequestDataStore::getForProject' + JSON.stringify(cause));
		});
	}-*/;
	/**
	 * Delete
	 * @param key
	 * @param callback
	 */
	public final native static void removeByProject(int projectId, StoreSimpleCallback callback) /*-{
		$wnd.arc.app.db.requests.deleteByProject(projectId)
		.then(function(){
			callback.@org.rest.client.storage.store.RequestDataStore.StoreSimpleCallback::onSuccess()();
		}, function(cause){
			callback.@org.rest.client.storage.store.RequestDataStore.StoreSimpleCallback::onError(Ljava/lang/Throwable;)(cause);
			$wnd.arc.app.analytics.sendException('RequestDataStore::removeByProject::' + JSON.stringify(cause));
		});
	}-*/;
	/**
	 * Create
	 * @param obj
	 * @param key
	 * @param callback
	 */
	public final native static void insert(RequestObject obj, final StoreInsertCallback callback) /*-{
		$wnd.arc.app.db.requests.insert(obj, 'saved')
		.then(function(result){
			callback.@org.rest.client.storage.store.RequestDataStore.StoreInsertCallback::onSuccess(I)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.RequestDataStore.StoreInsertCallback::onError(Ljava/lang/Throwable;)(cause);
			$wnd.arc.app.analytics.sendException('RequestDataStore::insert::' + JSON.stringify(cause));
		});
	}-*/;
	/**
	 * Create
	 * @param obj
	 * @param key
	 * @param callback
	 */
	public final native static void importRequests(JsArray<RequestObject> list, final StoreInsertListCallback callback) /*-{
		$wnd.arc.app.db.requests.importList(list)
		.then(function(result){
			callback.@org.rest.client.storage.store.RequestDataStore.StoreInsertListCallback::onSuccess(Lcom/google/gwt/core/client/JsArrayInteger;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.RequestDataStore.StoreInsertListCallback::onError(Ljava/lang/Throwable;)(cause);
			$wnd.arc.app.analytics.sendException('RequestDataStore::importRequests::' + JSON.stringify(cause));
		});
	}-*/;
	/**
	 * Update
	 * @param obj
	 * @param key
	 * @param callback
	 */
	public final native static void update(RequestObject obj, final StoreSimpleCallback callback) /*-{
		$wnd.arc.app.db.requests.update(obj)
		.then(function(){
			callback.@org.rest.client.storage.store.RequestDataStore.StoreSimpleCallback::onSuccess()();
		}, function(cause){
			callback.@org.rest.client.storage.store.RequestDataStore.StoreSimpleCallback::onError(Ljava/lang/Throwable;)(cause);
			$wnd.arc.app.analytics.sendException('RequestDataStore::update::' + JSON.stringify(cause));
		});
	}-*/;
	/**
	 * 
	 * @param key
	 * @param callback
	 */
	public final native static void updateName(String name, int key, StoreSimpleCallback callback) /*-{
		$wnd.arc.app.db.requests.updateName(key, name)
		.then(function(){
			callback.@org.rest.client.storage.store.RequestDataStore.StoreSimpleCallback::onSuccess()();
		}, function(cause){
			callback.@org.rest.client.storage.store.RequestDataStore.StoreSimpleCallback::onError(Ljava/lang/Throwable;)(cause);
			$wnd.arc.app.analytics.sendException('RequestDataStore::updateName::' + JSON.stringify(cause));
		});
	}-*/;

}
