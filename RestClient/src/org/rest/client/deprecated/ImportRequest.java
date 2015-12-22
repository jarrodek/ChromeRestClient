package org.rest.client.deprecated;

import java.util.ArrayList;
import java.util.List;

import org.rest.client.RestClient;
import org.rest.client.request.ApplicationRequest;
import org.rest.shared.ServerPaths;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.http.client.RequestException;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.json.client.JSONValue;
import com.google.gwt.xhr2.client.LoadHandler;
import com.google.gwt.xhr2.client.ProgressEvent;
import com.google.gwt.xhr2.client.RequestBuilder;
import com.google.gwt.xhr2.client.Response;

/**
 * Request for import data.
 * 
 * @author Paweł Psztyć
 * 
 */
public class ImportRequest extends ApplicationRequest {	

	public static void importData(final String[] keys, final ImportDataCallback callback) {
		if (currentRequest != null) {
			callback.onFailure("Wait until current request ends.", null);
			return;
		}
		RequestBuilder builder = getApplicationRequestBuilder(SERVICE_URL + ServerPaths.GET_IMPORT_DATA, "POST");
		String postData = "";
		for (String key : keys) {
			postData += "k%5B%5D=" + key + "&";
		}
		postData = postData.substring(0, postData.length() - 1); // remove last
																	// "&"
		builder.setRequestData(postData);
		builder.setHeader("Content-Type", "application/x-www-form-urlencoded");

		builder.setLoadHandler(new LoadHandler() {
			@Override
			public void onLoaded(Response response, ProgressEvent event) {

				if (response.getStatus() == 404) {
					callback.onFailure("Object not found.", null);
					return;
				}
				currentRequest = null;
				List<RestForm> result = parseImportData(response.getResponseText());
				if (result == null) {
					callback.onFailure("Unable to parse response data.", null);
					return;
				}
				callback.onSuccess(result);
			}

			@Override
			public void onError(Response r, Throwable exception) {
				currentRequest = null;
				callback.onFailure("Server return error status :( try again later.", exception);
			}
		});

		try {
			currentRequest = builder.send();
		} catch (RequestException e) {
			if (RestClient.isDebug()) {
				Log.error("Error make request to server.", e);
			}
			callback.onFailure("Error make request to server.", e);
		}
	}

	private static List<RestForm> parseImportData(String responseBody) {
		if (responseBody == null || responseBody.trim().equals("")) {
			return null;
		}
		JSONValue jsonValue = JSONParser.parseStrict(responseBody);
		//
		// Response is array but first check if it is error response (object
		// instead of array).
		//
		JSONObject bodyObj = jsonValue.isObject();
		if (bodyObj != null) {
			JSONValue errorValue = bodyObj.get("error");
			if (errorValue != null) {
				if (RestClient.isDebug()) {
					Log.error("Error: " + errorValue.isString().stringValue());
				}
				return null;
			}
			if (RestClient.isDebug()) {
				Log.error("Response has no valid data");
			}
			return null;
		}
		JSONArray bodyArr = jsonValue.isArray();
		if (bodyArr == null) {
			if (RestClient.isDebug()) {
				Log.error("Response has no valid data (not array)");
			}
			return null;
		}
		int len = bodyArr.size();
		if (len == 0) {
			if (RestClient.isDebug()) {
				Log.error("Something went wrong. There is no data in response :(");
			}
			return null;
		}
		List<RestForm> result = new ArrayList<RestForm>();
		for (int i = 0; i < len; i++) {
			JSONValue itemValue = bodyArr.get(i);
			if (itemValue == null)
				continue;
			JSONObject itemObj = itemValue.isObject();
			if (itemObj == null)
				continue;

			RestForm rf = new RestForm();
			JSONObject data = new JSONObject();

			String name = itemObj.get("name").isString().stringValue();
			String url = itemObj.get("url").isString().stringValue();
			String post = itemObj.get("post").isString().stringValue();
			String method = itemObj.get("method").isString().stringValue();
			String jDOKey = itemObj.get("key").isString().stringValue();
			String encoding = itemObj.get("encoding").isString().stringValue();
			JSONArray headerArray = itemObj.get("headers").isArray();
			int hLen = headerArray.size();
			JSONArray headersArray = new JSONArray();
			for (int j = 0; j < hLen; j++) {
				JSONObject headerObj = headerArray.get(j).isObject();
				JSONObject headerObject = new JSONObject();
				headerObject.put(headerObj.get("key").isString().stringValue(),
						new JSONString(headerObj.get("value").isString().stringValue()));
				headersArray.set(headersArray.size(), headerObject);
			}
			rf.setName(name);
			rf.setUrl(url);
			rf.key = jDOKey;
			JSONString _url = url == null ? new JSONString("null") : new JSONString(url);
			data.put("url", _url);
			JSONString _post = post == null ? new JSONString("null") : new JSONString(post);
			data.put("post", _post);
			JSONString _method = method == null ? new JSONString("null") : new JSONString(method);
			data.put("method", _method);
			data.put("formEncoding", new JSONString(encoding));
			data.put("headers", headersArray);

			rf.setData(data.toString());
			result.add(rf);
		}
		return result;
	}
}
