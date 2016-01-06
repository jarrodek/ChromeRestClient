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
package org.rest.client.ui;


import org.rest.client.jso.ResponseStatusData;

import com.google.gwt.place.shared.Place;
import com.google.gwt.user.client.ui.IsWidget;
import com.google.gwt.xhr2.client.Response;

public interface ResponseView extends IsWidget {
	/**
	 * Presenter interface
	 * @author Paweł Psztyć
	 *
	 */
	public interface ResponsePresenter {
		/**
		 * Change place
		 * @param place
		 */
		void goTo(Place place);
		/**
		 * Creates a download URL for this data in browser's filesystem
		 * @param data Data to be stored
		 * @return
		 */
		String createDownloadData(String body, String encoding);
		/**
		 * Revoke previously created file via {@link #createDownloadData(String)}
		 * @param url
		 */
		void revokeDownloadData();
		/**
		 * Perform a copy action.
		 * @param body
		 */
		void performCopyAction(String body);
	}
	/**
	 * Sets presenter for this view
	 * @param listener
	 */
	void setPresenter(ResponsePresenter listener);
	/**
	 * Set requests response data 
	 * @param success If the request is successful 
	 * @param response Response object with data
	 * @param requestTime Time in milliseconds 
	 */
	void setResponseData(boolean success, Response response, long requestTime);
	
	/**
	 * Set data that has been received from the background page
	 * @param data
	 */
	void setBackgroundResponseData(ResponseStatusData data);
}
