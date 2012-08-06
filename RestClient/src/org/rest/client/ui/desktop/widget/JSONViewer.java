package org.rest.client.ui.desktop.widget;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.Set;

import org.rest.client.resources.AppCssResource;
import org.rest.client.resources.AppResources;
import org.rest.client.ui.desktop.StatusNotification;
import org.rest.client.ui.html5.HTML5Element;
import org.rest.client.util.ElementWrapper;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONBoolean;
import com.google.gwt.json.client.JSONNull;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.json.client.JSONValue;
import com.google.gwt.regexp.shared.RegExp;
import com.google.gwt.resources.client.CssResource;
import com.google.gwt.safehtml.shared.SafeHtmlUtils;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.Widget;

public class JSONViewer extends Composite {
	
	private RegExp linkRegExp = RegExp.compile("^\\w+://","gim");
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
		String rootElementToggleButton();
		String infoRow();
	}
	@UiField HTML result;
	@UiField ParserStyle style;
	AppCssResource appStyle = AppResources.INSTANCE.appCss();
	
	private int elementsCounter = 0;
	
	public JSONViewer(String data, HTMLPanel jsonPanel) {
		initWidget(GWT.<Binder> create(Binder.class).createAndBindUi(this));
		
		JSONValue jsonValue = null;
		try {
			jsonValue = JSONParser.parseStrict(data);
		} catch (Exception e) {
			
		} finally {
			if(jsonValue == null){
				StatusNotification.notify("Unable to parse JSON response.", StatusNotification.TYPE_ERROR);
			} else {
				String parsedData = "<div class=\""+style.prettyPrint()+"\">";
				parsedData += this.parse(jsonValue, 1);
				parsedData += "</div>";
				result.setHTML(parsedData);
				jsonPanel.add(this);
				jsonValue = null;
				addControls();
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
		JSONNumber number = data.isNumber();//JSON number or null
		
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
		String value = str.stringValue();
		if(value != null){
			value = SafeHtmlUtils.htmlEscape(value);
			if(linkRegExp.test(value)){
				value = "<a href=\""+value+"\">"+value+"</a>";
			}
		} else {
			value = "null";
		}
		result += "<span class=\""+style.punctuation()+"\">&quot;</span>";
		result += "<span class=\""+style.stringValue()+"\">";
		result += value;
		result += "</span>";
		result += "<span class=\""+style.punctuation()+"\">&quot;</span>";
		return result;
	}

	private String parseObject(JSONObject object, int indent) {
		String result = "";
		result += "<span class=\""+style.punctuation()+"\">{</span>";
		Set<String> keys = object.keySet();
		Iterator<String> it = keys.iterator();
		
		while(it.hasNext()){
			int elementNo = elementsCounter++;
			int indentValue = indent*style.indent();
			result += "<div data-element=\""+elementNo+"\" style=\"text-indent:"+indentValue+"px\" class=\""+style.node()+"\">";
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
			int elementNo = elementsCounter++;
			int indentValue = indent*style.indent();
			result += "<div data-element=\""+elementNo+"\" style=\"text-indent:"+indentValue+"px\" class=\""+style.node()+"\">";
			JSONValue value = array.get(i);
			result += this.parse(value, indent+1);
			if(i<cnt-1){
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
	
	private void addControls(){
		HTML5Element element = (HTML5Element) result.getElement();
		ArrayList<HTML5Element> out = new ArrayList<HTML5Element>();
		element.querySelectorAll("div[data-element] > div[data-element]", out);
		
		for(HTML5Element item : out){
			final HTML5Element parent = (HTML5Element) item.getParentElement();
			String hasChildren = parent.getDataString("hasChildren");
			if(hasChildren == null){
				parent.putData("hasChildren", "true");
				HTMLPanel colapseButton = new HTMLPanel("-");
				colapseButton.addStyleName(style.rootElementToggleButton());
				parent.appendChild(colapseButton.getElement());
				ElementWrapper e = new ElementWrapper(colapseButton.getElement());
				
				e.addDomHandler(new ClickHandler() {
					@Override
					public void onClick(ClickEvent event) {
						ArrayList<HTML5Element> out = new ArrayList<HTML5Element>();
						parent.querySelectorAll("div[data-element]", out);
						Iterator<HTML5Element> it = out.iterator();
						
						if(parent.getClassList().contains("colapsed")){
							HTML5Element infoEl = parent.querySelector("div."+style.infoRow());
							if(infoEl != null){
								infoEl.removeFromParent();
							}
							while(it.hasNext()){
								HTML5Element next = it.next(); 
								next.getClassList().remove(appStyle.hidden());
							}
							parent.getClassList().remove("colapsed");
						} else {
							parent.getClassList().add("colapsed");
							Element info = DOM.createDiv();	
							info.addClassName(style.infoRow());
							info.setInnerText("...");
							
							boolean inserted = false;
							while(it.hasNext()){
								final HTML5Element next = it.next(); 
								next.getClassList().add(appStyle.hidden());
								if(!inserted){
									inserted = true;
									parent.insertBefore(info, next);
								}
							}
						}
					}
				}, ClickEvent.getType());
			}
		}
	}
}
