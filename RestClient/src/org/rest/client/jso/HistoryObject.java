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
package org.rest.client.jso;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;

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
			id: -1,
			url : null, //search key, for future implementation in URL seatch oracle
			method : null,
			encoding : null,
			headers : null,
			payload : null,
			time: Date.now()
		}
	}-*/;
	
	public final native int getId() /*-{
		return this.id;
	}-*/;
	
	public final native void setId(int id) /*-{
		this.id = id;
	}-*/;
	public final native void reSetId() /*-{
		delete this.id;
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
	
	public final native void setURL(String url) /*-{
		this.url = url;
	}-*/;

	public final native String getURL() /*-{
		return this.url;
	}-*/;

	public final native void setMethod(String method) /*-{
		this.method = method;
	}-*/;

	public final native String getMethod() /*-{
		return this.method;
	}-*/;

	public final native void setEncoding(String encoding) /*-{
		this.encoding = encoding;
	}-*/;

	public final native String getEncoding() /*-{
		return this.encoding;
	}-*/;

	public final native void setHeaders(String headers) /*-{
		this.headers = headers;
	}-*/;

	public final native String getHeaders() /*-{
		return this.headers || null;
	}-*/;

	public final native void setPayload(String payload) /*-{
		this.payload = payload;
	}-*/;

	public final native String getPayload() /*-{
		return this.payload;
	}-*/;
	
	/**
	 * Copy request object to new history object.
	 * 
	 * @param from
	 * @return
	 */
	public static HistoryObject copyRequestObject(RequestObject from){
		HistoryObject to = HistoryObject.create();
		to.setEncoding(from.getEncoding() == null ? "" : from.getEncoding());
		to.setHeaders(from.getHeaders());
		to.setMethod(from.getMethod());
		to.setPayload(from.getPayload());
		to.setTime(from.getTime());
		to.setURL(from.getURL());
		return to;
	}
	
	public static HistoryObject copyNew(HistoryObject from){
		HistoryObject to = HistoryObject.create();
		to.setEncoding(from.getEncoding());
		to.setHeaders(from.getHeaders());
		to.setMethod(from.getMethod());
		to.setPayload(from.getPayload());
		to.setTime(from.getTime());
		to.setURL(from.getURL());
		return to;
	}
	
	/**
	 * @return {@link RequestObject} as a {@link JSONObject}
	 */
	public final JSONObject toJSONObject(){
		JSONObject obj = new JSONObject();
		obj.put("encoding", new JSONString(getEncoding() == null ? "" : getEncoding()));
		obj.put("headers", new JSONString(getHeaders() == null ? "" : getHeaders()));
		obj.put("method", new JSONString(getMethod() == null ? "" : getMethod()));
		obj.put("payload", new JSONString(getPayload() == null ? "" : getPayload()));
		obj.put("time", new JSONNumber(getTime()));
		obj.put("url", new JSONString(getURL() == null ? "" : getURL()));
		return obj;
	}
}
