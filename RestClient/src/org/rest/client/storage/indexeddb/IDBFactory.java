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

import com.google.gwt.core.client.JavaScriptException;
import com.google.gwt.core.client.JavaScriptObject;

/**
 * The IDBFactory interface of the IndexedDB API lets applications
 * asynchronously access the indexed databases. The object that implements the
 * interface is window.indexedDB. You open—that is, create and access—and delete
 * a database with the object and not directly with IDBFactory.
 * 
 * This interface still has vendor prefixes, that is to say, you have to make
 * calls with mozIndexedDB.open() for Firefox and webkitIndexedDB.open() for
 * Chrome. See <a
 * href="https://developer.mozilla.org/en/IndexedDB/IDBFactory">https
 * ://developer.mozilla.org/en/IndexedDB/IDBFactory</a>
 * 
 * @author jarrod
 * 
 */
public class IDBFactory {

	public static IDBFactory getIfSupported() {
		if (!isValid()) {
			return null;
		}
		return new IDBFactory();
	}

	/**
	 * Request opening a connection to a database. The method returns an
	 * IDBRequest object immediately, and performs the opening operation
	 * asynchronously.<br/>
	 * <br/>
	 * <b>Warning:</b> The description documents the old specification. Some
	 * browsers still implement this method. The specifications have changed,
	 * but the changes have not yet been implemented by all browser. See the
	 * compatibility table for more information. See <a
	 * href="https://developer.mozilla.org/en/IndexedDB/IDBFactory">https
	 * ://developer.mozilla.org/en/IndexedDB/IDBFactory</a>
	 * 
	 * @param dbName
	 * @return A request object on which subsequent events related to this
	 *         request are fired. In the latest draft of the specification,
	 *         which has not yet been implemented by browsers, the returned
	 *         object is {@link IDBOpenDBRequest}.
	 */
	public final native IDBRequest<JavaScriptObject> open(String dbName)/*-{
		var openRequest = $wnd.indexedDB.open(dbName);
		return openRequest;
	}-*/;

	/**
	 * Request opening a connection to a database. The method returns an
	 * IDBRequest object immediately, and performs the opening operation
	 * asynchronously.<br/>
	 * <br/>
	 * <b>Warning:</b> The description documents the old specification. Some
	 * browsers still implement this method. The specifications have changed,
	 * but the changes have not yet been implemented by all browser. See the
	 * compatibility table for more information. See <a
	 * href="https://developer.mozilla.org/en/IndexedDB/IDBFactory">https
	 * ://developer.mozilla.org/en/IndexedDB/IDBFactory</a>
	 * 
	 * <br/>
	 * This method may not work yet!
	 * 
	 * @param dbName
	 * @return A request object on which subsequent events related to this
	 *         request are fired. In the latest draft of the specification,
	 *         which has not yet been implemented by browsers, the returned
	 *         object is {@link IDBOpenDBRequest}.
	 */
	public final native IDBOpenDBRequest open(String dbName, String version)/*-{
		var openRequest = $wnd.indexedDB.open(dbName, version);
		return openRequest;
	}-*/;

	/**
	 * Request deleting a database. The method returns an IDBRequest object
	 * immediately, and performs the deletion operation asynchronously.
	 * 
	 * @param dbName
	 *            The name of the database.
	 * @return
	 */
	public final native IDBRequest<JavaScriptObject> deleteDatabase(
			String dbName)/*-{
		return $wnd.indexedDB.deleteDatabase(dbName);
	}-*/;

	public final int compare(JavaScriptObject key1, JavaScriptObject key2)
			throws IDBDatabaseException {
		try {
			return this.compareImpl(key1, key2);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	/**
	 * Compares two values as keys to determine equality and ordering for
	 * IndexedDB operations, such as storing and iterating. Do not use this
	 * method for comparing arbitrary JavaScript values, because many JavaScript
	 * values are either not valid IndexedDB keys (booleans and objects, for
	 * example) or are treated as equivalent IndexedDB keys (for example, since
	 * IndexedDB ignores arrays with non-numeric properties and treats them as
	 * empty arrays, so any non-numeric array are treated as equivalent).
	 * 
	 * @param key1
	 *            The first key to compare.
	 * @param key2
	 *            The second key to compare.
	 * @return -1 1st key < 2nd, <br/>
	 *         0 1st key = 2nd, <br/>
	 *         1 1st key > 2nd
	 * @throws JavaScriptException
	 */
	private final native int compareImpl(JavaScriptObject key1,
			JavaScriptObject key2) throws JavaScriptException /*-{
		return $wnd.indexedDB.cmp(key1, key2);
	}-*/;

	final static native boolean isValid() /*-{

		// Taking care of the browser-specific prefixes.
		if ('webkitIndexedDB' in window) {
			$wnd.indexedDB = $wnd.webkitIndexedDB;
			$wnd.IDBTransaction = $wnd.webkitIDBTransaction;
			$wnd.IDBKeyRange = $wnd.webkitIDBKeyRange;
		} else if ('mozIndexedDB' in window) {
			$wnd.indexedDB = $wnd.mozIndexedDB;
		}
		return $wnd.indexedDB != null;
	}-*/;
}
