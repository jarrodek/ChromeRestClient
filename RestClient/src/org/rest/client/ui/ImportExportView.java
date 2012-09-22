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

import org.rest.client.importparser.ImportResult;

import com.google.gwt.core.client.Callback;
import com.google.gwt.place.shared.Place;
import com.google.gwt.user.client.ui.IsWidget;

public interface ImportExportView extends IsWidget {
	
	public interface StringCallback {
		void onResult(String result);
	}
	
	
	/**
	 * Presenter interface
	 * @author Paweł Psztyć
	 *
	 */
	public interface Presenter {
		/**
		 * Change place
		 * @param place
		 */
		void goTo(Place place);
		/**
		 * Prepare request data to be exported. 
		 */
		void prepareDataToFile(StringCallback callback);
		/**
		 * Creates a download URL for this data in browser's filesystem
		 * @param data Data to be stored
		 * @return
		 */
		String createDownloadData(String data);
		/**
		 * Revoke previously created file via {@link #createDownloadData(String)}
		 * @param url
		 */
		void revokeDownloadData();
		/**
		 * Save imported data.
		 * @param data
		 */
		void saveImportedFileData(ImportResult data, Callback<Boolean, Void> callback);
		
		/**
		 * For old store system.
		 */
		String getApplicationUserId();
		/**
		 * For old store system.
		 * Call activity action to store current data. 
		 */
		void serverStoreAction();
		void doServerImport(String[] keys);
	}
	/**
	 * Sets presenter for this view
	 * @param listener
	 */
	void setPresenter(Presenter listener);
	
	void setIsUserView();
	void setIsNotUserView();
	void serverControlsSetEnabled(boolean enabled);
}
