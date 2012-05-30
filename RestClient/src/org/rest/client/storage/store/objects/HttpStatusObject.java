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
 * This class represents HTTP status data stored in statuses store.
 * 
 * @author Paweł Psztyć
 * 
 */
public class HttpStatusObject extends JavaScriptObject {
	protected HttpStatusObject() {
	}

	/**
	 * Create Request History object with predefined values.
	 * 
	 * @return
	 */
	public static final native HttpStatusObject create() /*-{
		return {
			code: 0, //search key
			label: null,
			desc : null
		}
	}-*/;

	/**
	 * @return IDB ID.
	 */
	public final native int getId() /*-{
		return this.id;
	}-*/;

	public final native void setLabel(String label) /*-{
		this.label = label;
	}-*/;

	/**
	 * @return Status label text
	 */
	public final native String getLabel() /*-{
		return this.label;
	}-*/;

	/**
	 * Sets status code value
	 * 
	 * @param code
	 */
	public final native void setCode(int code) /*-{
		this.code = code;
	}-*/;

	/**
	 * @return saved HTTP status code value
	 */
	public final native int getCode() /*-{
		return this.code;
	}-*/;

	/**
	 * Sets code description
	 * 
	 * @param desc
	 *            Description to set
	 */
	public final native void setDesc(String desc) /*-{
		this.desc = desc;
	}-*/;

	/**
	 * @return Saved description value
	 */
	public final native String getDesc() /*-{
		return this.desc;
	}-*/;
}
