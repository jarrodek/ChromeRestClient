/*******************************************************************************
 * Copyright 2012 Paweł Psztyć
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
package org.rest.client.ui.html5;

import java.util.ArrayList;
/**
 * GWT wrapper to basics properties available in HTML5 element.
 * @author Paweł Psztyć
 *
 */
public class HTML5Element extends com.google.gwt.user.client.Element {
	
	
	protected HTML5Element() {
	}

	/**
	 * Query DOM object and find children matched given selector.
	 * @param selector to match elements eg. div.current:not(:disabled)
	 * @param out output array list of found elements. can have no elements if none found.
	 */
	public final native void querySelectorAll(String selector, ArrayList<HTML5Element> out) /*-{
		var nodes = this.querySelectorAll(selector);
		var nodesCnt = nodes.length;
		for(var i = 0; i < nodesCnt; i++){
			out.@java.util.ArrayList::add(Ljava/lang/Object;) (nodes[i]);
		}
	}-*/;
	
	/**
	 * Query element to find other element for given selector query.
	 * It returns first matched element.
	 * @param selector
	 * @return element or NULL if none found.
	 */
	public final native HTML5Element querySelector(String selector) /*-{
		return this.querySelector(selector);
	}-*/;
	
	/**
	 * Add data to "dataset" property. It's create data-"key" attribute in element.
	 * <pre>
	 * 	element.putData("url","www.google.com");
	 *  --> data-url="www.google.com"
	 * </pre>
	 * @param key
	 * @param data
	 */
	public final native void putData(String key, String data) /*-{
		this.dataset[key] = data;
	}-*/;
	/**
	 * Add data to "dataset" property. It's create data-"key" attribute in element.
	 * <pre>
	 * 	element.putData("order",1);
	 *  --> data-order="1"
	 * </pre>
	 * @param key
	 * @param data
	 */
	public final native void putData(String key, int data) /*-{
		this.dataset[key] = data;
	}-*/;
	/**
	 * Get value from dataset property 
	 * @param key
	 * @return
	 */
	public final native String getDataString(String key) /*-{
		return this.dataset[key] || null;
	}-*/;
	/**
	 * Get value from dataset property
	 * @param key
	 * @return
	 */
	public final native Number getDataInt(String key) /*-{
		var value = this.dataset[key];
		try{
			value = parseInt(value);
		} catch(e){
			value = -1;
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
