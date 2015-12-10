/*******************************************************************************
 * Copyright 2012 Pawel Psztyc
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
 * interface is window.indexedDB. You open that is, create and access and
 * delete a database with the object and not directly with IDBFactory.
 * 
 * See
 * <a href="https://developer.mozilla.org/en/IndexedDB/IDBFactory">https
 * ://developer.mozilla.org/en/IndexedDB/IDBFactory</a>
 * 
 * @author Pawel Psztyc
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
	 * <p>The open() method of the IDBFactory requests opening a connection to a
	 * database.</p>
	 * 
	 * <p>The method returns an {@link IDBOpenDBRequest} object immediately, and performs
	 * the open operation asynchronously. If the operation is successful, a
	 * success event is fired on the request object that is returned from this
	 * method, with its result attribute set to the new {@link IDBDatabase} object for
	 * the connection.</p>
	 * 
	 * <p>If an error occurs while the database connection is being opened, then an
	 * error event is fired on the request object returned from this method.</p>
	 * 
	 * <p>May trigger upgradeneeded, blocked or versionchange events.</p>
	 * 
	 * <p>See <a href="https://developer.mozilla.org/en/IndexedDB/IDBFactory">https
	 * ://developer.mozilla.org/en/IndexedDB/IDBFactory</a></p>
	 * 
	 * @param name
	 *            The name of the database.
	 * @return A IDBOpenDBRequest object on which subsequent events related to
	 *         this request are fired.
	 * 
	 * @exception This
	 *                method may raise a DOMException with a DOMError of the
	 *                following types:
	 * <table>
	 * 	<tr>
	 * 		<th>Attribute</th>
	 * 		<th>Description</th>
	 *  </tr>
	 *  <tr>
	 *  	<td>TypeError</td>
	 * 		<td>The value of version is zero or a negative number or not a number.</td>
	 *  </tr>
	 * </table>
	 * 
	 */
	public final native IDBRequest<JavaScriptObject> open(String name) throws JavaScriptException /*-{
		var openRequest = $wnd.indexedDB.open(name);
		return openRequest;
	}-*/;

	/**
	 * The open() method of the IDBFactory requests opening a connection to a
	 * database.
	 * 
	 * The method returns an {@link IDBOpenDBRequest} object immediately, and performs
	 * the open operation asynchronously. If the operation is successful, a
	 * success event is fired on the request object that is returned from this
	 * method, with its result attribute set to the new IDBDatabase object for
	 * the connection.
	 * 
	 * If an error occurs while the database connection is being opened, then an
	 * error event is fired on the request object returned from this method.
	 * 
	 * May trigger upgradeneeded, blocked or versionchange events.
	 * 
	 * See <a href="https://developer.mozilla.org/en/IndexedDB/IDBFactory">https
	 * ://developer.mozilla.org/en/IndexedDB/IDBFactory</a>
	 * 
	 * @param name
	 *            The name of the database.
	 * @param version
	 *            The version to open the database with. If the version is not
	 *            provided and the database exists, then a connection to the
	 *            database will be opened without changing its version. If the
	 *            version is not provided and the database does not exist, then
	 *            it will be created with version 1.
	 * 
	 * @return A IDBOpenDBRequest object on which subsequent events related to
	 *         this request are fired.
	 * 
	 * @exception This
	 *                method may raise a DOMException with a DOMError of the
	 *                following types:
	 * <table>
	 * 	<tr>
	 * 		<th>Attribute</th>
	 * 		<th>Description</th>
	 *  </tr>
	 *  <tr>
	 *  	<td>TypeError</td>
	 * 		<td>The value of version is zero or a negative number or not a number.</td>
	 *  </tr>
	 * </table>
	 */
	public final native IDBOpenDBRequest open(String name, String version) throws JavaScriptException /*-{
		var openRequest = $wnd.indexedDB.open(name, version);
		return openRequest;
	}-*/;

	/**
	 * The deleteDatabase() method of the {@link IDBFactory} interface requests
	 * the deletion of a database. The method returns an
	 * {@link IDBOpenDBRequest} object immediately, and performs the deletion
	 * operation asynchronously.
	 * 
	 * If the database is successfully deleted, then a success event is fired on
	 * the request object returned from this method, with its result set to
	 * undefined. If an error occurs while the database is being deleted, then
	 * an error event is fired on the request object that is returned from this
	 * method.
	 * 
	 * Will trigger an upgradedneeded event and, if any other tabs have open
	 * connections to the database, a blocked event.
	 * 
	 * @param name
	 *            The name of the database to be deleted.
	 * @return A {@link IDBOpenDBRequest} on which subsequent events related to
	 *         this request are fired.
	 */
	public final native IDBRequest<JavaScriptObject> deleteDatabase(String name)/*-{
		return $wnd.indexedDB.deleteDatabase(name);
	}-*/;
	
	/**
	 * <p>The cmp() method of the {@link IDBFactory} interface compares two values as keys
	 * to determine equality and ordering for IndexedDB operations, such as
	 * storing and iterating.<p>
	 * 
	 * <p>Note: Do not use this method for comparing arbitrary JavaScript values,
	 * because many JavaScript values are either not valid IndexedDB keys
	 * (booleans and objects, for example) or are treated as equivalent
	 * IndexedDB keys (for example, since IndexedDB ignores arrays with
	 * non-numeric properties and treats them as empty arrays, so any
	 * non-numeric arrays are treated as equivalent). This throws an exception
	 * if either of the values is not a valid key.</p>
	 * 
	 * @param first
	 *            The first key to compare.
	 * @param second
	 *            The second key to compare.
	 * @return An integer that indicates the result of the comparison; the table
	 *         below lists the possible values and their meanings: 
	 *         -1 1st key < 2nd, <br/>
	 *         0 1st key = 2nd, <br/>
	 *         1 1st key > 2nd
	 * @throws JavaScriptException This method may raise a DOMException with a DOMError of the following types:
	 * <table>
	 * 	<tr>
	 * 		<th>Attribute</th>
	 * 		<th>Description</th>
	 *  </tr>
	 *  <tr>
	 *  	<td>DataError</td>
	 * 		<td>One of the supplied keys was not a valid key.</td>
	 *  </tr>
	 * </table>
	 */
	public final int cmp(JavaScriptObject key1, JavaScriptObject key2) throws IDBDatabaseException {
		try {
			return this.cmpImpl(key1, key2);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	
	private final native int cmpImpl(JavaScriptObject first, JavaScriptObject second) throws JavaScriptException /*-{
		return $wnd.indexedDB.cmp(first, second);
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
