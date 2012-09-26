package org.rest.client.util;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;

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
	 * Extracts long value from JSONObject.
	 * @param obj
	 * @param key
	 * @return long value or -1 if not an numeric value 
	 */
	public static long getJsonLong(JSONObject obj, String key) {
		long longResult = -1;
		if(obj.containsKey(key)){
			JSONValue longValue = obj.get(key);
			if(longValue != null && longValue.isNumber() != null){
				String longStr = longValue.isNumber().toString();
				try{
					longResult = Long.parseLong(longStr);
				} catch(Exception e){}
			}
		}
		return longResult;
	}
	/**
	 * Extracts integer value from JSONObject.
	 * @param obj
	 * @param key
	 * @return integer value or -1 if not an numeric value 
	 */
	public static int getJsonInt(JSONObject obj, String key) {
		int result = -1;
		if(obj.containsKey(key)){
			JSONValue resultValue = obj.get(key);
			if(resultValue != null && resultValue.isNumber() != null){
				String resultStr = resultValue.isNumber().toString();
				try{
					result = Integer.parseInt(resultStr);
				} catch(Exception e){}
			}
		}
		return result;
	}
	/**
	 * Extracts boolean value from JSONObject.
	 * @param obj
	 * @param key
	 * @return boolean value or NULL if it is not boolean.
	 */
	public static Boolean getJsoniBool(JSONObject obj, String key) {
		Boolean result = null;
		if(obj.containsKey(key)){
			JSONValue resultValue = obj.get(key);
			if(resultValue != null && resultValue.isBoolean() != null){
				result = resultValue.isBoolean().booleanValue();
			}
		}
		return result;
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
	 * Try to guess file extension from content type value.
	 * @param contentType Response content type header
	 * @return If recognized - file extension. Default return: <b>text/plain</b>
	 */
	public static String guessFileExtension(String contentType){
		String result = "text/plain";
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("application/json", "json");
		map.put("text/html,xhtml+xml", "html");
		map.put("atom,xml", "xml");
		map.put("javascript,", "js");
		map.put("css", "css");
		map.put("application/java,text/x-java-source", "class");
		map.put("application/x-gzip", "gz");
		map.put("text/x-h", "h");
		map.put("image/jpeg,image/pjpeg", "jpg");
		map.put("audio/x-mpequrl", "m3u");
		map.put("image/png", "png");
		map.put("application/x-tar", "tar");
		map.put("image/tiff,image/x-tiff", "");
		map.put("application/x-zip-compressed,application/zip,multipart/x-zip", "");
		map.put("application/pdf", "pdf");
		map.put("image/gif", "gif");
		map.put("image/svg+xml", "svg");
		map.put("image/vnd.microsoft.icon", "icon");
		map.put("text/csv", "csv");
		
		Set<String> set = map.keySet();
		Iterator<String> it = set.iterator();
		while(it.hasNext()){
			String key = it.next();
			if(contentType.contains(key) || key.contains(contentType)){
				result = map.get(key);
				break;
			}
		}
		return result;
	}
}
