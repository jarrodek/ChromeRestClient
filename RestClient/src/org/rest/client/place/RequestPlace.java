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
	/**
	 * TODO: requestData should be like h_ID (history _ history ID), e_ID (Project's endpoint ID), ID (Project ID with default endpoint) or NULL if none
	 * @param requestData
	 */
	public RequestPlace(String requestData){
		if(requestData == null){
			return;
		}
		if(requestData.startsWith("h")){
			history = true;
			entryId = requestData.substring(2);
		} else if(requestData.startsWith("e")){
			projectsEndpoint = true;
			entryId = requestData.substring(2);
		} else {
			project = true;
			entryId = requestData;
		}
		this.placeToken = requestData;
	}
	
	public boolean isProject(){
		return project;
	}
	public boolean isHistory(){
		return history;
	}
	public boolean isProjectsEndpoint(){
		return projectsEndpoint;
	}
	public String getEntryId(){
		return entryId;
	}
	
	public String getToken(){
		return placeToken;
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

	}
}
