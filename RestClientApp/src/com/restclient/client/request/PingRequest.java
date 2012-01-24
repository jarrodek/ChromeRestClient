package com.restclient.client.request;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.http.client.RequestException;
import com.google.gwt.json.client.JSONBoolean;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.json.client.JSONValue;
import com.google.gwt.xhr2.client.LoadHandler;
import com.google.gwt.xhr2.client.ProgressEvent;
import com.google.gwt.xhr2.client.RequestBuilder;
import com.google.gwt.xhr2.client.Response;
import com.restclient.client.RestApp;

public class PingRequest extends ApplicationRequest {
	
	
	public static void getSession(final ApplicationSessionCallback callback){
		
		
		RequestBuilder b = new RequestBuilder(PING_URL, "GET");
		b.setLoadHandler(new LoadHandler() {
			@Override
			public void onLoaded(Response response, ProgressEvent event) {
				String body = response.getResponseText();
				if(body == null || body.trim().equals("")){
					if(RestApp.isDebug()){
						Log.debug("Session check response has no data.");
					}
					callback.onFailure("Session check response has no data", null);
					return;
				}
				
				JSONValue jsonValue = JSONParser.parseStrict(body);
				JSONObject bodyObj = jsonValue.isObject();
				if(bodyObj == null) {
					callback.onFailure("Session check has no valid response", null);
					return;
				}
				
				JSONValue errorValue = bodyObj.get("error");
				if(errorValue != null){
					callback.onFailure(errorValue.isString().stringValue(), null);
					if(RestApp.isDebug()){
						Log.error("Error: " + errorValue.isString().stringValue());
					}
					return;
				}
				JSONValue sessionValue = bodyObj.get("hasSession");
				if(sessionValue == null) {
					callback.onSuccess(new ApplicationSession());
					return;
				}
				
				JSONBoolean bv = sessionValue.isBoolean();
				if(bv == null) {
					callback.onSuccess(new ApplicationSession());
					return;
				}
				boolean loggedIn = bv.booleanValue();
				
				if(loggedIn){
					JSONValue uidValue = bodyObj.get("userId");
					if(uidValue != null){
						JSONString uidStr = uidValue.isString();
						if(uidStr != null){
							callback.onSuccess(new ApplicationSession(ApplicationSession.CONNECTED, uidStr.stringValue()));
							return;
						}
					}
					callback.onSuccess(new ApplicationSession(ApplicationSession.UNKNOWN));
				} else {
					callback.onSuccess(new ApplicationSession(ApplicationSession.DISCONNECTED));
				}
			}
			@Override
			public void onError(Response r, Throwable exception) {
				if(RestApp.isDebug()){
					Log.error("Error to load response from server. Session state unknown.", exception);
				}
				callback.onFailure("Error to load response from server. Session state unknown.", null);
			}
		});
		try {
			b.send();
		} catch (RequestException e) {
			if(RestApp.isDebug()){
				Log.error("Error make request to server. Session state unknown.", e);
			}
			callback.onFailure("Error make request to server. Session state unknown.", null);
		}
	}
}
