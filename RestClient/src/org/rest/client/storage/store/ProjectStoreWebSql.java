package org.rest.client.storage.store;

import org.rest.client.jso.ProjectObject;

import com.google.gwt.core.client.JsArray;
import com.google.gwt.core.client.JsArrayInteger;

public class ProjectStoreWebSql {
	
	public interface StoreResultCallback {
		void onSuccess(ProjectObject result);
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
		void onSuccess(JsArray<ProjectObject> result);
		void onError(Throwable e);
	}
	
	public interface StoreSimpleCallback {
		void onSuccess();
		void onError(Throwable e);
	}
	/**
	 * Create
	 * @param obj
	 * @param key
	 * @param callback
	 */
	public final native void add(ProjectObject obj, final StoreInsertCallback callback) /*-{
		$wnd.arc.app.db.websql.addProject(obj.name, obj.time)
		.then(function(result){
			callback.@org.rest.client.storage.store.ProjectStoreWebSql.StoreInsertCallback::onSuccess(I)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.ProjectStoreWebSql.StoreInsertCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	/**
	 * Update
	 * @param obj
	 * @param callback
	 */
	public final native void put(ProjectObject obj, final StoreResultCallback callback) /*-{
		$wnd.arc.app.db.websql.updateProject(obj.name, obj.time, obj.id)
		.then(function(){
			callback.@org.rest.client.storage.store.ProjectStoreWebSql.StoreResultCallback::onSuccess(Lorg/rest/client/jso/ProjectObject;)(obj);
		}, function(cause){
			callback.@org.rest.client.storage.store.ProjectStoreWebSql.StoreResultCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;

	/**
	 * Read
	 * @param key
	 * @param callback
	 */
	public final native void getByKey(int key, final StoreResultCallback callback) /*-{
		$wnd.arc.app.db.websql.getProject(key)
		.then(function(obj){
			console.info('$wnd.arc.app.db.websql.getProject(key)', key, obj);
			callback.@org.rest.client.storage.store.ProjectStoreWebSql.StoreResultCallback::onSuccess(Lorg/rest/client/jso/ProjectObject;)(obj);
		}, function(cause){
			callback.@org.rest.client.storage.store.ProjectStoreWebSql.StoreResultCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	/**
	 * List
	 * @param callback
	 */
	public final native void all(final StoreResultsCallback callback) /*-{
		$wnd.arc.app.db.websql.listProjects()
		.then(function(result){
			callback.@org.rest.client.storage.store.ProjectStoreWebSql.StoreResultsCallback::onSuccess(Lcom/google/gwt/core/client/JsArray;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.ProjectStoreWebSql.StoreResultsCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	/**
	 * Delete
	 * @param key
	 * @param callback
	 */
	public final native void remove(int key, StoreSimpleCallback callback) /*-{
		$wnd.arc.app.db.websql.deleteProject(key)
		.then(function(){
			callback.@org.rest.client.storage.store.ProjectStoreWebSql.StoreSimpleCallback::onSuccess()();
		}, function(cause){
			callback.@org.rest.client.storage.store.ProjectStoreWebSql.StoreSimpleCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	
	public final native void importData(JsArray<ProjectObject> projects, StoreInsertListCallback callback) /*-{
		$wnd.arc.app.db.websql.importProjects2(projects)
		.then(function(result){
			callback.@org.rest.client.storage.store.ProjectStoreWebSql.StoreInsertListCallback::onSuccess(Lcom/google/gwt/core/client/JsArrayInteger;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.ProjectStoreWebSql.StoreInsertListCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	
}