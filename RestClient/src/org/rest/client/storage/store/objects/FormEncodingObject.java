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
public class FormEncodingObject extends JavaScriptObject {
	protected FormEncodingObject() {
	}
	
	/**
	 * Create Request History object with predefined values.
	 * @return
	 */
	public static final native FormEncodingObject create() /*-{
		return {
			encoding: null
		}
	}-*/;
	
	public final native int getId() /*-{
		var id = -1;
		if(this.id){
			id = this.id;
		}
		return id;
	}-*/;
	
	
	/**
	 * Sets application data encoding values
	 * 
	 * @param encoding
	 *            Encoding to set. Any valid encoding value
	 */
	public final native void setEncoding(String encoding) /*-{
		this.encoding = encoding;
	}-*/;

	/**
	 * @return Saved request encoding
	 */
	public final native String getEncoding() /*-{
		return this.encoding;
	}-*/;
}
