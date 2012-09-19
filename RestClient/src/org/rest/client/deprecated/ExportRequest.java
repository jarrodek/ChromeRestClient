package org.rest.client.deprecated;

import java.util.HashMap;

import org.rest.client.RestClient;
import org.rest.client.request.ApplicationRequest;
import org.rest.shared.ServerPaths;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.http.client.RequestException;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONValue;
import com.google.gwt.xhr2.client.ErrorHandler;
import com.google.gwt.xhr2.client.LoadHandler;
import com.google.gwt.xhr2.client.ProgressEvent;
import com.google.gwt.xhr2.client.RequestBuilder;
import com.google.gwt.xhr2.client.Response;

/**
 * Request for data export.
 * @author Paweł Psztyć
 *
 */
public class ExportRequest extends ApplicationRequest {
	
	public static void export(JSONObject data, final ExportCallback callback){
		if(currentRequest != null){
			callback.onFailure("Wait until current request ends.", null);
			return;
		}
		export(data.toString(), callback);
	}
	
	public static void export(String data, final ExportCallback callback){
		
		if(currentRequest != null){
			callback.onFailure("Wait until current request ends.", null);
			return;
		}
		
		String url = SERVICE_URL + ServerPaths.EXPORT_DATA;
		RequestBuilder builder = getApplicationRequestBuilder(url, "POST");
		builder.setHeader("Content-Type", "application/json");
		builder.setRequestData(data);
		builder.setErrorHandler(new ErrorHandler() {
			@Override
			public void onError(Response response, RuntimeException exception) {
				if(RestClient.isDebug()){
					Log.error("Error send data to server", exception);
				}
				currentRequest = null;
				callback.onFailure("Connection error :( Try again later", null);
			}
		});
		builder.setLoadHandler(new LoadHandler() {
			@Override
			public void onLoaded(Response response, ProgressEvent event) {
				currentRequest = null;
				
				String body = response.getResponseText();
				JSONValue responseValue = null;
				try {
					responseValue = JSONParser.parseStrict(body);
				} catch(Exception e){
					if(RestClient.isDebug()){
						Log.error("Unable to read response from apllication :(", e);
					}
					callback.onFailure("Unable to read response from apllication :(", e);
					return;
				}
				JSONObject respObj = responseValue.isObject();
				if(respObj != null) {
					JSONValue errorValue = respObj.get("error");
					if(errorValue != null){
						int code = Integer.parseInt(respObj.get("code").toString());
						if(code == 401){
							callback.onNotLoggedIn();
							return;
						}
						String errorMessage = respObj.get("message").isString().stringValue();
						if(RestClient.isDebug()){
							Log.error("Error to save data on server: " + errorMessage);
						}
						callback.onFailure("Error to save data on server: " + errorMessage, null);
						return;
					}
					callback.onFailure("Server response is not valid",null);
					return;
				}
				JSONArray arrValue = responseValue.isArray();
				if(arrValue == null){
					callback.onFailure("Server response is not valid. Array expected.",null);
					return;
				}
				HashMap<Integer, String> result = new HashMap<Integer, String>();
				int cnt = arrValue.size();
				for(int i=0; i<cnt; i++){
					JSONObject rObj = arrValue.get(i).isObject();
					if(rObj == null) continue;
					String gaeKey = rObj.get("key").isString().stringValue();
					Integer id = Integer.parseInt(rObj.get("id").toString());
					result.put(id, gaeKey);
				}
				callback.onSuccess(result);
			}

			@Override
			public void onError(Response r, Throwable exception) {
				currentRequest = null;
				callback.onFailure("An error occurred during save data.", exception);
			}});
		
		
		try {
			currentRequest = builder.send();
		} catch (RequestException e) {
			currentRequest = null;
			if(RestClient.isDebug()){
				Log.error("Unable to send request", e);
			}
			callback.onFailure("Unable to send request to server. " + e.getMessage(), e);
		}
	}
	
}
