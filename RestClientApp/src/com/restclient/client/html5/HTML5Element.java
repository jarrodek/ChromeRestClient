package com.restclient.client.html5;

import java.util.ArrayList;

public class HTML5Element extends com.google.gwt.user.client.Element {
	
	
	protected HTML5Element() {
	}

	public final native void querySelectorAll(String selector, ArrayList<HTML5Element> out) /*-{
		var nodes = this.querySelectorAll(selector);
		var nodesCnt = nodes.length;
		for(var i = 0; i < nodesCnt; i++){
			out.@java.util.ArrayList::add(Ljava/lang/Object;) (nodes[i]);
		}
	}-*/;
	
	public final native HTML5Element querySelector(String selector) /*-{
		return this.querySelector(selector);
	}-*/;
	
	public final native void putData(String key, String data) /*-{
		this.dataset[key] = data;
	}-*/;
	public final native void putData(String key, int data) /*-{
		this.dataset[key] = data;
	}-*/;
	public final native String getDataString(String key) /*-{
		return this.dataset[key];
	}-*/;
	public final native int getDataInt(String key) /*-{
		var value = this.dataset[key];
		try{
			value = parseInt(value);
		} catch(e){
			value = null;
		}
		return value;
	}-*/;
	/**
	 * Returns class object or null if it not a HTML ready element.
	 * @return
	 */
	public final native ClassList getClassList() /*-{
		return this.classList;
	}-*/;
}
