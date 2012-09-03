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
import org.rest.client.place.SettingsPlace;
import org.rest.client.request.RequestsHistory;
import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.store.LocalStore;
import org.rest.client.ui.SettingsView;
import org.rest.client.ui.desktop.StatusNotification;

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
public class SettingsActivity extends AppActivity implements
	SettingsView.Presenter {

	
	@SuppressWarnings("unused")
	final private SettingsPlace place;
	@SuppressWarnings("unused")
	private EventBus eventBus;
	
	LocalStore localStore;

	public SettingsActivity(SettingsPlace place, ClientFactory clientFactory) {
		super(clientFactory);
		this.place = place;
	}

	@Override
	public void start(AcceptsOneWidget panel, com.google.gwt.event.shared.EventBus eventBus) {
		this.eventBus = eventBus;
		super.start(panel, eventBus);
		
		final SettingsView view = clientFactory.getSettingsView();
		view.setPresenter(this);
		panel.setWidget(view.asWidget());
		
		
		localStore = clientFactory.getLocalStore();
		localStore.open(new StoreResultCallback<Boolean>() {
			@Override
			public void onSuccess(Boolean result) {
				if(!result) return;
				
				updateView(view);
			}
			
			@Override
			public void onError(Throwable e) {
				
			}
		});
		
	}

	protected void updateView(final SettingsView view) {
		localStore.getByKey(LocalStore.DEBUG_KEY, new StoreResultCallback<String>() {
			@Override
			public void onSuccess(String result) {
				if(result != null && result.equals("true")){
					view.setDebugEnabled(true);
				} else {
					view.setDebugEnabled(false);
				}
			}
			@Override
			public void onError(Throwable e) {
				view.setDebugEnabled(false);
			}
		});
		localStore.getByKey(LocalStore.HISTORY_KEY, new StoreResultCallback<String>() {
			@Override
			public void onSuccess(String result) {
				if(result == null || result.isEmpty()){
					result = "true";
				}
				if(result.equals("true")){
					view.setHistoryEnabled(true);
				} else {
					view.setHistoryEnabled(false);
				}
			}
			@Override
			public void onError(Throwable e) {
				view.setHistoryEnabled(false);
			}
		});
		localStore.getByKey(LocalStore.HISTORY_AMOUNT, new StoreResultCallback<String>() {
			@Override
			public void onSuccess(String result) {
				if(result == null || result.isEmpty()){
					result = "500";
					localStore.put(result, LocalStore.HISTORY_AMOUNT, new StoreResultCallback<String>() {
						@Override
						public void onSuccess(String result) {}
						@Override
						public void onError(Throwable e) {}
					});
				}
				int resultIntValue = 500;
				try{
					resultIntValue = Integer.parseInt(result);
				} catch( NumberFormatException e ){}
				
				view.setHistoryLimit(resultIntValue);
			}
			@Override
			public void onError(Throwable e) {
				view.setHistoryLimit(0);
			}
		});
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
	
	
	private void saveSetting(String key, String value){
		localStore.put(value, key, new StoreResultCallback<String>() {
			@Override
			public void onSuccess(String result) {
				StatusNotification.notify("Settings saved.", StatusNotification.TYPE_NORMAL, StatusNotification.TIME_ULTRA_SHORT, true);
			}
			
			@Override
			public void onError(Throwable e) {
				StatusNotification.notify("Unable to save value in local storage :(", StatusNotification.TYPE_ERROR, StatusNotification.TIME_MEDIUM, true);
				if(RestClient.isDebug()){
					Log.debug("Unable to save DEBUG value in local storage.", e);
				}
			}
		});
	}
	
	
	@Override
	public void changeDebugValue(boolean newValue) {
		saveSetting(LocalStore.DEBUG_KEY, String.valueOf(newValue));
		RestClient.setDebug(newValue);
	}

	@Override
	public void changeHistoryValue(boolean newValue) {
		saveSetting(LocalStore.HISTORY_KEY, String.valueOf(newValue));
		
		if(!newValue){
			Log.debug("Hide history");
			clientFactory.getMenuView().hideItem(2);
		} else {
			clientFactory.getMenuView().showItem(2);
		}
	}

	

	@Override
	public void changeHistoryAmmount(int newValue) {
		saveSetting(LocalStore.HISTORY_AMOUNT, String.valueOf(newValue));
	}
}
