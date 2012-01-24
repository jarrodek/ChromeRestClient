package com.restclient.client.tasks;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.allen_sauer.gwt.log.client.Log;
import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.RowIdListCallback;
import com.google.code.gwt.database.client.service.VoidCallback;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.json.client.JSONValue;
import com.google.gwt.resources.client.ResourceCallback;
import com.google.gwt.resources.client.ResourceException;
import com.google.gwt.resources.client.TextResource;
import com.google.gwt.storage.client.Storage;
import com.google.gwt.user.client.Cookies;
import com.restclient.client.RestApp;
import com.restclient.client.RestClientApp;
import com.restclient.client.event.DatabasesLoadedEvent;
import com.restclient.client.resources.AppResources;
import com.restclient.client.storage.HeaderInsertRow;
import com.restclient.client.storage.StatusCodesInsertRow;

/**
 * Task to perform initial app config.
 * @author jarrod
 *
 */
public class InitialConfigTask implements LoadTask {
	
	TasksCallback callback;
	private int dbLoaded = 0;
	private int dbLoadError = 0;
	
	@Override
	public void run(TasksCallback callback, boolean lastRun) {
		this.callback = callback;
		initTables();
	}
	
	private void createAndInitTablesTables(){
		callback.onInnerTaskFinished();
		
		final Storage storage = Storage.getLocalStorageIfSupported();
		final String initialCookie = Cookies.getCookie("initial");
		boolean isSupportDatabaseSet = false;
		if( storage == null ){
			if( initialCookie != null ){
				String[] data = initialCookie.split("|");
				if( data.length > 0 ){
					isSupportDatabaseSet = Boolean.parseBoolean(data[0]);
				}
			}
		} else {
			String initValue = storage.getItem("databaseSet");
			if( initValue != null ){
				isSupportDatabaseSet = Boolean.parseBoolean(initValue);
			}
		}
		
		if(isSupportDatabaseSet){
			callback.onInnerTaskFinished();
			callback.onInnerTaskFinished();
			callback.onSuccess();
		} else {
			createSupportData();
		}
	}

	@Override
	public int getTasksCount() {
		return 3;
	}
	
	private void initTables() {
		
		RestApp.HEADERS_SERVICE.initTable(new VoidCallback() {
			@Override
			public void onFailure(DataServiceException error) {
				dbLoadError++;
				dbLoadCallback();
			}
			@Override
			public void onSuccess() {
				dbLoaded++;
				dbLoadCallback();
			}
		});
		RestApp.STATUSES_SERVICE.initTable(new VoidCallback() {
			@Override
			public void onFailure(DataServiceException error) {
				dbLoadError++;
				dbLoadCallback();
			}
			@Override
			public void onSuccess() {
				dbLoaded++;
				dbLoadCallback();
			}
		});
		RestApp.URLS_SERVICE.initTable(new VoidCallback() {
			@Override
			public void onFailure(DataServiceException error) {
				dbLoadError++;
				dbLoadCallback();
			}
			@Override
			public void onSuccess() {
				dbLoaded++;
				dbLoadCallback();
			}
		});
		RestApp.FORM_SERVICE.initTable(new VoidCallback() {
			@Override
			public void onFailure(DataServiceException error) {
				dbLoadError++;
				dbLoadCallback();
			}
			@Override
			public void onSuccess() {
				dbLoaded++;
				dbLoadCallback();
			}
		});
		RestApp.EXPORT_DATA_SERVICE.initTable(new VoidCallback() {
			
			@Override
			public void onFailure(DataServiceException error) {
				dbLoadError++;
				dbLoadCallback();
			}
			
			@Override
			public void onSuccess() {
				dbLoaded++;
				dbLoadCallback();
			}
		});
	}
	
	private void dbLoadCallback(){
		if( dbLoadError + dbLoaded >= 5 ){ // all loaded (or not)
			createAndInitTablesTables();
			DatabasesLoadedEvent event = new DatabasesLoadedEvent( dbLoadError == 0 );
			RestClientApp.getAppMainEventBus().fireEventFromSource(event, InitialConfigTask.class);
		}
	}
	
	@SuppressWarnings("javadoc")
	public void createSupportData() {
		try {
			loadHeaders();
		} catch (ResourceException e) {
		}
	}

