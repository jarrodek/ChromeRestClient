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
import org.rest.client.SyncAdapter;
import org.rest.client.chrome.LocalStorageArea;
import org.rest.client.chrome.Storage;
import org.rest.client.chrome.StorageArea.StorageSimpleCallback;
import org.rest.client.chrome.SyncStorageArea;
import org.rest.client.event.NotificationsStateChangeEvent;
import org.rest.client.place.SettingsPlace;
import org.rest.client.request.RequestsHistory;
import org.rest.client.storage.store.LocalStore;
import org.rest.client.ui.SettingsView;
import org.rest.client.ui.desktop.StatusNotification;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.Callback;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.user.client.ui.AcceptsOneWidget;
import com.google.web.bindery.event.shared.EventBus;

/**
 * Activities typically restore state ("wake up"), perform initialization
 * ("set up"), and load a corresponding UI ("show up")
 * 
 * @author Paweł Psztyć
 * 
 */
public class SettingsActivity extends AppActivity implements
	SettingsView.Presenter {

	
	@SuppressWarnings("unused")
	private EventBus eventBus;
	
	final Storage store = Storage.getStorage();
	final LocalStorageArea localStorage;
	final SyncStorageArea syncStorage;
	String latestError = null;

	public SettingsActivity(SettingsPlace place, ClientFactory clientFactory) {
		super(clientFactory);
		latestError = store.getLastError();
		localStorage = store.getLocal();
		syncStorage = store.getSync();
	}

	@Override
	public void start(AcceptsOneWidget panel, com.google.gwt.event.shared.EventBus eventBus) {
		this.eventBus = eventBus;
		super.start(panel, eventBus);
		
		final SettingsView view = clientFactory.getSettingsView();
		view.setPresenter(this);
		panel.setWidget(view.asWidget());
		
		updateView(view);
	}

	protected void updateView(final SettingsView view) {
		if(RestClient.isDebug()){
			view.setDebugEnabled(true);
		} else {
			view.setDebugEnabled(false);
		}
		
		if(RestClient.isHistoryEabled()){
			view.setHistoryEnabled(true);
		} else {
			view.setHistoryEnabled(false);
		}
		
		if(SyncAdapter.isNotifications()){
			view.setNotificationsEnabled(true);
		} else {
			view.setNotificationsEnabled(false);
		}
	}

	@Override
	public void clearHistory() {
		RequestsHistory.clearHistory(new Callback<Boolean, Throwable>() {
			@Override
			public void onSuccess(Boolean result) {
				StatusNotification.notify("History cleared.", StatusNotification.TYPE_NORMAL, StatusNotification.TIME_SHORT);
			}
			
			@Override
			public void onFailure(Throwable reason) {
				StatusNotification.notify("Unable to clear History Store.", StatusNotification.TYPE_ERROR, StatusNotification.TIME_SHORT);
			}
		});
	}
	
	
	private void saveSetting(final String key, final String value){
		
		JSONObject setObj = new JSONObject();
		setObj.put(key, new JSONString(value));
		syncStorage.set(setObj.getJavaScriptObject(), new StorageSimpleCallback() {
			@Override
			public void onDone() {
				String error = store.getLastError();
				if(error != latestError){
					latestError = error;
					StatusNotification.notify("Unable to save value in local storage :( " + error, StatusNotification.TYPE_ERROR, StatusNotification.TIME_MEDIUM, true);
					if(RestClient.isDebug()){
						Log.debug("Unable to save "+key+" value in sync storage.");
					}
					return;
				}
				StatusNotification.notify("Settings saved.", StatusNotification.TYPE_NORMAL, StatusNotification.TIME_ULTRA_SHORT, true);
				if(key.equals(LocalStore.DEBUG_KEY)){
					RestClient.setDebug(value.equals("true") ? true : false);
				} else if(key.equals(LocalStore.HISTORY_KEY)){
					if(value.equals("false")){
						clientFactory.getMenuView().hideItem(2);
					} else {
						clientFactory.getMenuView().showItem(2);
					}
				} else if(key.equals(LocalStore.NOTIFICATIONS_ENABLED_KEY)){
					clientFactory.getEventBus().fireEvent(new NotificationsStateChangeEvent(value.equals("true") ? true : false));
				}
			}
		});
	}
	
	
	@Override
	public void changeDebugValue(boolean newValue) {
		saveSetting(LocalStore.DEBUG_KEY, String.valueOf(newValue));
	}

	@Override
	public void changeHistoryValue(boolean newValue) {
		saveSetting(LocalStore.HISTORY_KEY, String.valueOf(newValue));
	}

	@Override
	public void changeNotificationsValue(boolean notificationsEnabled) {
		saveSetting(LocalStore.NOTIFICATIONS_ENABLED_KEY, String.valueOf(notificationsEnabled));
	}
}
