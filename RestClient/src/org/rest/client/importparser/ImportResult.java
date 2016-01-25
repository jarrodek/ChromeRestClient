package org.rest.client.importparser;

import org.rest.client.jso.ProjectObject;
import org.rest.client.storage.store.objects.RequestObject;

import com.google.gwt.core.client.JsArray;

public class ImportResult {
	JsArray<ProjectObject> projects = null;
	JsArray<RequestObject> requests = null;
	
	public JsArray<ProjectObject> getProjects() {
		return projects;
	}

	public void setProjects(JsArray<ProjectObject> projects) {
		this.projects = projects;
	}

	public JsArray<RequestObject> getRequests() {
		return requests;
	}

	public void setRequests(JsArray<RequestObject> requests) {
		this.requests = requests;
	}

	
	
}
