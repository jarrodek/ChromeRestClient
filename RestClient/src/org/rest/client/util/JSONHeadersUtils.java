package org.rest.client.util;

import org.rest.client.RestClient;
import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.store.LocalStore;

import com.google.gwt.core.client.Callback;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.json.client.JSONValue;

public class JSONHeadersUtils {
	
	/**
	 * 
	 * @return saved in local storage headers values for JSON response
	 */
	public static void getJSONHeadersList(final Callback<String[], Throwable> callback){
		final LocalStore store = RestClient.getClientFactory().getLocalStore();
		store.open(new StoreResultCallback<Boolean>() {
			@Override
			public void onSuccess(Boolean result) {
				store.getByKey(LocalStore.JSON_HEADERS_KEY, new StoreResultCallback<String>() {
					@Override
					public void onSuccess(String result) {
						if(result != null && !result.equals("")){
							JSONValue jsonHeadersJsonValue = JSONParser.parseStrict(result);
							JSONArray jsonHeadersJsonArr = jsonHeadersJsonValue.isArray();
							if(jsonHeadersJsonArr != null){
								int l = jsonHeadersJsonArr.size();
								String[] res = new String[l];
								for(int i=0; i<l; i++){
									JSONValue jv = jsonHeadersJsonArr.get(i);
									JSONString jsonHeaderJSONString = jv.isString();
									if(jsonHeaderJSONString == null){
										continue;
									}
									String header = jsonHeaderJSONString.stringValue();
									res[i] = header;
								}
								callback.onSuccess(res);
							} else {
								callback.onSuccess(new String[0]);
							}
						} else {
							callback.onSuccess(new String[0]);
						}
					}
					@Override
					public void onError(Throwable e) {
						callback.onFailure(e);
					}
				});
			}
			@Override
			public void onError(Throwable e) {
				callback.onFailure(e);
			}
		});
	}

	public static void store(String[] newArray, final Callback<Boolean, Throwable> callback) {
		final JSONArray data = new JSONArray();
		for(String header : newArray){
			if(header == null){
				continue;
			}
			JSONString headerValue = new JSONString(header);
			data.set(data.size(), headerValue);
		}
		
		final LocalStore store = RestClient.getClientFactory().getLocalStore();
		store.open(new StoreResultCallback<Boolean>() {
			@Override
			public void onSuccess(Boolean result) {
				store.put(data.toString(), LocalStore.JSON_HEADERS_KEY, new StoreResultCallback<String>() {
					
					@Override
					public void onSuccess(String result) {
						callback.onSuccess(true);
					}
					
					@Override
					public void onError(Throwable e) {
						callback.onFailure(e);
					}
				});
			}
			@Override
			public void onError(Throwable e) {
				callback.onFailure(e);
			}
		});
	}
	
}
