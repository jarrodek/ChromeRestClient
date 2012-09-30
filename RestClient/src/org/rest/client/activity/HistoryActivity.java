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

import java.util.List;

import org.rest.client.ClientFactory;
import org.rest.client.RestClient;
import org.rest.client.event.ClearHistoryEvent;
import org.rest.client.place.HistoryPlace;
import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.store.objects.HistoryObject;
import org.rest.client.ui.HistoryView;
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
public class HistoryActivity extends AppActivity implements
		HistoryView.Presenter {

	
	@SuppressWarnings("unused")
	final private HistoryPlace place;
	private EventBus eventBus;
	private HistoryView view = null;
	private int displayedItems = 0;
	private boolean hasMoreItems = true;
	private boolean initialize = true;
	private final static int PAGE_SIZE = 30;
	private boolean gettingNextPage = false;
	
	public HistoryActivity(HistoryPlace place, ClientFactory clientFactory) {
		super(clientFactory);
		this.place = place;
	}

	@Override
	public void start(AcceptsOneWidget panel, com.google.gwt.event.shared.EventBus eventBus) {
		this.eventBus = eventBus;
		super.start(panel, eventBus);
		
		view = clientFactory.getHistoryView();
		view.setPresenter(this);
		panel.setWidget(view.asWidget());
		getNextItemsPage();
	}

	@Override
	public void getNextItemsPage() {
		if(gettingNextPage){
			return;
		}
		gettingNextPage = true;
		if(!hasMoreItems){
			view.setNoMoreItems();
			return;
		}
		
		clientFactory.getHistoryRequestStore().historyList(PAGE_SIZE, displayedItems, new StoreResultCallback<List<HistoryObject>>() {
			
			@Override
			public void onSuccess(List<HistoryObject> result) {
				int len = result.size();
				displayedItems += len;
				if(len < PAGE_SIZE){
					hasMoreItems = false;
					view.setNoMoreItems();
				}
				gettingNextPage = false;
				if(len>0 || initialize)
					view.setHistory(result);
				initialize = false;
			}
			
			@Override
			public void onError(Throwable e) {
				gettingNextPage = false;
				if(RestClient.isDebug()){
					Log.error("Database error. Unable read history data.", e);
				}
				StatusNotification.notify("Database error. Unable read history data.", StatusNotification.TYPE_ERROR);
				initialize = false;
			}
		});
	}

	@Override
	public void removeFromeHistory(int historyId) {
		
	}

	@Override
	public void onHistoryItemSelect(int historyId, final Callback<HistoryObject, Throwable> callback) {
		RestClient.getClientFactory().getHistoryRequestStore().getHistoryItem(historyId, new StoreResultCallback<HistoryObject>() {
			
			@Override
			public void onSuccess(HistoryObject result) {
				callback.onSuccess(result);
			}
			
			@Override
			public void onError(Throwable e) {
				callback.onFailure(e);
			}
		});
	}

	@Override
	public void onClearHistory() {
		RestClient.getClientFactory().getHistoryRequestStore().deleteHistory(new StoreResultCallback<Boolean>() {
			
			@Override
			public void onSuccess(Boolean result) {
				ClearHistoryEvent ev = new ClearHistoryEvent();
				eventBus.fireEvent(ev);
			}
			
			@Override
			public void onError(Throwable e) {
				if(RestClient.isDebug()){
					Log.error("Unable to clear history data.", e);
				}
				StatusNotification.notify("Unable to clear history data :(", StatusNotification.TYPE_ERROR);
			}
		});
	}
	
	
}
