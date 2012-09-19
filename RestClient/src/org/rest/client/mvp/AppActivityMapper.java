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
package org.rest.client.mvp;

import org.rest.client.ClientFactory;
import org.rest.client.activity.AboutActivity;
import org.rest.client.activity.HistoryActivity;
import org.rest.client.activity.ImportExportActivity;
import org.rest.client.activity.RequestActivity;
import org.rest.client.activity.SavedActivity;
import org.rest.client.activity.SettingsActivity;
import org.rest.client.activity.ShortcutActivity;
import org.rest.client.place.AboutPlace;
import org.rest.client.place.HistoryPlace;
import org.rest.client.place.ImportExportPlace;
import org.rest.client.place.RequestPlace;
import org.rest.client.place.SavedPlace;
import org.rest.client.place.SettingsPlace;
import org.rest.client.place.ShortcutPlace;

import com.google.gwt.activity.shared.Activity;
import com.google.gwt.activity.shared.ActivityMapper;
import com.google.gwt.place.shared.Place;

public class AppActivityMapper implements ActivityMapper {

	private ClientFactory clientFactory;
	
	/**
	 * AppActivityMapper associates each Place with its corresponding
	 * {@link Activity}
	 * 
	 * @param clientFactory
	 *            Factory to be passed to activities
	 */
	public AppActivityMapper(ClientFactory clientFactory) {
		super();
		this.clientFactory = clientFactory;
	}
	/**
	 * Map each Place to its corresponding Activity. This would be a great use
	 * for GIN.
	 */
	@Override
	public Activity getActivity(Place place) {
		if (place instanceof RequestPlace){
			return new RequestActivity((RequestPlace) place, clientFactory);
		} else if (place instanceof AboutPlace){
			return new AboutActivity((AboutPlace)place, clientFactory);
		} else if (place instanceof SettingsPlace){
			return new SettingsActivity((SettingsPlace)place, clientFactory);
		} else if (place instanceof ShortcutPlace){
			return new ShortcutActivity((ShortcutPlace)place, clientFactory);
		} else if(place instanceof HistoryPlace){
			return new HistoryActivity((HistoryPlace)place, clientFactory);
		} else if(place instanceof SavedPlace){
			return new SavedActivity((SavedPlace)place, clientFactory);
		} else if (place instanceof ImportExportPlace){
			return new ImportExportActivity((ImportExportPlace)place, clientFactory);
		}
		return null;
	}

}
