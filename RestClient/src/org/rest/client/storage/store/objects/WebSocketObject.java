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
package org.rest.client.storage.store.objects;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * This class represents requests data stored in history store.
 * 
 * @author Paweł Psztyć
 * 
 */
public class WebSocketObject extends JavaScriptObject {
	protected WebSocketObject() {
	}
	
	/**
	 * Create Request History object with predefined values.
	 * @return
	 */
	public static final native WebSocketObject create(String url) /*-{
		return {
			url : url,
			time: Date.now()
		}
	}-*/;
	
	/**
	 * @return IDB ID.
	 */
	public final native int getId() /*-{
		return this.id;
	}-*/;
	
	/**
	 * @param id ID to set (on update only)
	 */
	public final native void setId(int id) /*-{
		this.id = id;
	}-*/;
	
	public final native void setTime(double time) /*-{
		this.time = time;
	}-*/;
	
	public final native double getTime() /*-{
		if(typeof this.time == 'number'){
			return this.time;
		}
		if(!this.time || !this.time.getTime){
			this.time = Date.now();
			return this.time;
		}
		return this.time.getTime();
	}-*/;
	
	/**
	 * Sets request URL data
	 * 
	 * @param url
	 *            URL to save
	 */
	public final native void setURL(String url) /*-{
		this.url = url;
	}-*/;

	/**
	 * @return saved URL data
	 */
	public final native String getURL() /*-{
		return this.url;
	}-*/;
}
