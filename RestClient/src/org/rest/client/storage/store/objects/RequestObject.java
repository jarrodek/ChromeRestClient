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

import java.util.ArrayList;

import org.rest.client.request.FilesObject;

import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.json.client.JSONBoolean;

/**
 * This is representation of data stored in IDB request table. This class
 * represents any request related data in application. Either it is saved
 * request or request data in project.
 * 
 * This class extends History object for Project related data.
 * 
 * @author jarrod
 * 
 */
public class RequestObject extends HistoryObject {
	protected RequestObject() {
	}
	/**
	 * Create Request object with predefined values.
	 * @return
	 */
	public static final native RequestObject createRequest() /*-{
		return {
			name : null, //search key
			project : 0, //search key
			url : null, //search key
			method : null,
			encoding : null,
			headers : null,
			payload : null,
			skipProtocol : false,
			skipServer : false,
			skipParams : false,
			skipHistory : false,
			skipMethod: false,
			skipPayload: false,
			skipHeaders: false,
			skipPath: false,
//			created: new Date() //order key
		}
	}-*/;
	
	private static ArrayList<FilesObject> fileList = new ArrayList<FilesObject>();
	public final void setFiles(ArrayList<FilesObject> list){
		fileList = list;
	}
	public final ArrayList<FilesObject> getFiles(){
		return fileList;
	}

	/**
	 * @return request given name or null if none
	 */
	public final native String getName() /*-{
		return this.name || null;
	}-*/;

	/**
	 * Sets request give name
	 * 
	 * @param name
	 *            Name to set
	 */
	public final native void setName(String name) /*-{
		this.name = name;
	}-*/;

	/**
	 * @return project ID or 0 if none
	 */
	public final native int getProject() /*-{
		return this.project || 0;
	}-*/;

	/**
	 * Sets project ID for this request. If not provided means request is not
	 * belongs to any project
	 * 
	 * @param project
	 *            ID from projects IDB
	 */
	public final native void setProject(int project) /*-{
		this.project = project;
	}-*/;

	/**
	 * If skipProtocol flag is set to true when restoring this requests data
	 * protocol value will be removed and current form value will be inserted.
	 * 
	 * @param skipProtocol
	 *            True to drop protocol value when restoring
	 */
	public final native void setSkipProtocol(boolean skipProtocol) /*-{
		this.skipProtocol = skipProtocol;
	}-*/;

	/**
	 * @return If skipProtocol is set to TRUE when protocol value will be
	 *         dropped when restoring this request (use current form value
	 *         instead)
	 */
	public final native boolean isSkipProtocol() /*-{
		return !!(this.skipProtocol);
	}-*/;
	
	public final native int getSkipProtocol() /*-{
		var res = 0;
		if(!!this.skipProtocol){
			res = 1;
		}
		return res;
	}-*/;
	
	/**
	 * If skipServer flag is set to true then when restoring this requests data
	 * server addr value will be removed and current form value will be
	 * inserted.
	 * 
	 * @param skipSetver
	 *            True to drop server addr value when restoring
	 */
	public final native void setSkipServer(boolean skipServer) /*-{
		this.skipServer = skipServer;
	}-*/;

	/**
	 * 
	 * @return If skipServer is set to TRUE then server addr value will be
	 *         dropped when restoring this request (use current form value
	 *         instead)
	 */
	public final native boolean isSkipServer() /*-{
		return !!(this.skipServer);
	}-*/;
	public final native int getSkipServer() /*-{
		var res = 0;
		if(!!this.skipServer){
			res = 1;
		}
		return res;
	}-*/;
	/**
	 * Set this flag to true to drop any URL parameters saved with this request
	 * 
	 * @param skipParams
	 *            True to drop params value
	 */
	public final native void setSkipParams(boolean skipParams) /*-{}-*/;

	/**
	 * @return if true all URL parameters saved with this request will not be
	 *         restored (use current form value instead)
	 */
	public final native boolean isSkipParams() /*-{
		return !!(this.skipParams);
	}-*/;
	public final native int getSkipParams() /*-{
		var res = 0;
		if(!!this.skipParams){
			res = 1;
		}
		return res;
	}-*/;

