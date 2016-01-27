package org.rest.client.deprecated;

import java.util.HashMap;
import java.util.Map.Entry;

import org.rest.client.RestClient;
import org.rest.client.StatusNotification;
import org.rest.client.event.StoreDataEvent;
import org.rest.client.jso.ExportedDataItem;
import org.rest.client.log.Log;
import org.rest.client.storage.store.ExportedWebSql;

import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.JsArray;
import com.google.gwt.core.client.JsArrayInteger;
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
						@SuppressWarnings("unchecked")
						JsArray<ExportedDataItem> databaseSave = (JsArray<ExportedDataItem>) JsArray.createArray();
						for (int _i : includeList) {
							if (!result.containsKey(_i)) {
								continue;
							}
							ExportedDataItem _insert = ExportedDataItem.create();
							_insert.setAppEngineKey(result.get(_i));
							_insert.setType("form");
							_insert.setReferenceId(_i);
							databaseSave.set(databaseSave.length(), _insert);
						}
						RestClient.getClientFactory().getExportedStore().insertExported(databaseSave,
								new ExportedWebSql.StoreInsertListCallback() {
							@Override
							public void onError(Throwable e) {
								includeList.clear();
							}

							@Override
							public void onSuccess(JsArrayInteger insertId) {
								includeList.clear();
							}
						});
						eventBus.fireEvent(new StoreDataEvent(true));
					}

					@Override
					public void onNotLoggedIn() {
						eventBus.fireEvent(new StoreDataEvent(false));
						StatusNotification.notify("You are not connected to application server",
								StatusNotification.TIME_MEDIUM);
					}

					@Override
					public void onFailure(String message, Throwable throwable) {
						eventBus.fireEvent(new StoreDataEvent(false));
						StatusNotification.notify(message, StatusNotification.TIME_MEDIUM);
					}
				});
			}

			@Override
			public void onEmptyData() {
				eventBus.fireEvent(new StoreDataEvent(true));
				StatusNotification.notify("All data already on server", StatusNotification.TIME_MEDIUM);
			}
		});
	}

	@Override
	public void setEventBus(EventBus eventBus) {
		this.eventBus = eventBus;
	}

	@Override
	public void exportItem(RestForm item, final ExportItemCallback callback) {
		final JSONObject data = new JSONObject();
		JSONArray arr = new JSONArray();
		JSONObject jsonValue = item.toJSON();
		jsonValue.put("i", new JSONNumber(item.getId()));
		arr.set(0, jsonValue);
		data.put("d", arr);
		
		RestClient.getAppId(new Callback<String, Throwable>() {
			
			@Override
			public void onSuccess(String result) {
				data.put("i", new JSONString(result));
				ExportRequest.export(data, new ExportCallback() {

					@Override
					public void onSuccess(HashMap<Integer, String> result) {
						if (result.size() != 1) {
							callback.onFailure("Something went wrong :/ Unable to export item to server.");
							return;
						}
						Entry<Integer, String> it = result.entrySet().iterator().next();
						
						@SuppressWarnings("unchecked")
						JsArray<ExportedDataItem> databaseSave = (JsArray<ExportedDataItem>) JsArray.createArray();
						final ExportedDataItem _insert = ExportedDataItem.create();
						_insert.setAppEngineKey(it.getValue());
						_insert.setType("form");
						_insert.setReferenceId(it.getKey());
						databaseSave.set(0, _insert);
						
						RestClient.getClientFactory().getExportedStore().insertExported(databaseSave,
								new ExportedWebSql.StoreInsertListCallback() {
							@Override
							public void onError(Throwable e) {
								if (RestClient.isDebug()) {
									Log.error("Unable to save exported values to database", e);
								}
							}
							
							@Override
							public void onSuccess(JsArrayInteger insertId) {
								if (RestClient.isDebug()) {
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
			
			@Override
			public void onFailure(Throwable reason) {
				callback.onFailure(reason.getMessage());
			}
		});		
	}

}
