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
			created: new Date() //order key
		}
	}-*/;

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
		return this.skipProtocol;
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
		return this.skipServer;
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
		return this.skipParams;
	}-*/;

	public final native void setSkipHistory(boolean skipHistory) /*-{
		this.skipHistory = skipHistory;
	}-*/;

	public final native boolean isSkipHistory() /*-{
		return this.skipHistory;
	}-*/;

	public final native void setSkipMethod(boolean skipMethod) /*-{
		this.skipMethod = skipMethod;
	}-*/;

	public final native boolean isSkipMethod() /*-{
		return this.skipMethod;
	}-*/;

	public final native void setSkipPayload(boolean skipPayload) /*-{
		this.skipPayload = skipPayload;
	}-*/;

	public final native boolean isSkipPayload() /*-{
		return this.skipPayload;
	}-*/;
	
	public final native void setSkipHeaders(boolean skipHeaders) /*-{
		this.skipHeaders = skipHeaders;
	}-*/;
	
	public final native boolean isSkipHeaders() /*-{
		return this.skipHeaders;
	}-*/;
	
	public final native void setSkipPath(boolean skipPath) /*-{
		this.skipPath = skipPath;
	}-*/;
	
	public final native boolean isSkipPath() /*-{
		return this.skipPath;
	}-*/;

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
