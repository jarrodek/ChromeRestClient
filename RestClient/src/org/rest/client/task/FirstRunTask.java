package org.rest.client.task;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.rest.client.ClientFactory;
import org.rest.client.RestClient;
import org.rest.client.jso.DefinitionsJso;
import org.rest.client.jso.HeaderDefinitionJso;
import org.rest.client.jso.StatusCodeDefinitionJso;
import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.store.HeadersStoreWebSql;
import org.rest.client.storage.store.StatusesStoreWebSql;
import org.rest.client.storage.websql.HeaderRow;
import org.rest.client.storage.websql.StatusCodeRow;
import org.rest.client.util.Utils;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.chrome.storage.LocalStorageArea;
import com.google.gwt.chrome.storage.Storage;
import com.google.gwt.chrome.storage.StorageArea;
import com.google.gwt.chrome.storage.StorageArea.StorageSimpleCallback;
import com.google.gwt.chrome.storage.StorageResult;
import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JsArray;
import com.google.gwt.http.client.RequestException;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.xhr2.client.LoadHandler;
import com.google.gwt.xhr2.client.ProgressEvent;
import com.google.gwt.xhr2.client.RequestBuilder;
import com.google.gwt.xhr2.client.Response;

/**
 * Task will execute itself only if it is first run. 
 * It will downloads and insert to the database headers and status codes definitions. 
 * @author Pawel Psztyc
 * 
 * @deprecated This class should be removed and initial work should be done by the background page during installation.
 */
public class FirstRunTask implements LoadTask {

	private final static String FIRST_RUN_FLAG = "firstrun";
	TasksCallback callback;
	LoaderWidget loaderWidget;
	boolean lastRun;
	ClientFactory factory = RestClient.getClientFactory();
	
	private LocalStorageArea localStorage;
	
	interface SimpleCallback {
		void onResult();
	}
	
	
	@Override
	public void run(final TasksCallback callback, boolean lastRun) {
		Storage store = GWT.create(Storage.class);
		localStorage = store.getLocal();
		this.callback = callback;
		this.lastRun = lastRun;
		
		if(loaderWidget != null){
			loaderWidget.setText("Initialize...");
		}
		
		localStorage.get(FIRST_RUN_FLAG, new StorageArea.StorageItemCallback<Double>() {
			@Override
			public void onResult(StorageResult<Double> data) {
				if(data != null){
					callback.onInnerTaskFinished(getTasksCount());
					callback.onSuccess();
					return;
				}
				callback.onInnerTaskFinished(1);
				downloadDefinitionsTask();
			}

			@Override
			public void onError(String message) {
				//TODO: !!!!FIX BEFORE NEXT RELEASE!!!!
				Log.error("Nope, something's not right :( " + message);
				callback.onInnerTaskFinished(getTasksCount());
				callback.onSuccess();
			}
		});
	}
	
	
	
	/**
	 * The app is using status codes and headers description in the UI.
	 * To lower package weight list of definitions is stored on server and downloaded during first run.
	 * @TODO: Make it local again and do not require server download. There is an issue with China users who can't download the file because of internet restrictions.
	 */
	private void downloadDefinitionsTask(){
		
		if(loaderWidget != null){
			loaderWidget.setText("Downloading definitions...");
		}
		RequestBuilder b = new RequestBuilder("/assets/definitions.json", "GET");
		b.setLoadHandler(new LoadHandler() {
			
			@Override
			public void onLoaded(Response response, ProgressEvent event) {
				loaderWidget.setText("Parsing response...");
				String txt = response.getResponseText();
				DefinitionsJso definitions = Utils.parseJSON(txt).cast();
				saveDefinitions(definitions);
			}
			
			@Override
			public void onError(Response r, Throwable exception) {
				Log.error("Couldn't download status codes definitions....", exception);
				loaderWidget.setText("Loading...");
				callback.onInnerTaskFinished(getTasksCount()-1);
				callback.onSuccess();
				return;
			}
		});
		try {
			b.send();
		} catch (RequestException e) {
			Log.error("Error calling HXR for definitions.", e);
			loaderWidget.setText("Loading...");
			callback.onInnerTaskFinished(getTasksCount()-1);
			callback.onSuccess();
		}
	}
	
	
	
	private void saveDefinitions(final DefinitionsJso definitions){
		loaderWidget.setText("Preparing headers definition data to save...");
		JsArray<HeaderDefinitionJso> requests = definitions.getRequests();
		JsArray<HeaderDefinitionJso> responses = definitions.getResponses();
		List<HeaderRow> save = new ArrayList<HeaderRow>();
		int requestSize = requests.length();
		int responseSize = requests.length();
		for(int i=0; i<requestSize; i++){
			HeaderDefinitionJso r = requests.get(i);
			HeaderRow row = HeaderRow.create(r.getKey(), r.getDesc(), r.getExample(), "request");
			save.add(row);
		}
		for(int i=0; i<responseSize; i++){
			
			HeaderDefinitionJso r = responses.get(i);
			HeaderRow row = HeaderRow.create(r.getKey(), r.getDesc(), r.getExample(), "response");
			save.add(row);
		}
		loaderWidget.setText("Saving headers definitions...");
		HeadersStoreWebSql headersStore = factory.getHeadersStore();
		headersStore.putAll(save, new StoreResultCallback<List<Integer>>() {
			@Override
			public void onSuccess(List<Integer> result) {
				saveStatusCodes(definitions.getCodes());
			}
			@Override
			public void onError(Throwable e) {
				saveStatusCodes(definitions.getCodes());
			}
		});
	}
	
	private void saveStatusCodes(JsArray<StatusCodeDefinitionJso> jsArray){
		loaderWidget.setText("Preparing staus codes definition data to save...");
		List<StatusCodeRow> save = new ArrayList<StatusCodeRow>();
		int size = jsArray.length();
		for(int i=0; i<size; i++){
			StatusCodeDefinitionJso r = jsArray.get(i);
			StatusCodeRow row = StatusCodeRow.create(r.getKey(), r.getLabel(), r.getDesc());
			save.add(row);
		}
		loaderWidget.setText("Saving status codes...");
		StatusesStoreWebSql statusesStore = factory.getStatusesStore();
		statusesStore.putAll(save, new StoreResultCallback<List<Integer>>() {
			@Override
			public void onSuccess(List<Integer> result) {
				postConfigTask();
			}
			
			@Override
			public void onError(Throwable e) {
				postConfigTask();
			}
		});
	}
	
	private void postConfigTask(){
		callback.onInnerTaskFinished(1);
		finishUpdate();
	}
	
	private void finishUpdate() {
		Date d = new Date();
		JSONObject o = new JSONObject();
		o.put(FIRST_RUN_FLAG, new JSONNumber(d.getTime()));
		localStorage.set(o.getJavaScriptObject(), new StorageSimpleCallback() {
			@Override
			public void onError(String message) {
				loaderWidget.setText("Loading...");
				callback.onSuccess();
			}
			
			@Override
			public void onDone() {
				loaderWidget.setText("Loading...");
				callback.onSuccess();
			}
		});
	}
	
	@Override
	public int getTasksCount() {
		return 2;
	}

	@Override
	public void setLoader(LoaderWidget loaderWidget) {
		this.loaderWidget = loaderWidget;
	}
}
