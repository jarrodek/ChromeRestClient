package org.rest.client.request;

import java.util.ArrayList;

import org.rest.client.RestClient;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.http.client.RequestException;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONValue;
import com.google.gwt.xhr2.client.LoadHandler;
import com.google.gwt.xhr2.client.ProgressEvent;
import com.google.gwt.xhr2.client.RequestBuilder;
import com.google.gwt.xhr2.client.Response;

public class MessagesRequest extends ApplicationRequest {
	
	public interface MessagesHandler {
		void onMessages(ArrayList<MessageObject> result);
	}
	
	public static void getMessages(long since, final MessagesHandler handler){
		RequestBuilder b = getApplicationRequestBuilder(MESSAGES_URL+since, "GET");
		b.setLoadHandler(new LoadHandler() {

			@Override
			public void onLoaded(Response response, ProgressEvent event) {
				String body = response.getResponseText();
				if(body == null || body.trim().equals("")){
					if(RestClient.isDebug()){
						Log.debug("Messages response has no data.");
					}
					handler.onMessages(null);
					return;
				}
				
				JSONValue jsonValue = null;
				try{
					jsonValue = JSONParser.parseStrict(body);
				} catch(Exception e){
					if(RestClient.isDebug()){
						Log.debug("Unable to parse messages response.");
					}
					handler.onMessages(null);
					return;
				}
				
				JSONArray bodyArr = jsonValue.isArray();
				if(bodyArr == null){
					if(RestClient.isDebug()){
						Log.debug("Unable to parse messages response.");
					}
					handler.onMessages(null);
					return;
				}
				
				
				int len = bodyArr.size();
				if(len == 0){
					handler.onMessages(null);
					return;
				}
				ArrayList<MessageObject> result = new ArrayList<MessageObject>();
				for(int i=0; i<len; i++){
					JSONValue itemValue = bodyArr.get(i);
					JSONObject obj = itemValue.isObject();
					if(obj == null) continue;
					String title = obj.get("title").isString().stringValue();
					String message = obj.get("message").isString().stringValue();
					String created = obj.get("created").isString().stringValue();
					MessageObject nEvent = new MessageObject(title, message, created);
					result.add(nEvent);
				}
				handler.onMessages(result);
			}

			@Override
			public void onError(Response r, Throwable exception) {
				if(RestClient.isDebug()){
					Log.error("Error make request to server. Session state unknown.", exception);
				}
			}});
		try {
			b.send();
		} catch (RequestException e) {
			handler.onMessages(null);
		}
	}
	
}
