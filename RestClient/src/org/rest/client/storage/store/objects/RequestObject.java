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

import org.rest.client.RestClient;
import org.rest.client.request.FilesObject;
import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.store.LocalStore;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.json.client.JSONBoolean;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;

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
public class RequestObject extends JavaScriptObject {
	protected RequestObject() {
	}
	/**
	 * Create Request object with predefined values.
	 * @return
	 */
	public static final native RequestObject createRequest() /*-{
		return {
			id: -1,
			name : null,
			project : 0,
			url : null,
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
			time: Date.now(),
			
			//additional, non DB fields
			driveId: null
		}
	}-*/;
	
	
	public final native int getId() /*-{
		if(isNaN(this.id)){
			this.id = 0;
		}
		return this.id || 0;
	}-*/;
	
	
	
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
		return this.method || "GET";
	}-*/;

	
	public final native void setEncoding(String encoding) /*-{
		this.encoding = encoding;
	}-*/;

	//"application/x-www-form-urlencoded";
	public final native String getEncoding() /*-{
		return this.encoding || "application/x-www-form-urlencoded";
	}-*/;

	
	public final native void setHeaders(String headers) /*-{
		this.headers = headers;
	}-*/;

	/**
	 * @return Google drive ID for this item
	 */
	public final native String getGDriveId() /*-{
		return this.driveId || null;
	}-*/;
	
	/**
	 * Sets Google Drive ID rot this item  
	 * @param driveId
	 */
	public final native void setGDriveId(String driveId) /*-{
		this.driveId = driveId;
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
		if(isNaN(this.project)){
			this.project = 0;
		}
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
	public final native void setSkipParams(boolean skipParams) /*-{
		this.skipParams = skipParams;
	}-*/;

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
		obj.put("id", new JSONNumber(getId()));
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
		obj.put("driveId", new JSONString(getGDriveId() == null ? "" : getGDriveId()));
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
	/**
	 * Copy request object to new one without ID.
	 * Database API make it impossible to override ID.
	 * @param from
	 * @return
	 */
	public static RequestObject copyNew(RequestObject from){
		RequestObject to = RequestObject.createRequest();
		to.setEncoding(from.getEncoding());
		to.setFiles(from.getFiles());
		to.setHeaders(from.getHeaders());
		to.setMethod(from.getMethod());
		to.setName(from.getName());
		to.setPayload(from.getPayload());
		to.setProject(from.getProject());
		to.setSkipHeaders(from.getSkipHeaders() == 1 ? true : false);
		to.setSkipHistory(from.getSkipHistory() == 1 ? true : false);
		to.setSkipMethod(from.getSkipMethod() == 1 ? true : false);
		to.setSkipParams(from.getSkipParams() == 1 ? true : false);
		to.setSkipPath(from.getSkipPath() == 1 ? true : false);
		to.setSkipPayload(from.getSkipPayload() == 1 ? true : false);
		to.setSkipProtocol(from.getSkipPayload() == 1 ? true : false);
		to.setSkipServer(from.getSkipServer() == 1 ? true : false);
		to.setTime(from.getTime());
		to.setURL(from.getURL());
		to.setGDriveId(from.getGDriveId());
		return to;
	}
	
	
	
	/**
	 * 
	 * @param clientFactory
	 * @param callback
	 */
	public static void restoreLatest(final Callback<RequestObject, Throwable> callback){
		
		final LocalStore store = RestClient.getClientFactory().getLocalStore();
		store.open(new StoreResultCallback<Boolean>() {
			
			@Override
			public void onSuccess(Boolean result) {
				if(!result){
					callback.onFailure(null);
					return;
				}
				store.getByKey(LocalStore.LATEST_REQUEST_KEY, new StoreResultCallback<String>() {
					
					@Override
					public void onSuccess(String result) {
						RequestObject ro = fromString(result);
						callback.onSuccess(ro);
					}
					
					@Override
					public void onError(Throwable e) {
						Log.error("Error perform getByKey.",e);
						callback.onFailure(e);
					}
				});
			}
			
			@Override
			public void onError(Throwable e) {
				callback.onFailure(e);
			}
		});
	}
	
}
