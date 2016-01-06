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
package org.rest.client.storage.indexeddb;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * An options object whose attributes are optional parameters to the {@link IDBDatabase} createObjectStore method.
 * @author Pawel Psztyc
 *
 */
public class IDBObjectStoreParameters extends JavaScriptObject {
	protected IDBObjectStoreParameters(){}
	
	public static final native IDBObjectStoreParameters create() /*-{
		return {};
	}-*/;
	/**
	 * @param keyPath The key path to be used by the new object store. If empty or not specified, the object store is created without a key path and uses out-of-line keys. You can also pass in an array as a keyPath.
	 */
	public final native void setKeyPath(String keyPath) /*-{
		this.keyPath = keyPath;
	}-*/;
	/**
	 * 
	 * @param isAutoIncrement If true, the object store has a key generator. Defaults to false.
	 */
	public final native void setAutoIncrement(boolean isAutoIncrement) /*-{
		this.autoIncrement = isAutoIncrement;
	}-*/;
	
}
