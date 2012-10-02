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

import com.google.gwt.chrome.manifest.ManifestDetails;
import com.google.gwt.place.shared.Place;
import com.google.gwt.user.client.ui.IsWidget;
/**
 * View for "About application" place
 * @author jarrod
 *
 */
public interface AboutView extends IsWidget {
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
	}
	/**
	 * Sets presenter for this view
	 * @param listener
	 */
	void setPresenter(Presenter listener);
	/**
	 * Present data from manifest file. 
	 * @param manifest
	 */
	void setManifest(ManifestDetails manifest);
}
