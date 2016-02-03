package org.rest.client.storage.store;

import org.rest.client.jso.ProjectObject;
import org.rest.client.jso.RequestObject;

import com.google.gwt.core.client.JsArray;
import com.google.gwt.core.client.JsArrayInteger;

public class ProjectsStore {
	
	public interface StoreResultCallback {
		void onSuccess(ProjectObject result);
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
	public final native static void addLegacy(ProjectObject obj, final StoreResultCallback callback) /*-{
		$wnd.arc.app.db.projects.add(obj.name, obj.created)
		.then(function(result){
			callback.@org.rest.client.storage.store.ProjectsStore.StoreResultCallback::onSuccess(Lorg/rest/client/jso/ProjectObject;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.ProjectsStore.StoreResultCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	
	public final static native void add(ProjectObject project, RequestObject request, StoreResultCallback callback) /*-{
		$wnd.arc.app.db.projects.add(project, [request])
		.then(function(result){
			callback.@org.rest.client.storage.store.ProjectsStore.StoreResultCallback::onSuccess(Lorg/rest/client/jso/ProjectObject;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.ProjectsStore.StoreResultCallback::onError(Ljava/lang/Throwable;)(cause);
			console.error('Indexed db did not saved project and request.', cause);
			$wnd.arc.app.analytics.sendException('ProjectIdb::addWithRequest' + JSON.stringify(cause));
		});
	}-*/;
	
	public final static native void getForRequest(int requestId, StoreResultCallback callback) /*-{
		$wnd.arc.app.db.projects.getForRequest(requestId)
		.then(function(result){
			callback.@org.rest.client.storage.store.ProjectsStore.StoreResultCallback::onSuccess(Lorg/rest/client/jso/ProjectObject;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.ProjectsStore.StoreResultCallback::onError(Ljava/lang/Throwable;)(cause);
			console.error('Indexed db did not saved project and request.', cause);
			$wnd.arc.app.analytics.sendException('ProjectIdb::addWithRequest' + JSON.stringify(cause));
		});
	}-*/;
	//arc.app.db.projects.getForRequest
	/**
	 * Update
	 * @param obj
	 * @param callback
	 */
	public final static native void update(ProjectObject obj, final StoreResultCallback callback) /*-{
		$wnd.arc.app.db.projects.update(obj)
		.then(function(obj){
			callback.@org.rest.client.storage.store.ProjectsStore.StoreResultCallback::onSuccess(Lorg/rest/client/jso/ProjectObject;)(obj);
		}, function(cause){
			callback.@org.rest.client.storage.store.ProjectsStore.StoreResultCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;

	/**
	 * Read
	 * @param key
	 * @param callback
	 */
	public final native static void getByKey(int key, final StoreResultCallback callback) /*-{
		$wnd.arc.app.db.projects.getProject(key)
		.then(function(obj){
			callback.@org.rest.client.storage.store.ProjectsStore.StoreResultCallback::onSuccess(Lorg/rest/client/jso/ProjectObject;)(obj);
		}, function(cause){
			callback.@org.rest.client.storage.store.ProjectsStore.StoreResultCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	/**
	 * List
	 * @param callback
	 */
	public final native static void all(final StoreResultsCallback callback) /*-{
		$wnd.arc.app.db.projects.list()
		.then(function(result){
			callback.@org.rest.client.storage.store.ProjectsStore.StoreResultsCallback::onSuccess(Lcom/google/gwt/core/client/JsArray;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.ProjectsStore.StoreResultsCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	/**
	 * Delete
	 * @param key
	 * @param callback
	 */
	public final native static void remove(int key, StoreSimpleCallback callback) /*-{
		$wnd.arc.app.db.projects.remove(key)
		.then(function(){
			callback.@org.rest.client.storage.store.ProjectsStore.StoreSimpleCallback::onSuccess()();
		}, function(cause){
			callback.@org.rest.client.storage.store.ProjectsStore.StoreSimpleCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	
	public final native static void importData(JsArray<ProjectObject> projects, JsArray<RequestObject> requests, StoreInsertListCallback callback) /*-{
		$wnd.arc.app.db.projects.importData(projects, requests)
		.then(function(result){
			callback.@org.rest.client.storage.store.ProjectsStore.StoreInsertListCallback::onSuccess(Lcom/google/gwt/core/client/JsArrayInteger;)(result);
		}, function(cause){
			callback.@org.rest.client.storage.store.ProjectsStore.StoreInsertListCallback::onError(Ljava/lang/Throwable;)(cause);
		});
	}-*/;
	
}