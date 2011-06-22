package com.kalicinscy.web.restclient.client;

import java.util.Iterator;
import java.util.Set;

import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONBoolean;
import com.google.gwt.json.client.JSONNull;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.json.client.JSONValue;
import com.google.gwt.user.client.ui.HTML;

public class JSONViewer {

	JSONValue jsonValue = null;
	private final int INDENT_VALUE = 15;

	public JSONViewer(String data) {
		try {
			this.jsonValue = JSONParser.parseLenient(data);
		} catch (NullPointerException e) {

		} catch (IllegalArgumentException e) {

		}
	}

	public void setHTML(HTML body) {
		if (this.jsonValue == null) {
			return;
		}
		String html = this.parse( this.jsonValue, 1 );
		
		String data = "<div class=\"pretty-print\">";
		data += html;
		data += "</div>";
		
		body.setHTML(data);
	}
	
	private String parse(JSONValue data, int indent){
		String result = "";
		JSONObject obj = data.isObject(); //JSON Object or null
		JSONArray arr = data.isArray(); //JSON array or null
		JSONString str = data.isString();//JSON string or null
		JSONBoolean bool = data.isBoolean();//JSON boolean or null
		JSONNull isNull = data.isNull(); //JSON null or null
		JSONNumber number = data.isNumber();//JSON number ornull
		
		
		
		if( obj != null ){
			result += this.parseObject(obj, indent);
		} else if( arr != null ) {
			result += this.parseArray(arr, indent);
		} else if( str != null ) {
			result += this.parseStringValue(str);
		} else if( bool != null ) {
			result += this.parseBooleanValue(bool);
		} else if( isNull != null ) {
			result += this.parseNullValue(isNull);
		} else if( number != null ) {
			result += this.parseNumericValue(number);
		}
		
		
		return result;
	}
	
	private String parseNumericValue(JSONNumber number) {
		String result = "";
		result += "<span class=\"json-numeric\">";
		result += number.toString();
		result += "</span>";
		return result;
	}

	private String parseNullValue(JSONNull isNull) {
		String result = "";
		result += "<span class=\"json-null\">";
		result += "null";
		result += "</span>";
		return result;
	}

	private String parseBooleanValue(JSONBoolean bool) {
		String result = "";
		result += "<span class=\"json-boolean\">";
		if( bool != null )
			result += String.valueOf(bool.booleanValue());
		else 
			result += "null";
		result += "</span>";
		return result;
	}

	private String parseStringValue(JSONString str) {
		String result = "";
		result += "<span class=\"json-punctuation\">&quot;</span>";
		result += "<span class=\"json-string\">";
		if( str != null )
			result += str.stringValue();
		else
			result += "null";
		result += "</span>";
		result += "<span class=\"json-punctuation\">&quot;</span>";
		return result;
	}

	private String parseObject(JSONObject object, int indent) {
		String result = "";
		
		result += "<span class=\"json-punctuation\">{</span>";
		
		Set<String> keys = object.keySet();
		Iterator<String> it = keys.iterator();
		
		while( it.hasNext() ){
			int indentValue = indent*INDENT_VALUE;
			
			result += "<div style=\"text-indent:"+indentValue+"px\" class=\"node\">";
			String key = it.next();
			JSONValue value = object.get(key);
			String data = this.parse(value, indent+1);
			result += this.parseKey(key) +": "+data;
			if(it.hasNext()){
				result += "<span class=\"json-punctuation\">,</span>";
			}
			result += "</div>";
		}
		
		
		result += "<span class=\"json-punctuation\">}</span>";
		return result;
	}
	
	
	
	
	private String parseArray(JSONArray array, int indent) {
		String result = "";
		
		result += "<span class=\"json-punctuation\">[</span>";
		int cnt = array.size();
		
		result += "<span class=\"json-array-counter\">("+cnt+")</span>";
		
		for( int i = 0; i<cnt; i++ ){
			int indentValue = indent*INDENT_VALUE;
			
			result += "<div style=\"text-indent:"+indentValue+"px\" class=\"node\">";
			JSONValue value = array.get(i);
			result += this.parse( value, indent+1 );
			if( i<cnt-1 ){
				result += "<span class=\"json-punctuation\">,</span>";
			}
			result += "</div>";
		}
		
		result += "<span class=\"json-punctuation\">]</span>";
		return result;
	}
	
	private String parseKey( String key ){
		String result = "";
		result += "<span class=\"json-punctuation\">&quot;</span>";
		result += "<span class=\"json-key-name\">"+key+"</span>";
		result += "<span class=\"json-punctuation\">&quot;</span>";
		return result;
	}
	
}
