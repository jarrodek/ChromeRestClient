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
import org.rest.client.request.RequestImportListItem;

import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.JsArray;
import com.google.gwt.file.client.File;
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
		/**
		 * Handle file import.
		 * @param file File selected by the user.
		 */
		void importFromFile(File file);
		/**
		 * To be called when user click on "download" button in server section.
		 * @param Uid of the user on which download the data. Set "me" for current user.
		 */
		void requestImportSuggestions(String uid);
	}
	/**
	 * Sets presenter for this view
	 * @param listener
	 */
	void setPresenter(Presenter listener);
	
	void setIsUserView();
	void setIsNotUserView();
	/**
	 * Reset the server import / export view in case of error.
	 */
	void resetServerView();
	/**
	 * After import file parse, show import confirmation table 
	 * @param result
	 */
	void showImportTable(ImportResult result);
	/**
	 * Reset import data view to original state.
	 */
	void resetImportView();
	/**
	 * Reset export data view to the original state
	 */
	void resetExportView();
	/**
	 * Display a view where the user can choose the data that he want to import.
	 * @param items
	 */
	void showServerImportTable(JsArray<RequestImportListItem> items);
	/**
	 * Update share link when session data arrive.
	 */
	void updateShareLink();
}
