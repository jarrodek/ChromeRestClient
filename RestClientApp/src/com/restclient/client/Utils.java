package com.restclient.client;

import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.json.client.JSONValue;

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
	
}
