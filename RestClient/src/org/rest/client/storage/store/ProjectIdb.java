package org.rest.client.storage.store;

import org.rest.client.jso.ProjectObject;
import org.rest.client.jso.RequestObject;
/**
 * IDB wrapper for Projects store.
 * @author Pawel Psztyc
 *
 */
public class ProjectIdb {
	
	public final static native void addWithRequest(ProjectObject project, RequestObject request) /*-{
		$wnd.arc.app.db.idb.importProjectWithRequests(project, [request])
		.then(function(result){
			console.info('Indexed db saved project and request.');
		}, function(cause){
			console.error('Indexed db did not saved project and request.', cause);
			$wnd.arc.app.analytics.sendException('ProjectIdb::addWithRequest' + JSON.stringify(cause));
		});
	}-*/;
	
	public final static native void updateProject(ProjectObject obj) /*-{
		$wnd.arc.app.db.idb.updateProjectLegacy(obj.id, obj.name, obj.time)
		.then(function(){
			console.info('IndexedDB updated project.');
		}, function(cause){
			console.error('Indexed db did not updated project.', cause);
			$wnd.arc.app.analytics.sendException('ProjectIdb::updateProject' + JSON.stringify(cause));
		});
	}-*/;
	public final static native void getByLegacyKey(int id) /*-{
		$wnd.arc.app.db.idb.getProjectLegacy(id)
		.then(function(obj){
			console.info('IndexedDB returned project.', obj);
		}, function(cause){
			console.error('Indexed db did not returned project.', cause);
			$wnd.arc.app.analytics.sendException('ProjectIdb::getByKey' + JSON.stringify(cause));
		});
	}-*/;
	public final static native void all() /*-{
		$wnd.arc.app.db.idb.listProjects()
		.then(function(result){
			console.info('Indexed returned list of projects.', result);
		}, function(cause){
			console.error('Indexed did not returned list of projects.', cause);
			$wnd.arc.app.analytics.sendException('ProjectIdb::all' + JSON.stringify(cause));
		});
	}-*/;
	public final static native void remove(int key) /*-{
		$wnd.arc.app.db.idb.deleteProjectRecursiveLegacy(key)
		.then(function(){
			console.info('Indexed deleted the project.');
		}, function(cause){
			console.info('Indexed did not deleted the project.', cause);
			$wnd.arc.app.analytics.sendException('ProjectIdb::remove' + JSON.stringify(cause));
		});
	}-*/;
}