	private void loadHeaders() throws ResourceException {
		AppResources.INSTANCE.asyncStatus().getText(new ResourceCallback<TextResource>() {
			@Override
			public void onError(ResourceException e) {
				callback.onFailure(2);
			}

			@Override
			public void onSuccess(TextResource resource) {
				String json = resource.getText();
				JSONValue data = JSONParser.parseLenient(json);
				final JSONObject obj = data.isObject();
				if (obj == null) {
					callback.onFailure(2);
					return;
				}

				if (obj.containsKey("requests")) {
					JSONArray array = obj.get("requests").isArray();
					if (array != null) {
						parseHeadersArray(array, "request");
					}
					
				}
				if (obj.containsKey("responses")) {
					JSONArray array = obj.get("responses").isArray();
					if (array != null) {
						parseHeadersArray(array, "response");
					}
				}

				if (obj.containsKey("codes")) {
					JSONArray array = obj.get("codes").isArray();
					if (array != null) {
						parseCodesArray(array);
					}
				}
				
				final Storage storage = Storage.getLocalStorageIfSupported();
				final String initialCookie = Cookies.getCookie("initial");
				if( storage == null ){
					String cookieSave = "";
					if( initialCookie != null ){
						String[] cookieData = initialCookie.split("|");
						if( cookieData.length > 0 ){
							cookieData[0] = "true";
						}
						for( String _d : cookieData ){
							cookieSave += _d + "|";
							cookieSave = cookieSave.substring(0, cookieSave.length()-1);
						}
					} else {
						cookieSave = "true|";
					}
					Date d = new Date();
					long now = d.getTime();
					//30 days is: 2592000s 
					long plus30days = now + 259200000;
					d.setTime(plus30days);
					Cookies.setCookie("initial", cookieSave, d);
				} else {
					storage.setItem("databaseSet","true");	
				}
				callback.onInnerTaskFinished();
				callback.onSuccess();
			}}
		);
	}
	
	protected void parseCodesArray(JSONArray array) {
		int cnt = array.size();
		List<StatusCodesInsertRow> toSave = new ArrayList<StatusCodesInsertRow>();
		for (int i = 0; i < cnt; i++) {
			JSONObject obj = array.get(i).isObject();
			if (obj == null)
				continue;
			JSONNumber codeJson = obj.get("key").isNumber();
			JSONString descJson = obj.get("desc").isString();
			JSONString labelJson = obj.get("label").isString();

			if (codeJson == null || descJson == null || labelJson == null) {
				continue;
			}
			Integer key = Integer.parseInt(codeJson.toString());
			String desc = descJson.stringValue();
			String label = labelJson.stringValue();
			StatusCodesInsertRow row = new StatusCodesInsertRow();
			row.setCode(key).setDesc(desc).setLabel(label);
			toSave.add(row);
		}
		if (toSave.size() > 0) {
			RestApp.STATUSES_SERVICE.insertCodes(toSave, new RowIdListCallback() {
				@Override
				public void onFailure(DataServiceException error) {
					if( RestApp.isDebug() ){
						Log.error("Error save statuses to database.", error);
					}
				}
				@Override
				public void onSuccess(List<Integer> rowIds) {}
			});
		}
	}
	
	/**
	 * Parse headers from resource file and insert it's content to database.
	 * 
	 * @param array
	 *            Data array from file
	 * @param headerService
	 *            Database service service
	 * @param type
	 *            request or response
	 */
	private void parseHeadersArray(JSONArray array, final String type) {
		int cnt = array.size();
		List<HeaderInsertRow> toSave = new ArrayList<HeaderInsertRow>();
		for (int i = 0; i < cnt; i++) {
			JSONObject obj = array.get(i).isObject();
			if (obj == null)
				continue;
			JSONString keyJson = obj.get("key").isString();
			JSONString descJson = obj.get("desc").isString();
			JSONString exampleJson = obj.get("example").isString();
			if (keyJson == null || descJson == null || exampleJson == null) {
				continue;
			}

			String key = keyJson.stringValue();
			String desc = descJson.stringValue();
			String example = exampleJson.stringValue();
			HeaderInsertRow row = new HeaderInsertRow();
			row.setName(key).setDesc(desc).setExample(example).setType(type);
			toSave.add(row);
		}
		if (toSave.size() > 0) {
			RestApp.HEADERS_SERVICE.insertHeaders(toSave, new RowIdListCallback() {
				@Override
				public void onFailure(DataServiceException error) {
					if( RestApp.isDebug() ){
						Log.error("Error save headers data to database.", error);
					}
				}

				@Override
				public void onSuccess(List<Integer> rowIds) {}
			});
		}
	}
}
