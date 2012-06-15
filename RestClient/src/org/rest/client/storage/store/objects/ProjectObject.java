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
 * This class represents form encoding data row object.
 * 
 * @author Paweł Psztyć
 * 
 */
public class ProjectObject extends JavaScriptObject {
	protected ProjectObject() {
	}
	
	/**
	 * Create Request History object with predefined values.
	 * @return
	 */
	public static final native ProjectObject create() /*-{
		return {
			name: null,
			timeStamp: new Date().getTime()
		}
	}-*/;
	
	/**
	 * @return IDB ID.
	 */
	public final native int getId() /*-{
		return this.id;
	}-*/;
	
	public final native void setCreated(Date created) /*-{
		this.timeStamp = created.getTime();
	}-*/;

	public final native double getCreated() /*-{
		return this.timeStamp;
	}-*/;
	/**
	 * Sets project name
	 * 
	 * @param name
	 *            Project name to set.
	 */
	public final native void setName(String name) /*-{
		this.name = name;
	}-*/;

	/**
	 * @return Saved project name
	 */
	public final native String getName() /*-{
		return this.name;
	}-*/;
}
