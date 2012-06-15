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
package org.rest.client.activity;

import org.rest.client.ClientFactory;
import org.rest.client.RestClient;
import org.rest.client.place.JSONHeadersPlace;
import org.rest.client.ui.JSONHeadersView;
import org.rest.client.ui.desktop.StatusNotification;
import org.rest.client.util.JSONHeadersUtils;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.Callback;
import com.google.gwt.user.client.ui.AcceptsOneWidget;
import com.google.web.bindery.event.shared.EventBus;

/**
 * Activities typically restore state ("wake up"), perform initialization
 * ("set up"), and load a corresponding UI ("show up")
 * 
 * @author Paweł Psztyć
 * 
 */
public class JSONHeadersActivity extends AppActivity implements
		JSONHeadersView.Presenter {

	
	@SuppressWarnings("unused")
	final private JSONHeadersPlace place;
	@SuppressWarnings("unused")
	private EventBus eventBus;
	JSONHeadersView view;
	
	public JSONHeadersActivity(JSONHeadersPlace place, ClientFactory clientFactory) {
		super(clientFactory);
		this.place = place;
	}

	@Override
	public void start(AcceptsOneWidget panel, com.google.gwt.event.shared.EventBus eventBus) {
		this.eventBus = eventBus;
		super.start(panel, eventBus);
		
		view = clientFactory.getJSONHeadersView();
		view.setPresenter(this);
		panel.setWidget(view.asWidget());
		
		JSONHeadersUtils.getJSONHeadersList(new Callback<String[], Throwable>() {
			
			@Override
			public void onSuccess(String[] result) {
				view.setHeadersList(result);
			}
			
			@Override
			public void onFailure(Throwable reason) {
				StatusNotification.notify("Unable to get JSON headers list :(",StatusNotification.TYPE_ERROR, StatusNotification.TIME_MEDIUM);
				if(RestClient.isDebug()){
					Log.debug("Unable to get JSON headers list.", reason);
				}
			}
		});
	}

	@Override
	public void addHeader(final String jsonHeader) {
		JSONHeadersUtils.getJSONHeadersList(new Callback<String[], Throwable>() {
			
			@Override
			public void onSuccess(String[] result) {
				int length = result.length;
				String[] newArray = new String[length+1];
				int i = 0;
				for( ; i<length; i++){
					newArray[i] = result[i];
				}
				newArray[i] = jsonHeader;
				JSONHeadersUtils.store(newArray, new Callback<Boolean, Throwable>() {
					@Override
					public void onSuccess(Boolean result) {
						view.onSavedHeader(jsonHeader);
					}
					
					@Override
					public void onFailure(Throwable reason) {
						StatusNotification.notify("Unable to save new JSON headers list :(",StatusNotification.TYPE_ERROR, StatusNotification.TIME_MEDIUM);
						if(RestClient.isDebug()){
							Log.debug("Unable to save JSON headers list.", reason);
						}
					}
				});
			}
			
			@Override
			public void onFailure(Throwable reason) {
				StatusNotification.notify("Unable to save new JSON headers list :(",StatusNotification.TYPE_ERROR, StatusNotification.TIME_MEDIUM);
				if(RestClient.isDebug()){
					Log.debug("Unable to get JSON headers list.", reason);
				}
			}
		});
	}

	@Override
	public void removeHeader(final String jsonHeader) {
		JSONHeadersUtils.getJSONHeadersList(new Callback<String[], Throwable>() {
			
			@Override
			public void onSuccess(String[] result) {
				int length = result.length;
				String[] newArray = new String[length-1];
				
				int pointer = 0;
				for(int i=0; i<length; i++){
					if(result[i].equals(jsonHeader)){
						pointer = -1;
						continue;
					}
					try{
					newArray[i] = result[i-pointer];
					}catch(IndexOutOfBoundsException e){}
				}
				
				JSONHeadersUtils.store(newArray, new Callback<Boolean, Throwable>() {
					@Override
					public void onSuccess(Boolean result) {
						
					}
					
					@Override
					public void onFailure(Throwable reason) {
						StatusNotification.notify("Unable to save new JSON headers list :(",StatusNotification.TYPE_ERROR, StatusNotification.TIME_MEDIUM);
						if(RestClient.isDebug()){
							Log.debug("Unable to save JSON headers list.", reason);
						}
					}
				});
			}
			
			@Override
			public void onFailure(Throwable reason) {
				StatusNotification.notify("Unable to save new JSON headers list :(",StatusNotification.TYPE_ERROR, StatusNotification.TIME_MEDIUM);
				if(RestClient.isDebug()){
					Log.debug("Unable to get JSON headers list.", reason);
				}
			}
		});
	}
}
