/*******************************************************************************
 * Copyright 2012 Paweł Psztyć
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
package org.rest.client.place;

import com.google.gwt.place.shared.Place;
import com.google.gwt.place.shared.PlaceTokenizer;

public class RequestPlace extends Place {
	private String placeToken = null;
	private String entryId = null;
	private boolean history = false;
	private boolean projectsEndpoint = false;
	private boolean project = false;
	private boolean saved = false;
	private boolean external = false;
	private boolean gdrive = false;
	private boolean create = false;

	/**
	 * 
	 * @param requestData
	 */
	public RequestPlace(String requestData) {
		if (requestData == null) {
			return;
		}
		if (requestData.startsWith("history/")) {
			history = true;
			entryId = requestData.substring(8);
		} else if (requestData.startsWith("projectEndpoint/")) {
			projectsEndpoint = true;
			entryId = requestData.substring(16);
		} else if (requestData.startsWith("project/")) {
			project = true;
			entryId = requestData.substring(8);
		} else if (requestData.startsWith("saved/")) {
			saved = true;
			entryId = requestData.substring(6);
		} else if (requestData.startsWith("external/")) {
			external = true;
			entryId = requestData.substring(9);
		} else if (requestData.startsWith("gdrive/")) {
			gdrive = true;
			if(requestData.contains("/create/")){
				create = true;
				entryId = requestData.substring(14);
			} else {
				entryId = requestData.substring(7);
			}
		}

		this.placeToken = requestData;
	}

	/**
	 * 
	 * @return true if this request is for saved project. It should display
	 *         default endpoint.
	 */
	public boolean isProject() {
		return project;
	}

	/**
	 * 
	 * @return True if request should be restored from history store.
	 */
	public boolean isHistory() {
		return history;
	}

	/**
	 * 
	 * @return True if request should be restored from project data for selected
	 *         endpoint.
	 */
	public boolean isProjectsEndpoint() {
		return projectsEndpoint;
	}
	/**
	 * 
	 * @return True if request data comes from GDrive.
	 */
	public boolean isGdrive() {
		return gdrive;
	}

	/**
	 * 
	 * @return True if request has been saved as a regulr request without
	 *         project information in it.
	 */
	public boolean isSaved() {
		return saved;
	}

	/**
	 * 
	 * @return True if request has been requested from external source like
	 *         WebIntent, External Event (@todo) or from external extension via
	 *         message passing.
	 */
	public boolean isExternal() {
		return external;
	}

	public String getEntryId() {
		return entryId;
	}

	public String getToken() {
		return placeToken;
	}
	
	/**
	 * @return true if it is a create action
	 */
	public boolean isCreate() {
		return create;
	}



	public static class Tokenizer implements PlaceTokenizer<RequestPlace> {

		@Override
		public String getToken(RequestPlace place) {
			return place.getToken();
		}

		@Override
		public RequestPlace getPlace(String token) {
			return new RequestPlace(token);
		}

		/**
		 * Create {@link RequestPlace} for item from history.
		 * 
		 * @param historyId
		 * @return {@link RequestPlace} recognizable as restored from history
		 *         request
		 */
		public static RequestPlace fromHistory(int historyId) {
			return new RequestPlace("history/" + historyId);
		}

		/**
		 * Create {@link RequestPlace} for project with default endpoint.
		 * 
		 * @param projectsId
		 * @return
		 */
		public static RequestPlace fromProjectDefault(int projectsId) {
			return new RequestPlace("project/" + projectsId);
		}

		/**
		 * Create {@link RequestPlace} for project with selected endpoint.
		 * 
		 * @param projectsEndpointId
		 * @return
		 */
		public static RequestPlace fromProject(int projectsEndpointId) {
			return new RequestPlace("projectEndpoint/" + projectsEndpointId);
		}

		/**
		 * Create {@link RequestPlace} for request saved without project.
		 * 
		 * @param savedId
		 * @return
		 */
		public static RequestPlace fromSaved(int savedId) {
			return new RequestPlace("saved/" + savedId);
		}

		/**
		 * Create {@link RequestPlace} for request called from external source.
		 * It can be external extension via message passing system from
		 * background page or from event fired from external source.
		 * 
		 * @param source
		 * @return
		 */
		public static RequestPlace fromExternal(String source) {
			return new RequestPlace("external/" + source);
		}
		
		/**
		 * Create {@link RequestPlace} for request saved without project.
		 * 
		 * @param savedId
		 * @return
		 */
		public static RequestPlace fromDriveFile(String fileId) {
			return new RequestPlace("gdrive/" + fileId);
		}
	}
}
