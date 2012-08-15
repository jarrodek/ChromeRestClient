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


import java.util.ArrayList;
import java.util.List;

import org.rest.client.storage.websql.HeaderRow;
import org.rest.client.storage.websql.StatusCodeRow;

import com.google.gwt.core.client.Callback;
import com.google.gwt.place.shared.Place;
import com.google.gwt.user.client.ui.IsWidget;
import com.google.gwt.xhr2.client.Header;
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
		 * Get information about given status code
		 * @param code
		 */
		void getStatusCodeInfo(int code, Callback<StatusCodeRow, Throwable> callback);
		/**
		 * Get information about given response headers
		 * @param names
		 * @param callback
		 */
		void getResponseHeadersInfo(ArrayList<String> names, Callback<List<HeaderRow>, Throwable> callback);
		/**
		 * Get information about given request headers
		 * @param names
		 * @param callback
		 */
		void getRequestHeadersInfo(ArrayList<String> names, Callback<List<HeaderRow>, Throwable> callback);
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
	 * Set view data for request headers coming from background page
	 * @param headers
	 */
	void setRequestHeadersExternal(ArrayList<Header> headers);
	/**
	 * Set view data for response headers coming from background page
	 * @param headers
	 */
	void setResponseHeadersExternal(ArrayList<Header> headers);
	
	void clear();
}
