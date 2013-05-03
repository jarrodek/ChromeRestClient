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
import java.util.Map;
import java.util.Set;

import org.rest.client.ClientFactory;
import org.rest.client.RestClient;
import org.rest.client.event.ClearHistoryEvent;
import org.rest.client.place.HistoryPlace;
import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.store.objects.HistoryObject;
import org.rest.client.ui.HistoryView;
import org.rest.client.ui.desktop.NotificationAction;
import org.rest.client.ui.desktop.StatusNotification;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.Callback;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.user.client.ui.AcceptsOneWidget;
import com.google.web.bindery.event.shared.EventBus;

/**
 * Activities typically restore state ("wake up"), perform initialization
 * ("set up"), and load a corresponding UI ("show up")
 * 
 * @author Paweł Psztyć
 * 
 */
public class HistoryActivity extends ListActivity implements
		HistoryView.Presenter {

	
	
	final private HistoryPlace place;
	private EventBus eventBus;
	private HistoryView view = null;
	private String exportFileObjectUrl = null;
	
	
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
		performQuery();
	}

	@Override
	public void getNextItemsPage() {
		current_page++;
		performQuery();
	}

	@Override
	public void removeFromeHistory(final int historyId) {
		clientFactory.getHistoryRequestStore().getByKey(historyId, new StoreResultCallback<HistoryObject>() {
			
			@Override
			public void onSuccess(final HistoryObject removedObject) {
				
				clientFactory.getHistoryRequestStore().remove(historyId, new StoreResultCallback<Boolean>() {

					@Override
					public void onSuccess(Boolean result) {
						if(result != null && result.booleanValue()){
							notifyRemoveAndRestore(removedObject);
						} else {
							StatusNotification.notify("Unknown error occured :(",StatusNotification.TYPE_ERROR, StatusNotification.TIME_MEDIUM);
						}
					}

					@Override
					public void onError(Throwable e) {
						if(RestClient.isDebug()){
							Log.error("Unable to clear history data.", e);
						}
						StatusNotification.notify("Unable to clear history data :(", StatusNotification.TYPE_ERROR, StatusNotification.TIME_MEDIUM);
					}
				});
				
			}
			
			@Override
			public void onError(Throwable e) {
				if(RestClient.isDebug()){
					Log.error("Unable to clear history data.", e);
				}
				StatusNotification.notify("Unable to clear history data :(", StatusNotification.TYPE_ERROR, StatusNotification.TIME_MEDIUM);
			}
		});
	}
	
	private void notifyRemoveAndRestore(final HistoryObject removedObject){
		NotificationAction action = new NotificationAction();
		action.name = "Undo";
		action.callback = new StatusNotification.NotificationCallback() {

			@Override
			public void onActionPerformed() {
				final HistoryObject save = HistoryObject.copyNew(removedObject);
				clientFactory.getHistoryRequestStore().put(save, null, new StoreResultCallback<Integer>() {
					
					@Override
					public void onSuccess(Integer result) {
						save.setId(result.intValue());
						ArrayList<HistoryObject> list = new ArrayList<HistoryObject>();
						list.add(save);
						
						view.appendResults(list);
					}
					
					@Override
					public void onError(Throwable e) {
						if(RestClient.isDebug()){
							Log.error("Unable to restore the request.",e);
						}
						StatusNotification.notify("Unable to restore the request :(",StatusNotification.TYPE_ERROR, StatusNotification.TIME_MEDIUM);
					}
				});
			}
			
		};
		StatusNotification.notify("The item has been deleted.",StatusNotification.TYPE_NORMAL, 30000, true, action);
	}

	@Override
	public void onHistoryItemSelect(int historyId, final Callback<HistoryObject, Throwable> callback) {
		clientFactory.getHistoryRequestStore().getByKey(historyId, new StoreResultCallback<HistoryObject>() {
			
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
		clientFactory.getHistoryRequestStore().deleteHistory(new StoreResultCallback<Boolean>() {
			
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
				StatusNotification.notify("Unable to clear history data :(", StatusNotification.TYPE_ERROR, StatusNotification.TIME_MEDIUM);
			}
		});
	}

	@Override
	public void serach(String query) {
		recentQuery = "%"+query+"%";
		current_page = 0;
		view.clearResultList();
		performQuery();
	}
	
	void performQuery(){
		
		if(fetchingNextPage){
			return;
		}
		fetchingNextPage = true;
		
		
		final String q = (recentQuery != null && recentQuery.length() > 2) ? recentQuery : null;
		int offset = current_page * PAGE_SIZE;
		clientFactory.getHistoryRequestStore().historyList(q, PAGE_SIZE, offset, new StoreResultCallback<List<HistoryObject>>() {

			@Override
			public void onSuccess(final List<HistoryObject> result) {
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
				StatusNotification.notify("Database error. Unable read history data.", StatusNotification.TYPE_ERROR, StatusNotification.TIME_MEDIUM);
			}
		});
	}

	@Override
	public void prepareExportData(final Callback<String, Exception> callback) {
		
		try{
			clientFactory.getHistoryRequestStore().all(new StoreResultCallback<Map<Integer,HistoryObject>>() {
				
				@Override
				public void onSuccess(Map<Integer, HistoryObject> map) {
					JSONArray requestsArray = new JSONArray();
					JSONArray projectsArray = new JSONArray();
					Set<Integer> keys = map.keySet();
					for(Integer _k : keys){
						HistoryObject history = map.get(_k);
						requestsArray.set(requestsArray.size(), history.toJSONObject());
					}
					JSONObject result = new JSONObject();
					result.put("projects", projectsArray);
					result.put("requests", requestsArray);
					
					callback.onSuccess(createDownloadData(result.toString()));
				}
				
				@Override
				public void onError(Throwable e) {
					callback.onFailure(new Exception(e.getMessage()));
				}
			});
		} catch (Exception e){
			callback.onFailure(e);
		}
		
		
	}
	public String createDownloadData(String data) {
		if(exportFileObjectUrl != null){
			revokeDownloadData();
		}
		exportFileObjectUrl = createDownloadDataImpl(data); 
		return exportFileObjectUrl;
	}
	
	private final native String createDownloadDataImpl(String data) /*-{
		var blob = new $wnd.Blob([data], {type: 'application/json'});
		return $wnd.URL.createObjectURL(blob);
	}-*/;
	
	@Override
	public void revokeDownloadData() {
		if(exportFileObjectUrl != null){
			revokeDownloadDataImpl(exportFileObjectUrl);
			exportFileObjectUrl = null;
		}
	}
	private final native void revokeDownloadDataImpl(String url) /*-{
		$wnd.URL.revokeObjectURL(url);
	}-*/;
	
	@Override
	public String mayStop() {
		revokeDownloadData();
		return super.mayStop();
	}
}
