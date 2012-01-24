package com.restclient.client;

import java.util.ArrayList;
import java.util.List;

import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.VoidCallback;
import com.google.gwt.json.client.JSONObject;
import com.google.web.bindery.event.shared.EventBus;
import com.restclient.client.event.StoreDataEvent;
import com.restclient.client.request.ExportCallback;
import com.restclient.client.request.ExportRequest;
import com.restclient.client.storage.ExportedDataInsertItem;

public class DataExportImpl extends DataExport {
	EventBus eventBus = null;
	
	@Override
	public void synch() {
		assert eventBus != null : "EventBus has not been initialized for data export";
		
		prepareExportData(new PrepareDataHanler() {
			@Override
			public void onPrepare(JSONObject data) {
				ExportRequest.export(data, new ExportCallback() {
					
					@Override
					public void onSuccess() {
						List<ExportedDataInsertItem> databaseSave = new ArrayList<ExportedDataInsertItem>();
						for(int _i : includeList){
							ExportedDataInsertItem _insert = new ExportedDataInsertItem();
							_insert.setType("form");
							_insert.setReferenceId(_i);
							databaseSave.add(_insert);
						}
						RestApp.EXPORT_DATA_SERVICE.insertExported(databaseSave, new VoidCallback() {
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
	void setEventBus(EventBus eventBus) {
		this.eventBus = eventBus;
	}

}