	public final native void setSkipHistory(boolean skipHistory) /*-{
		this.skipHistory = skipHistory;
	}-*/;

	public final native boolean isSkipHistory() /*-{
		return !!(this.skipHistory);
	}-*/;
	public final native int getSkipHistory() /*-{
		var res = 0;
		if(!!this.skipHistory){
			res = 1;
		}
		return res;
	}-*/;

	public final native void setSkipMethod(boolean skipMethod) /*-{
		this.skipMethod = skipMethod;
	}-*/;

	public final native boolean isSkipMethod() /*-{
		return !!(this.skipMethod);
	}-*/;
	public final native int getSkipMethod() /*-{
		var res = 0;
		if(!!(this.skipMethod)){
			res = 1;
		}
		return res;
	}-*/;

	public final native void setSkipPayload(boolean skipPayload) /*-{
		this.skipPayload = skipPayload;
	}-*/;

	public final native boolean isSkipPayload() /*-{
		return !!(this.skipPayload);
	}-*/;
	public final native int getSkipPayload() /*-{
		var res = 0;
		if(!!(this.skipPayload)){
			res = 1;
		}
		return res;
	}-*/;
	
	public final native void setSkipHeaders(boolean skipHeaders) /*-{
		this.skipHeaders = skipHeaders;
	}-*/;
	
	public final native boolean isSkipHeaders() /*-{
		return !!(this.skipHeaders);
	}-*/;
	public final native int getSkipHeaders() /*-{
		var res = 0;
		if(!!(this.skipHeaders)){
			res = 1;
		}
		return res;
	}-*/;
	
	public final native void setSkipPath(boolean skipPath) /*-{
		this.skipPath = skipPath;
	}-*/;
	
	public final native boolean isSkipPath() /*-{
		return !!(this.skipPath);
	}-*/;
	public final native int getSkipPath() /*-{
		var res = 0;
		if(!!(this.skipPath)){
			res = 1;
		}
		return res;
	}-*/;
	/**
	 * @return {@link RequestObject} as a {@link JSONObject}
	 */
	public final JSONObject toJSONObject(){
		JSONObject obj = new JSONObject();
		
		obj.put("encoding", new JSONString(getEncoding() == null ? "" : getEncoding()));
		obj.put("headers", new JSONString(getHeaders() == null ? "" : getHeaders()));
		obj.put("method", new JSONString(getMethod() == null ? "" : getMethod()));
		obj.put("name", new JSONString(getName() == null ? "" : getName()));
		obj.put("payload", new JSONString(getPayload() == null ? "" : getPayload()));
		obj.put("project", new JSONNumber(getProject()));
		obj.put("skipHeaders", JSONBoolean.getInstance(getSkipHeaders() == 1 ? true : false));
		obj.put("skipHistory", JSONBoolean.getInstance(getSkipHistory() == 1 ? true : false));
		obj.put("skipMethod", JSONBoolean.getInstance(getSkipMethod() == 1 ? true : false));
		obj.put("skipParams", JSONBoolean.getInstance(getSkipParams() == 1 ? true : false));
		obj.put("skipPath", JSONBoolean.getInstance(getSkipPath() == 1 ? true : false));
		obj.put("skipPayload", JSONBoolean.getInstance(getSkipPayload() == 1 ? true : false));
		obj.put("skipProtocol", JSONBoolean.getInstance(getSkipProtocol() == 1 ? true : false));
		obj.put("skipServer", JSONBoolean.getInstance(getSkipServer() == 1 ? true : false));
		obj.put("time", new JSONNumber(getTime()));
		obj.put("url", new JSONString(getURL() == null ? "" : getURL()));
		return obj;
	}
	
	
	public final native String toJSON() /*-{
		return JSON.stringify(this);
	}-*/;
	public static final native RequestObject fromString(String jsonData) /*-{
		try{
			return JSON.parse(jsonData);
		} catch(e){}
		return null;
	}-*/;
}
