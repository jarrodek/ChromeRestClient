package com.restclient.client.tasks;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.storage.client.Storage;
import com.restclient.client.RestApp;

/**
 * Task to perform app update (like headers list to DB).
 * @author Paweł Psztyć
 *
 */
public class UpdateTask implements LoadTask {
	
	TasksCallback callback;
	final Storage storage = Storage.getLocalStorageIfSupported();
	
	@Override
	public void run(TasksCallback callback, boolean lastRun) {
		if(RestApp.isDebug()){
			Log.debug("Start task: Update app values.");
		}
		this.callback = callback;
		
		updateDefaultJSONHeadersList();
	}
	
	@Override
	public int getTasksCount() {
		return 1;
	}
	
	private void updateDefaultJSONHeadersList(){
		String values = storage.getItem(RestApp.StorageKeys.JSON_HEADERS);
		if(values == null || values.equals("")){
			JSONArray data = new JSONArray();
			JSONString header1 = new JSONString("application/json");
			JSONString header2 = new JSONString("text/json");
			JSONString header3 = new JSONString("text/x-json");
			data.set(data.size(), header1);
			data.set(data.size(), header2);
			data.set(data.size(), header3);
			try{
				storage.setItem(RestApp.StorageKeys.JSON_HEADERS, data.toString());
				callback.onInnerTaskFinished();
				callback.onSuccess();
			} catch(Exception e){
				callback.onFailure(1);
			}
		} else {
			callback.onInnerTaskFinished();
			callback.onSuccess();
		}
	}
	
}
