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
 * This class represents header data stored in headers store.
 * 
 * @author Paweł Psztyć
 * 
 */
public class HeadersObject extends JavaScriptObject {
	protected HeadersObject() {
	}

	/**
	 * Create Request History object with predefined values.
	 * 
	 * @return
	 */
	public static final native HeadersObject create() /*-{
		return {
			header : null, //search key
			type : "request", // search key, either request or response,
			desc : null,
			example : null
		}
	}-*/;

	/**
	 * @return IDB ID.
	 */
	public final native int getId() /*-{
		return this.id;
	}-*/;

	public final native void setHeader(String header) /*-{
		this.header = header;
	}-*/;

	/**
	 * @return Header name
	 */
	public final native String getHeader() /*-{
		return this.header;
	}-*/;

	/**
	 * Sets header type
	 * 
	 * @param type
	 *            Header type, either "request" or "response"
	 */
	public final native void setType(String type) /*-{
		this.type = type;
	}-*/;

	/**
	 * @return saved header type, either "request" or "response"
	 */
	public final native String getType() /*-{
		return this.type;
	}-*/;

	/**
	 * Sets header description
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

	/**
	 * Sets header example data.
	 * 
	 * @param example
	 *            Example to set
	 */
	public final native void setExample(String example) /*-{
		this.example = example;
	}-*/;

	/**
	 * @return Saved header example
	 */
	public final native String getExample() /*-{
		return this.example;
	}-*/;
}
