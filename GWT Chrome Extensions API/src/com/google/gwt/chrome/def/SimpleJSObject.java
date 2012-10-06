package com.google.gwt.chrome.def;

import com.google.gwt.core.client.JavaScriptObject;

public class SimpleJSObject extends JavaScriptObject {
	protected SimpleJSObject(){}
	
	public final native String[] getKeys() /*-{
	    var i = 0;
	    for (var key in this) {
	      if (this.hasOwnProperty(key)) {
	        result[i++] = key;
	      }
	    }
	    return result;
	}-*/; 
	
	
	public final native String getString(String key) /*-{
		return this[key] || null;
	}-*/; 
}
