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
 * See <a href="https://developer.mozilla.org/en/IndexedDB/IDBObjectStore#createIndex">https://developer.mozilla.org/en/IndexedDB/IDBObjectStore#createIndex</a>
 * @author jarrod
 *
 */
public class IDBIndexParameters extends JavaScriptObject {
	protected IDBIndexParameters(){}
	
	public static final native IDBIndexParameters create() /*-{
		return {};
	}-*/;
	
	/**
	 * 
	 * @param unique If true, the index will not allow duplicate values for a single key.
	 */
	public final native void setUnique(boolean unique)/*-{
		this.unique = unique;
	}-*/;
	/**
	 * 
	 * @param multientry If true, the index will add an entry in the index for each array element when the keypath resolves to an Array. If false, it will add one single entry containing the Array.
	 */
	public final native void setMultientry(boolean multientry)/*-{
		this.multientry = multientry;
	}-*/;
}
