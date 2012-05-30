package org.rest.client.task;

import java.util.Date;

import org.rest.client.ClientFactory;
import org.rest.client.RestClient;
import org.rest.client.load.LoadTask;
import org.rest.client.load.TasksCallback;
import org.rest.client.request.AssetRequest;
import org.rest.client.request.AssetStringCallback;
import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.store.HeadersStore;
import org.rest.client.storage.store.LocalStore;
import org.rest.client.storage.store.StatusesStore;
import org.rest.client.storage.store.objects.HeadersObject;
import org.rest.client.storage.store.objects.HttpStatusObject;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.json.client.JSONValue;

/**
 * First task is to open main database. If upgrade is needed it will perform DB
 * update at this point (first DB open call).
 * 
 * Second, test if all required data is available for application (status codes,
 * headers data). If not, download it from application server.
 * 
 * @author jarrod
 * 
 */
public class InitialConfigTask implements LoadTask {

	ClientFactory factory = RestClient.getClientFactory();
	HeadersStore headersStore;
	StatusesStore statusesStore;
	LocalStore localStore;
	TasksCallback callback = null;
	boolean lastRun;

	@Override
	public void run(TasksCallback callback, boolean lastRun) {
		this.callback = callback;
		this.lastRun = lastRun;
		openMainDatabaseAndContinue();
	}

	/**
	 * Open main database.
	 * <p>
	 * In case of failure application will not displays application regular
	 * interface. It will show error dialog instead.
	 * </p>
	 */
	private void openMainDatabaseAndContinue() {
		headersStore = factory.getHeadersStore();
		if(RestClient.isDebug()){
			Log.debug("Database is initializing...");
		}
		headersStore.open(new StoreResultCallback<Boolean>() {

			@Override
			public void onSuccess(Boolean result) {
				
				if (!result) {
					// TODO display error dialog
					if(lastRun){
						Log.error("Unable to initialize database. This is total failure.");
					}
					callback.onFailure(0);
					return;
				}
				
				if(RestClient.isDebug()){
					Log.debug("Database is initialized.");
				}
				callback.onInnerTaskFinished(1);
				checkisInitialDataAvailable();
			}

			@Override
			public void onError(Throwable e) {
				// if error drop execution of rest task, display error dialog
				// and exit.
				if(lastRun){
					Log.error("Unable to initialize database. This is total failure.",e);
				}
				// TODO: above
				callback.onFailure(0);
			}
		});
	}

	private void checkisInitialDataAvailable() {
		if(RestClient.isDebug()){
			Log.debug("Checking if application's local data is available.");
		}
		
		localStore = factory.getLocalStore();
		localStore.open(new StoreResultCallback<Boolean>() {
			@Override
			public void onSuccess(Boolean result) {
				if (!result) {
					if(RestClient.isDebug()){
						Log.error("Unable to initialize local storage...");
					}
					callback.onFailure(1);
					return;
				}
				if(RestClient.isDebug()){
					Log.debug("Get letest information update to compare to current time.");
				}
				localStore.getByKey(LocalStore.HEADERS_IMPORT_TIME_KEY,
						new StoreResultCallback<String>() {
							@Override
							public void onSuccess(String result) {
								if (result != null && !result.isEmpty()) {
									Long updateTime = Long.parseLong(result);
									if (updateTime > 0) {
										if(RestClient.isDebug()){
											Log.debug("Application data is up to date.");
										}
										callback.onInnerTaskFinished(2);
										callback.onSuccess();
										return;
									}
								}
								if(RestClient.isDebug()){
									Log.debug("Application data require update... Trying now.");
								}
								callback.onInnerTaskFinished(1);
								downloadApplicationDataFromServer();
								return;
							}

							@Override
							public void onError(Throwable e) {
								if(RestClient.isDebug()){
									Log.error("Unable to get data from LocalStorage.");
								}
								callback.onFailure(1);
							}
						});
			}

			@Override
			public void onError(Throwable e) {
				callback.onFailure(1);
			}
		});
	}

	private void downloadApplicationDataFromServer() {
		AssetRequest.getAssetString("statuses.json", new AssetStringCallback() {

			@Override
			public void onSuccess(String json) {
				JSONValue data = JSONParser.parseLenient(json);
				final JSONObject obj = data.isObject();
				if (obj == null) {
					if(RestClient.isDebug()){
						Log.error("Error download application data file. Will try next time.");
					}
					callback.onInnerTaskFinished(1);
					callback.onSuccess();
					return;
				}
				
				if(RestClient.isDebug()){
					Log.debug("Has application data. Now saving to DB.");
				}
				
				if (obj.containsKey("requests")) {
					JSONArray array = obj.get("requests").isArray();
					if (array != null) {
						if(RestClient.isDebug()){
							Log.debug("Saving request headers.");
						}
						parseHeadersArray(array, "request");
					}

				}
				if (obj.containsKey("responses")) {
					JSONArray array = obj.get("responses").isArray();
					if (array != null) {
						if(RestClient.isDebug()){
							Log.debug("Saving response headers.");
						}
						parseHeadersArray(array, "response");
					}
				}

				if (obj.containsKey("codes")) {
					JSONArray array = obj.get("codes").isArray();
					if (array != null) {
						if(RestClient.isDebug()){
							Log.debug("Saving HTTP status definitions.");
						}
						parseCodesArray(array);
					}
				}
				if(RestClient.isDebug()){
					Log.debug("App is up to date!");
				}
				
				localStore.put(String.valueOf(new Date().getTime()), LocalStore.HEADERS_IMPORT_TIME_KEY, new StoreResultCallback<String>() {
					@Override
					public void onSuccess(String result) {
						
					}
					
					@Override
					public void onError(Throwable e) {
						
					}
				});
				
				
				callback.onInnerTaskFinished(1);
				callback.onSuccess();
			}

			@Override
			public void onFailure(String message, Throwable exception) {
				Log.error("Unable to download application data. Will try next time.", exception);
				callback.onInnerTaskFinished(1);
				callback.onSuccess();
			}
		});
	}

	

	protected void parseCodesArray(JSONArray array) {
		//at this point it must be opened...
		statusesStore = factory.getStatusesStore();
		
		
		int cnt = array.size();
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
			HttpStatusObject row = HttpStatusObject.create();
			row.setCode(key.intValue());
			row.setDesc(desc);
			row.setLabel(label);
			
			statusesStore.put(row, new StoreResultCallback<Long>() {
				@Override
				public void onSuccess(Long result) {
					
				}
				
				@Override
				public void onError(Throwable e) {
					
				}
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
			HeadersObject row = HeadersObject.create();
			row.setHeader(key);
			row.setType(type);
			row.setDesc(desc);
			row.setExample(example);
			headersStore.put(row, new StoreResultCallback<Long>() {
				@Override
				public void onSuccess(Long result) {
					
				}
				@Override
				public void onError(Throwable e) {
					
				}
			});
		}
	}

	@Override
	public int getTasksCount() {
		return 3;
	}

}
