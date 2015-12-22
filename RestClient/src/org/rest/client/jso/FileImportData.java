package org.rest.client.jso;

import org.rest.client.storage.store.objects.ProjectObject;
import org.rest.client.storage.store.objects.RequestObject;

import com.google.gwt.core.client.JavaScriptObject;
/**
 * A class representing data read from import file.
 * Import file is a JSON file with two top properties:
 * "projects" (Array) containing projects structure information
 * "requests" (Array) containing request data information. 
 * @author Pawel Psztyc
 *
 */
import com.google.gwt.core.client.JsArray;
public class FileImportData extends JavaScriptObject {
	protected FileImportData(){}
	
	/**
	 * Get exported requests.
	 * @return Array of exported requests or null if there is no such property.
	 */
	public final native JsArray<RequestObject> getRequests() /*-{
		return this.requests;
	}-*/;
	/**
	 * Get exported projects data.
	 * @return Array of exported projects or null if there is no such property.
	 */
	public final native JsArray<ProjectObject> getProjects() /*-{
		return this.projects;
	}-*/;
	
	public final native boolean isValid() /*-{
		return !!this.requests && !!this.projects;
	}-*/;
}
