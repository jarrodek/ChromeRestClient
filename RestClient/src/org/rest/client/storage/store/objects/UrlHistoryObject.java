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
 * This class represents form encoding data row object.
 * 
 * @author Paweł Psztyć
 * 
 */
public class UrlHistoryObject extends JavaScriptObject {
	protected UrlHistoryObject() {
	}
	
	/**
	 * Create Request History object with predefined values.
	 * 
	 * @return
	 */
	public static final native UrlHistoryObject create() /*-{
		return {
			url : null, //search key
			count : 0
		}
	}-*/;

	/**
	 * @return IDB ID.
	 */
	public final native int getId() /*-{
		return this.id;
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
	 * Set number of times when user sent HTTP request to URL. URL's are unique
	 * in DB but to properly order values fill sort it for count value.
	 * 
	 * @param count
	 *            number
	 */
	public final native void setCount(double count) /*-{
		this.count = count;
	}-*/;

	/**
	 * @return number of times when user sent request for given URL.
	 */
	public final native String getCount() /*-{
		return this.count;
	}-*/;
}
