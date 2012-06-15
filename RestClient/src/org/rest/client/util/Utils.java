package org.rest.client.util;

import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.json.client.JSONValue;
import com.google.gwt.regexp.shared.RegExp;

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
}
