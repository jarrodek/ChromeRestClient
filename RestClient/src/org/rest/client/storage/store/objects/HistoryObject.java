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

import java.util.Date;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * This class represents requests data stored in history store.
 * 
 * @author Paweł Psztyć
 * 
 */
public class HistoryObject extends JavaScriptObject {
	protected HistoryObject() {
	}
	
	/**
	 * Create Request History object with predefined values.
	 * @return
	 */
	public static final native HistoryObject create() /*-{
		return {
			url : null, //search key, for future implementation in URL seatch oracle
			method : null,
			encoding : null,
			headers : null,
			payload : null,
			time: new Date() //order key
		}
	}-*/;
	
	/**
	 * @return IDB ID.
	 */
	public final native int getId() /*-{
		return this.id;
	}-*/;
	
	public final native void setTime(Date time) /*-{
		this.time = tiom;
	}-*/;
	
	public final native double getTime() /*-{
		if(!this.time){
			this.time = Date.now();
		}
		if(typeof this.time == 'number'){
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

	/**
	 * Sets request method value eg. POST
	 * 
	 * @param method
	 *            Method to set
	 */
	public final native void setMethod(String method) /*-{
		this.method = method;
	}-*/;

	/**
	 * @return Saved request method value
	 */
	public final native String getMethod() /*-{
		return this.method;
	}-*/;

	/**
	 * Sets request data encoding eg. application/json
	 * 
	 * @param encoding
	 *            Encoding to set. Any valid encoding value
	 */
	public final native void setEncoding(String encoding) /*-{
		this.encoding = encoding;
	}-*/;

	/**
	 * @return Saved request form encoding
	 */
	public final native String getEncoding() /*-{
		return this.encoding;
	}-*/;

	/**
	 * Sets headers data in string representation.
	 * 
	 * @param headers
	 */
	public final native void setHeaders(String headers) /*-{
		this.headers = headers;
	}-*/;

	/**
	 * @return Saved request headers data.
	 */
	public final native String getHeaders() /*-{
		return this.headers;
	}-*/;

	/**
	 * Sets form payload
	 * 
	 * @param payload
	 *            Payload to set. Any string.
	 */
	public final native void setPayload(String payload) /*-{
		this.payload = payload;
	}-*/;

	/**
	 * @return Saved payload data
	 */
	public final native String getPayload() /*-{
		return this.payload;
	}-*/;
}
