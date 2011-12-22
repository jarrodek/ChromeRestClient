package com.restclient.client.widgets;

import java.util.Iterator;
import java.util.Set;

import com.google.gwt.core.client.GWT;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONBoolean;
import com.google.gwt.json.client.JSONNull;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.json.client.JSONValue;
import com.google.gwt.resources.client.CssResource;
import com.google.gwt.safehtml.shared.SafeHtmlUtils;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.Widget;

public class JSONViewer extends Composite {
	
	interface Binder extends UiBinder<Widget, JSONViewer> {}
	
	interface ParserStyle extends CssResource {
		int indent();
		String prettyPrint();
		String numeric();
		String nullValue();
		String booleanValue();
		String punctuation();
		String stringValue();
		String node();
		String arrayCounter();
		String keyName();
	}
	
	@UiField HTML result;
	@UiField ParserStyle style;
	
	
	JSONValue jsonValue = null;
	
	public JSONViewer(String data, HTMLPanel jsonPanel) {
		
		initWidget(GWT.<Binder> create(Binder.class).createAndBindUi(this));
		
		try {
			this.jsonValue = JSONParser.parseLenient(data);
			
		} catch (NullPointerException e) {
			
		} catch (IllegalArgumentException e) {
			
		} finally {
			
			if( this.jsonValue == null ){
				//TODO - set parse error
			} else {
				String html = this.parse( this.jsonValue, 1 );
				String parsedData = "<div class=\""+style.prettyPrint()+"\">";
				parsedData += html;
				parsedData += "</div>";
				result.setHTML(parsedData);
				jsonPanel.add(this);
			}
		}
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
		result += "<span class=\""+style.numeric()+"\">";
		result += number.toString();
		result += "</span>";
		return result;
	}

	private String parseNullValue(JSONNull isNull) {
		String result = "";
		result += "<span class=\""+style.nullValue()+"\">";
		result += "null";
		result += "</span>";
		return result;
	}

	private String parseBooleanValue(JSONBoolean bool) {
		String result = "";
		result += "<span class=\""+style.booleanValue()+"\">";
		if( bool != null )
			result += String.valueOf(bool.booleanValue());
		else 
			result += "null";
		result += "</span>";
		return result;
	}

	private String parseStringValue(JSONString str) {
		String result = "";
		result += "<span class=\""+style.punctuation()+"\">&quot;</span>";
		result += "<span class=\""+style.stringValue()+"\">";
		if( str != null )
			result += SafeHtmlUtils.htmlEscape(str.stringValue());
		else
			result += "null";
		result += "</span>";
		result += "<span class=\""+style.punctuation()+"\">&quot;</span>";
		return result;
	}

	private String parseObject(JSONObject object, int indent) {
		String result = "";
		
		result += "<span class=\""+style.punctuation()+"\">{</span>";
		
		Set<String> keys = object.keySet();
		Iterator<String> it = keys.iterator();
		
		while( it.hasNext() ){
			int indentValue = indent*style.indent();
			
			result += "<div style=\"text-indent:"+indentValue+"px\" class=\""+style.node()+"\">";
			String key = it.next();
			JSONValue value = object.get(key);
			String data = this.parse(value, indent+1);
			result += this.parseKey(key) +": "+data;
			if(it.hasNext()){
				result += "<span class=\""+style.punctuation()+"\">,</span>";
			}
			result += "</div>";
		}
		
		
		result += "<span class=\""+style.punctuation()+"\">}</span>";
		return result;
	}
	
	
	
	
	private String parseArray(JSONArray array, int indent) {
		String result = "";
		
		result += "<span class=\""+style.punctuation()+"\">[</span>";
		int cnt = array.size();
		
		result += "<span class=\""+style.arrayCounter()+"\">("+cnt+")</span>";
		
		for( int i = 0; i<cnt; i++ ){
			int indentValue = indent*style.indent();
			
			result += "<div style=\"text-indent:"+indentValue+"px\" class=\""+style.node()+"\">";
			JSONValue value = array.get(i);
			result += this.parse( value, indent+1 );
			if( i<cnt-1 ){
				result += "<span class=\""+style.punctuation()+"\">,</span>";
			}
			result += "</div>";
		}
		
		result += "<span class=\""+style.punctuation()+"\">]</span>";
		return result;
	}
	
	private String parseKey( String key ){
		String result = "";
		result += "<span class=\""+style.punctuation()+"\">&quot;</span>";
		result += "<span class=\""+style.keyName()+"\">"+key+"</span>";
		result += "<span class=\""+style.punctuation()+"\">&quot;</span>";
		return result;
	}
	
}
