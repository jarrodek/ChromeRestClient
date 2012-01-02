package com.restclient.client;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.json.client.JSONValue;
import com.google.gwt.regexp.shared.RegExp;
import com.google.gwt.storage.client.Storage;

/**
 * Utility class for app.
 * @author Paweł Psztyć
 *
 */
public class Utils {
	/**
	 * Method to extract string value from JSONObject
	 * @param obj object to extract value from
	 * @param key name
	 * @return string value or NULL if none found or not an JSONObject
	 */
	public static String getJsonString(JSONObject obj, String key) {
		JSONValue keyObj = obj.get(key);
		if (keyObj == null) {
			return null;
		}
		JSONString keyJS = keyObj.isString();
		if (keyJS == null) {
			return null;
		}
		String value = keyJS.stringValue();
		if (!value.equals("null")) {
			return value;
		}
		return null;
	}
	/**
	 * Find urls from input and replace it into HTML anchor.
	 * @param input
	 * @return
	 */
	public static String autoLinkUrls(String input){
		RegExp r = RegExp.compile("(https?:\\/\\/(\\w|\\.)+(\\S+))","gim");
		return r.replace(input, "<a target=\"_blank\" href=\"$1\">$1</a>");
	}
	
	/**
	 * 
	 * @return saved in local storage headers values for JSON response
	 */
	public static List<String> getJSONHeadersList(){
		List<String> result = new ArrayList<String>();
		
		final Storage storage = Storage.getLocalStorageIfSupported();
		String jsonHeadersValues = storage.getItem(RestApp.StorageKeys.JSON_HEADERS);
		if(jsonHeadersValues != null && !jsonHeadersValues.equals("")){
			JSONValue jsonHeadersJsonValue = JSONParser.parseStrict(jsonHeadersValues);
			JSONArray jsonHeadersJsonArr = jsonHeadersJsonValue.isArray();
			if(jsonHeadersJsonArr != null){
				int l = jsonHeadersJsonArr.size();
				for(int i=0; i<l; i++){
					JSONValue jv = jsonHeadersJsonArr.get(i);
					JSONString jsonHeaderJSONString = jv.isString();
					if(jsonHeaderJSONString == null){
						continue;
					}
					String header = jsonHeaderJSONString.stringValue();
					result.add(header);
				}
			}
		}
		return result;
	}
	
	public static void saveJSONHeadersList(List<String> list){
		final Storage storage = Storage.getLocalStorageIfSupported();
		JSONArray data = new JSONArray();
		for(String header : list){
			JSONString headerValue = new JSONString(header);
			data.set(data.size(), headerValue);
		}
		try{
			storage.setItem(RestApp.StorageKeys.JSON_HEADERS, data.toString());
		} catch(Exception e){}
	}
}
