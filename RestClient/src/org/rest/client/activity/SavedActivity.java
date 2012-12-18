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

import java.util.ArrayList;
import java.util.List;

import org.rest.client.ClientFactory;
import org.rest.client.RestClient;
import org.rest.client.gdrive.DriveAuth;
import org.rest.client.gdrive.DriveCall;
import org.rest.client.place.RequestPlace;
import org.rest.client.place.SavedPlace;
import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.store.objects.RequestObject;
import org.rest.client.ui.SavedView;
import org.rest.client.ui.desktop.NotificationAction;
import org.rest.client.ui.desktop.StatusNotification;

import com.allen_sauer.gwt.log.client.Log;
import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.VoidCallback;
import com.google.gwt.user.client.ui.AcceptsOneWidget;

/**
 * Activities typically restore state ("wake up"), perform initialization
 * ("set up"), and load a corresponding UI ("show up")
 * 
 * @author Paweł Psztyć
 * 
 */
public class SavedActivity extends ListActivity implements
	SavedView.Presenter {

	
	//final private SavedPlace place;
	//private EventBus eventBus;
	private SavedView view;

	public SavedActivity(SavedPlace place, ClientFactory clientFactory) {
		super(clientFactory);
		//this.place = place;
	}

	@Override
	public void start(AcceptsOneWidget panel, com.google.gwt.event.shared.EventBus eventBus) {
		//this.eventBus = eventBus;
		super.start(panel, eventBus);
		
		view = clientFactory.getSavedView();
		view.setPresenter(this);
		panel.setWidget(view.asWidget());
		
		performQuery();
	}
	
	@Override
	public void removeFromSaved(final RequestObject request) {
		clientFactory.getRequestDataStore().remove(request.getId(), new StoreResultCallback<Boolean>(){

			@Override
			public void onSuccess(Boolean result) {
				if(result != null && result.booleanValue()){
					notifyRemoveAndRestore(request);
				} else {
					StatusNotification.notify("Unknown error occured :(",StatusNotification.TYPE_ERROR, StatusNotification.TIME_SHORT);
				}
			}

			@Override
			public void onError(Throwable e) {
				if(RestClient.isDebug()){
					Log.error("Unable remove saved request.",e);
				}
				StatusNotification.notify("Unable remove saved request :(",StatusNotification.TYPE_ERROR, StatusNotification.TIME_SHORT);
			}});
	}
	
	
	private void notifyRemoveAndRestore(final RequestObject request){
		
		NotificationAction action = new NotificationAction();
		action.name = "Undo";
		action.callback = new StatusNotification.NotificationCallback() {
			@Override
			public void onActionPerformed() {
				final RequestObject save = RequestObject.copyNew(request);
				clientFactory.getRequestDataStore().put(save, null, new StoreResultCallback<Integer>() {
					
					@Override
					public void onSuccess(Integer result) {
						
						save.setId(result.intValue());
						ArrayList<RequestObject> list = new ArrayList<RequestObject>();
						list.add(save);
						
						view.appendResults(list);
					}
					
					@Override
					public void onError(Throwable e) {
						if(RestClient.isDebug()){
							Log.error("Unable to restore the request.",e);
						}
						StatusNotification.notify("Unable to restore the request :(",StatusNotification.TYPE_ERROR, StatusNotification.TIME_SHORT);
					}
				});
			}
		}; 
		StatusNotification.notify("The Request has been deleted.",StatusNotification.TYPE_NORMAL, 30000, true, action);
	}

	@Override
	public void onClearSaved() {
		clientFactory.getRequestDataStore().getService().deleteSaved(new VoidCallback() {
			@Override
			public void onFailure(DataServiceException error) {
				
			}
			
			@Override
			public void onSuccess() {
				
			}
		});
	}

	@Override
	public void changeSavedName(String newName, int savedId) {
		clientFactory.getRequestDataStore().getService().updateName(newName, savedId, new VoidCallback() {
			
			@Override
			public void onFailure(DataServiceException error) {
				if(RestClient.isDebug()){
					Log.error("Unable to change name :(", error);
				}
				StatusNotification.notify("Unable to change name :(",StatusNotification.TYPE_ERROR, StatusNotification.TIME_SHORT);
			}
			
			@Override
			public void onSuccess() {
				
			}
		});
	}
	
	@Override
	public void getNextItemsPage(){
		current_page++;
		performQuery();
	}

	@Override
	public void serach(String query) {
		recentQuery = "%"+query+"%";
		current_page = 0;
		view.clearResultList();
		performQuery();
	}

	@Override
	void performQuery() {
		if(fetchingNextPage){
			return;
		}
		fetchingNextPage = true;
		
		
		final String q = (recentQuery != null && recentQuery.length() > 2) ? recentQuery : null;
		int offset = current_page * PAGE_SIZE;
		clientFactory.getRequestDataStore().queryWithLimit(q, PAGE_SIZE, offset, new StoreResultCallback<List<RequestObject>>() {

			@Override
			public void onSuccess(final List<RequestObject> result) {
				fetchingNextPage = false;
				if(result.size() == 0){
					view.setNoMoreItems();
					return;
				}
				view.appendResults(result);
			}

			@Override
			public void onError(Throwable e) {
				fetchingNextPage = false;
				if(RestClient.isDebug()){
					Log.error("Database error. Unable read history data.", e);
				}
				StatusNotification.notify("Database error. Unable read history data.", StatusNotification.TYPE_ERROR, StatusNotification.TIME_SHORT);
			}
		});
	}

	@Override
	public void openFromGoogleDrive() {
		DriveCall.hasSession(new DriveCall.SessionHandler() {
			@Override
			public void onResult(DriveAuth result) {
				if(result == null){
					//no logged in user
					DriveCall.auth(new DriveCall.SessionHandler() {
						@Override
						public void onResult(DriveAuth result) {
							if(result == null){
								view.setDriveButtonEnabled(true);
								return;
							}
							pickDriveArcFile(result.getAccessToken());
						}
					}, false);
					return;
				}
				pickDriveArcFile(result.getAccessToken());
			}
		});
	}
	private void pickDriveArcFile(final String accessToken){
		DriveCall.showGoogleSavedFilePickerDialog(accessToken, new DriveCall.SelectFolderHandler() {
			@Override
			public void onSelect(String fileId) {
				goTo(RequestPlace.Tokenizer.fromDriveFile(fileId));
			}

			@Override
			public void onCancel() {
				view.setDriveButtonEnabled(true);
			}});
	}
}
