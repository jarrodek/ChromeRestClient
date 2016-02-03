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

import java.util.ArrayList;

import org.rest.client.RestClient;
import org.rest.client.log.Log;
import org.rest.client.request.FilesObject;
import org.rest.client.storage.StoreKeys;

import com.google.gwt.chrome.storage.Storage;
import com.google.gwt.chrome.storage.StorageArea.StorageItemsCallback;
import com.google.gwt.chrome.storage.StorageArea.StorageSimpleCallback;
import com.google.gwt.chrome.storage.StorageResult;
import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JavaScriptObject;
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
			time: Date.now(),
			driveId: null
		}
	}-*/;
	
	public static final native RequestObject fromImportData(RequestDataJso obj) /*-{
		var headers = '';
		
		var haveCt = false;
		if(obj.headers && obj.headers.length){
			obj.headers.forEach(function(header){
				if(header.key && header.value){
					headers += '\n' + header.key + ': ' + header.value;
					if(header.key.toLowerCase() === 'content-type') {
						haveCt = true;
					}
				}
			});
		}
		if(obj.encoding && !haveCt){
			headers += 'Content-Type: ' + obj.encoding;
		}
		return {
			id: -1,
			name : obj.name,
			project : 0,
			url : obj.url,
			method : obj.method,
			encoding : null,
			headers : headers,
			payload : obj.post,
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
	public final native void resetId() /*-{
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
		return this.method || "GET";
	}-*/;

	//"application/x-www-form-urlencoded";
	public final native String getEncoding() /*-{
		return this.encoding || null;
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
		if(this.har){
			this.har.pages[0].title = name;
		}
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
		if(this.har){
			return;
		}
		this.project = project;
	}-*/;

	/**
	 * @return {@link RequestObject} as a {@link JSONObject}
	 */
	public final JSONObject toJSONObject(){
		JSONObject obj = new JSONObject();
		obj.put("id", new JSONNumber(getId()));
		obj.put("encoding", new JSONString(""));
		obj.put("headers", new JSONString(getHeaders() == null ? "" : getHeaders()));
		obj.put("method", new JSONString(getMethod() == null ? "" : getMethod()));
		obj.put("name", new JSONString(getName() == null ? "" : getName()));
		obj.put("payload", new JSONString(getPayload() == null ? "" : getPayload()));
		obj.put("project", new JSONNumber(getProject()));
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
		to.setFiles(from.getFiles());
		to.setHeaders(from.getHeaders());
		to.setMethod(from.getMethod());
		to.setName(from.getName());
		to.setPayload(from.getPayload());
		to.setProject(from.getProject());
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
		Storage store = GWT.create(Storage.class);
		JSONObject jo = new JSONObject();
		jo.put(StoreKeys.LATEST_REQUEST_KEY, new JSONObject(null));
		store.getLocal().get(jo.getJavaScriptObject(), new StorageItemsCallback() {
			
			@Override
			public void onError(String message) {
				if(RestClient.isDebug()){
					Log.error("RequestObject::restoreLatest - " + message);
				}
			}

			@Override
			public void onResult(JavaScriptObject data) {
				StorageResult<RequestObject> result = data.cast();
				if(result == null){
					callback.onSuccess(null);
					return;
				}
				RequestObject ro = result.getObject(StoreKeys.LATEST_REQUEST_KEY).cast();
				if(ro != null){
					callback.onSuccess(ro);
				} else {
					Log.error("Error perform RequestObject::restoreLatest. Result is null.");
					callback.onFailure(new Throwable("Error perform RequestObject::restoreLatest. Result is null."));
				}
			}
		});
	}
	
	/**
	 * Store this request as a latest request
	 */
	public final void storeLastest(final Callback<Void, Throwable> callback){
		Storage store = GWT.create(Storage.class);
		JSONObject requestData = toJSONObject();
		JSONObject save = new JSONObject();
		save.put(StoreKeys.LATEST_REQUEST_KEY, requestData);
		store.getLocal().set(save.getJavaScriptObject(), new StorageSimpleCallback() {
			
			@Override
			public void onError(String message) {
				callback.onFailure(new Throwable(message));
			}
			
			@Override
			public void onDone() {
				Void v = GWT.create(Void.class);
				callback.onSuccess(v);
			}
		});
	}
	
	
}
