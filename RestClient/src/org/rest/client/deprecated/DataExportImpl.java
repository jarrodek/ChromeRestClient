package org.rest.client.deprecated;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map.Entry;

import org.rest.client.RestClient;
import org.rest.client.event.StoreDataEvent;
import org.rest.client.storage.websql.ExportedDataInsertItem;
import org.rest.client.ui.desktop.StatusNotification;

import com.allen_sauer.gwt.log.client.Log;
import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.VoidCallback;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;
import com.google.web.bindery.event.shared.EventBus;

public class DataExportImpl extends DataExport {
	
	@Override
	public void synch() {
		assert eventBus != null : "EventBus has not been initialized for data export";
		
		prepareExportData(new PrepareDataHanler() {
			@Override
			public void onPrepare(JSONObject data) {
				ExportRequest.export(data, new ExportCallback() {
					
					@Override
					public void onSuccess(HashMap<Integer, String> result) {
						List<ExportedDataInsertItem> databaseSave = new ArrayList<ExportedDataInsertItem>();
						for(int _i : includeList){
							
							if(!result.containsKey(_i)){
								continue;
							}
							
							ExportedDataInsertItem _insert = new ExportedDataInsertItem(result.get(_i));
							_insert.setType("form");
							_insert.setReferenceId(_i);
							databaseSave.add(_insert);
						}
						RestClient.getClientFactory().getExportedDataReferenceService().insertExported(databaseSave, new VoidCallback() {
							@Override
							public void onFailure(DataServiceException error) {
								includeList.clear();
							}
							@Override
							public void onSuccess() {
								includeList.clear();
							}
						});
						eventBus.fireEvent(new StoreDataEvent(true));
					}
					
					@Override
					public void onNotLoggedIn() {
						eventBus.fireEvent(new StoreDataEvent(false));
						StatusNotification.notify("You are not connected to application server", StatusNotification.TYPE_ERROR);
					}
					
					@Override
					public void onFailure(String message, Throwable throwable) {
						eventBus.fireEvent(new StoreDataEvent(false));
						StatusNotification.notify(message, StatusNotification.TYPE_ERROR);
					}
				});
			}
			
			@Override
			public void onEmptyData() {
				eventBus.fireEvent(new StoreDataEvent(true));
				StatusNotification.notify("All data already on server", StatusNotification.TYPE_NORMAL);
			}
		});
	}
	
	@Override
	public
	void setEventBus(EventBus eventBus) {
		this.eventBus = eventBus;
	}

	@Override
	public void exportItem(RestForm item, final ExportItemCallback callback) {
		JSONObject data = new JSONObject();
		JSONArray arr = new JSONArray();
		JSONObject jsonValue = item.toJSON();
		jsonValue.put("i", new JSONNumber(item.getId()));
		arr.set(0, jsonValue);
		data.put("d", arr);
		data.put("i", new JSONString(RestClient.getAppId()));
		
		ExportRequest.export(data, new ExportCallback() {
			
			@Override
			public void onSuccess(HashMap<Integer, String> result) {
				if(result.size() != 1){
					callback.onFailure("Something went wrong :/ Unable to export item to server.");
					return;
				}
				Entry<Integer, String> it = result.entrySet().iterator().next();
				List<ExportedDataInsertItem> databaseSave = new ArrayList<ExportedDataInsertItem>();
				ExportedDataInsertItem _insert = new ExportedDataInsertItem(it.getValue());
				_insert.setType("form");
				_insert.setReferenceId(it.getKey());
				databaseSave.add(_insert);
				RestClient.getClientFactory().getExportedDataReferenceService().insertExported(databaseSave, new VoidCallback() {
					@Override
					public void onFailure(DataServiceException error) {
						if(RestClient.isDebug()){
							Log.error("Unable to save exported values to database: " + error.getMessage(), error);
						}
					}
					@Override
					public void onSuccess() {
						if(RestClient.isDebug()){
							Log.debug("Insert into exported values.");
						}
					}
				});
				
				callback.onSuccess(_insert);
			}
			
			@Override
			public void onNotLoggedIn() {
				callback.onFailure("You are not connected to application server");
			}
			
			@Override
			public void onFailure(String message, Throwable throwable) {
				callback.onFailure(message);
			}
		});
	}
	
}
