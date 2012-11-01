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
import org.rest.client.place.SavedPlace;
import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.store.objects.RequestObject;
import org.rest.client.storage.websql.RequestDataService;
import org.rest.client.ui.SavedView;
import org.rest.client.ui.desktop.NotificationAction;
import org.rest.client.ui.desktop.StatusNotification;

import com.allen_sauer.gwt.log.client.Log;
import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.ListCallback;
import com.google.code.gwt.database.client.service.VoidCallback;
import com.google.gwt.user.client.ui.AcceptsOneWidget;

/**
 * Activities typically restore state ("wake up"), perform initialization
 * ("set up"), and load a corresponding UI ("show up")
 * 
 * @author Paweł Psztyć
 * 
 */
public class SavedActivity extends AppActivity implements
	SavedView.Presenter {

	
	//final private SavedPlace place;
	//private EventBus eventBus;
	private SavedView view;
	
	private int displayedItems = 0;
	private boolean hasMoreItems = true;
	private boolean initialize = true;
	private final static int PAGE_SIZE = 15;
	private RequestDataService storeService = clientFactory.getRequestDataStore().getService();

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
		
		getNextItemsPage();
	}
	
	private boolean gettingNextPage = false;
	
	@Override
	public void getNextItemsPage(){
		if(gettingNextPage){
			return;
		}
		gettingNextPage = true;
		if(!hasMoreItems){
			view.setNoMoreItems();
			return;
		}
		storeService.getSavedRequests(PAGE_SIZE, displayedItems, new ListCallback<RequestObject>() {
			
			@Override
			public void onFailure(DataServiceException error) {
				gettingNextPage = false;
				if(RestClient.isDebug()){
					Log.error("Database error. Unable read history data.", error);
				}
				StatusNotification.notify("Database error. Unable read history data.", StatusNotification.TYPE_ERROR);
				initialize = false;
			}
			
			@Override
			public void onSuccess(List<RequestObject> result) {
				int len = result.size();
				displayedItems += len;
				if(len < PAGE_SIZE){
					hasMoreItems = false;
					view.setNoMoreItems();
				}
				gettingNextPage = false;
				
				if(len>0 || initialize)
					view.addData(result);
				initialize = false;
			}
		});
	}

	@Override
	public void removeFromSaved(final RequestObject request) {
		clientFactory.getRequestDataStore().remove(request.getId(), new StoreResultCallback<Boolean>(){

			@Override
			public void onSuccess(Boolean result) {
				if(result != null && result.booleanValue()){
					notifyRemoveAndRestore(request);
				} else {
					StatusNotification.notify("Unknown error occured :(",StatusNotification.TYPE_ERROR);
				}
			}

			@Override
			public void onError(Throwable e) {
				if(RestClient.isDebug()){
					Log.error("Unable remove saved request.",e);
				}
				StatusNotification.notify("Unable remove saved request :(",StatusNotification.TYPE_ERROR);
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
						
						view.addData(list);
					}
					
					@Override
					public void onError(Throwable e) {
						
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
	
	
}
