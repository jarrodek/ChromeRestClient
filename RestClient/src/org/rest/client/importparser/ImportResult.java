package org.rest.client.importparser;

import java.util.ArrayList;

import org.rest.client.storage.store.objects.ProjectObject;
import org.rest.client.storage.store.objects.RequestObject;

public class ImportResult {
	ArrayList<ProjectObject> projects = null;
	ArrayList<RequestObject> requests = null;
	
	public ArrayList<ProjectObject> getProjects() {
		return projects;
	}

	public void setProjects(ArrayList<ProjectObject> projects) {
		this.projects = projects;
	}

	public ArrayList<RequestObject> getRequests() {
		return requests;
	}

	public void setRequests(ArrayList<RequestObject> requests) {
		this.requests = requests;
	}

	
	
}
