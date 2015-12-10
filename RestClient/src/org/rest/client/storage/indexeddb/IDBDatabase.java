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

import org.rest.client.dom.DOMStringList;

import com.google.gwt.core.client.JavaScriptException;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArrayString;

/**
 * <p>
 * The IDBDatabase interface of the IndexedDB API provides a connection to a
 * database; you can use an IDBDatabase object to open a transaction on your
 * database then create, manipulate, and delete objects (data) in that database.
 * The interface provides the only way to get and manage versions of the
 * database.
 * </p>
 * 
 * <p>
 * Note: Everything you do in IndexedDB always happens in the context of a
 * transaction, representing interactions with data in the database. All objects
 * in IndexedDB — including object stores, indexes, and cursors — are tied to a
 * particular transaction. Thus, you cannot execute commands, access data, or
 * open anything outside of a transaction.
 * </p>
 * 
 * @author Pawel Psztyc
 *
 */
public class IDBDatabase extends JavaScriptObject {
	protected IDBDatabase() {
	}

	/**
	 * The name property of the {@link IDBDatabase} interface is a
	 * {@link String} (DOMString) that contains the name of the connected
	 * database.
	 * 
	 * @return A DOMString containing the name of the connected database.
	 */
	public final native String getName() /*-{
		return this.name;
	}-*/;

	/**
	 * The version property of the {@link IDBDatabase} interface is a 64-bit
	 * integer that contains the version of the connected database. When a
	 * database is first created, this attribute is an empty string.
	 * 
	 * @return An integer containing the version of the connected database.
	 */
	public final native String getVersion() /*-{
		return this.version;
	}-*/;

	/**
	 * The objectStoreNames property of the {@link IDBDatabase} interface is a
	 * {@link DOMStringList} containing a list of the names of the object stores
	 * currently in the connected database.
	 * 
	 * @return
	 */
	public final native DOMStringList getObjectStoreNames() /*-{
		return this.objectStoreNames;
	}-*/;

	/**
	 * <p>
	 * The close() method of the IDBDatabase interface returns immediately and
	 * closes the connection in a separate thread.
	 * </p>
	 * 
	 * <p>
	 * The connection is not actually closed until all transactions created
	 * using this connection are complete. No new transactions can be created
	 * for this connection once this method is called. Methods that create
	 * transactions throw an exception if a closing operation is pending.
	 * </p>
	 */
	public final native void close() /*-{
		return this.close();
	}-*/;

	/**
	 * <p>
	 * The createObjectStore() method of the IDBDatabase interface creates and
	 * returns a new object store or index.
	 * </p>
	 * 
	 * <p>
	 * The method takes the name of the store as well as a parameter object that
	 * lets you define important optional properties. You can use the property
	 * to uniquely identify individual objects in the store. As the property is
	 * an identifier, it should be unique to every object, and every object
	 * should have that property.
	 * </p>
	 * 
	 * <p>
	 * This method can be called only within a versionchange transaction.
	 * </p>
	 * 
	 * @param name
	 *            The name of the new object store to be created. Note that it
	 *            is possible to create an object store with an empty name.
	 * @param parameters
	 *            An options object whose attributes are optional parameters to
	 *            the method. It includes the following properties:
	 *            <table>
	 *            <tr>
	 *            <th>Attribute</th>
	 *            <th>Description</th>
	 *            </tr>
	 *            <tr>
	 *            <td>keyPath</td>
	 *            <td>The key path to be used by the new object store. If empty
	 *            or not specified, the object store is created without a key
	 *            path and uses out-of-line keys. You can also pass in an array
	 *            as a keyPath.</td>
	 *            </tr>
	 *            <tr>
	 *            <td>autoIncrement</td>
	 *            <td>If true, the object store has a key generator. Defaults to
	 *            false.</td>
	 *            </tr>
	 *            </table>
	 * @return The newly created object store.
	 * @throws IDBDatabaseException
	 *             This method may raise a DOMException with a DOMError of one
	 *             of the following types:
	 *             <table>
	 *             <tr>
	 *             <th>Attribute</th>
	 *             <th>Description</th>
	 *             </tr>
	 *             <tr>
	 *             <td>InvalidStateError</td>
	 *             <td>Occurs if the method was not called from a versionchange
	 *             transaction callback. For older WebKit browsers, you must
	 *             call
	 *             <ul>
	 *             <li>IDBDatabase</li>
	 *             <li>Properties</li>
	 *             <ul>
	 *             <li>IDBDatabase.name</li>
	 *             <li>IDBDatabase.objectStoreNames</li>
	 *             <li>IDBDatabase.onabort</li>
	 *             <li>IDBDatabase.onerror</li>
	 *             <li>IDBDatabase.onversionchange</li>
	 *             <li>IDBDatabase.version</li>
	 *             </ul>
	 *             <li>Methods</li>
	 *             <ul>
	 *             <li>IDBDatabase.close()</li>
	 *             <li>IDBDatabase.createObjectStore()</li>
	 *             <li>IDBDatabase.deleteObjectStore()</li>
	 *             <li>IDBDatabase.transaction()</li>
	 *             </ul>
	 *             <li>Inheritance</li>
	 *             <ul>
	 *             <li>EventTarget</li>
	 *             </ul>
	 *             </ul>
	 *             first.</td>
	 *             </tr>
	 *             <tr>
	 *             <td>TransactionInactiveError</td>
	 *             <td>ccurs if a request is made on a source database that
	 *             doesn't exist (e.g. has been deleted or removed.) In Firefox
	 *             previous to version 41, an InvalidStateError was raised in
	 *             this case as well, which was misleading; this has now been
	 *             fixed</td>
	 *             </tr>
	 *             <tr>
	 *             <td>ConstraintError</td>
	 *             <td>An object store with the given name (based on
	 *             case-sensitive comparison) already exists in the connected
	 *             database.</td>
	 *             </tr>
	 *             <tr>
	 *             <td>InvalidAccessError</td>
	 *             <td>If autoIncrement is set to true and keyPath is either an
	 *             empty string or an array containing an empty string.</td>
	 *             </tr>
	 *             </table>
	 */
	public final IDBObjectStore<?> createObjectStore(String name, IDBObjectStoreParameters parameters)
			throws IDBDatabaseException {
		try {
			return createObjectStoreImpl(name, parameters);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	/**
	 * <p>
	 * The createObjectStore() method of the IDBDatabase interface creates and
	 * returns a new object store or index.
	 * </p>
	 * 
	 * <p>
	 * The method takes the name of the store as well as a parameter object that
	 * lets you define important optional properties. You can use the property
	 * to uniquely identify individual objects in the store. As the property is
	 * an identifier, it should be unique to every object, and every object
	 * should have that property.
	 * </p>
	 * 
	 * <p>
	 * This method can be called only within a versionchange transaction.
	 * </p>
	 * 
	 * @param name
	 *            The name of the new object store to be created. Note that it
	 *            is possible to create an object store with an empty name.
	 * @return The newly created object store.
	 * @throws IDBDatabaseException
	 *             This method may raise a DOMException with a DOMError of one
	 *             of the following types:
	 *             <table>
	 *             <tr>
	 *             <th>Attribute</th>
	 *             <th>Description</th>
	 *             </tr>
	 *             <tr>
	 *             <td>InvalidStateError</td>
	 *             <td>Occurs if the method was not called from a versionchange
	 *             transaction callback. For older WebKit browsers, you must
	 *             call
	 *             <ul>
	 *             <li>IDBDatabase</li>
	 *             <li>Properties</li>
	 *             <ul>
	 *             <li>IDBDatabase.name</li>
	 *             <li>IDBDatabase.objectStoreNames</li>
	 *             <li>IDBDatabase.onabort</li>
	 *             <li>IDBDatabase.onerror</li>
	 *             <li>IDBDatabase.onversionchange</li>
	 *             <li>IDBDatabase.version</li>
	 *             </ul>
	 *             <li>Methods</li>
	 *             <ul>
	 *             <li>IDBDatabase.close()</li>
	 *             <li>IDBDatabase.createObjectStore()</li>
	 *             <li>IDBDatabase.deleteObjectStore()</li>
	 *             <li>IDBDatabase.transaction()</li>
	 *             </ul>
	 *             <li>Inheritance</li>
	 *             <ul>
	 *             <li>EventTarget</li>
	 *             </ul>
	 *             </ul>
	 *             first.</td>
	 *             </tr>
	 *             <tr>
	 *             <td>TransactionInactiveError</td>
	 *             <td>ccurs if a request is made on a source database that
	 *             doesn't exist (e.g. has been deleted or removed.) In Firefox
	 *             previous to version 41, an InvalidStateError was raised in
	 *             this case as well, which was misleading; this has now been
	 *             fixed</td>
	 *             </tr>
	 *             <tr>
	 *             <td>ConstraintError</td>
	 *             <td>An object store with the given name (based on
	 *             case-sensitive comparison) already exists in the connected
	 *             database.</td>
	 *             </tr>
	 *             <tr>
	 *             <td>InvalidAccessError</td>
	 *             <td>If autoIncrement is set to true and keyPath is either an
	 *             empty string or an array containing an empty string.</td>
	 *             </tr>
	 *             </table>
	 */
	public final IDBObjectStore<?> createObjectStore(String name) throws IDBDatabaseException {
		try {
			return createObjectStoreImpl(name, null);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	private final native IDBObjectStore<?> createObjectStoreImpl(String name, IDBObjectStoreParameters parameters)
			throws JavaScriptException /*-{
		return this.createObjectStore(name, parameters);
	}-*/;

	/**
	 * <p>
	 * The deleteObjectStore() method of the {@link IDBDatabase} interface
	 * destroys the object store with the given name in the connected database,
	 * along with any indexes that reference it.
	 * </p>
	 * 
	 * <p>
	 * As with IDBDatabase.createObjectStore, this method can be called only
	 * within a versionchange transaction.
	 * </p>
	 * 
	 * @param name
	 *            The name of the data store to delete.
	 * @return Void
	 * @throws IDBDatabaseException
	 *             This method may raise a DOMException with a DOMError of one
	 *             of the following types:
	 *             <table>
	 *             <tr>
	 *             <th>Attribute</th>
	 *             <th>Description</th>
	 *             </tr>
	 *             <tr>
	 *             <td>InvalidStateError</td>
	 *             <td>Occurs if the method was not called from a versionchange
	 *             transaction callback. For older WebKit browsers, you must
	 *             call
	 *             <ul>
	 *             <li>IDBDatabase</li>
	 *             <li>Properties</li>
	 *             <ul>
	 *             <li>IDBDatabase.name</li>
	 *             <li>IDBDatabase.objectStoreNames</li>
	 *             <li>IDBDatabase.onabort</li>
	 *             <li>IDBDatabase.onerror</li>
	 *             <li>IDBDatabase.onversionchange</li>
	 *             <li>IDBDatabase.version</li>
	 *             </ul>
	 *             <li>Methods</li>
	 *             <ul>
	 *             <li>IDBDatabase.close()</li>
	 *             <li>IDBDatabase.createObjectStore()</li>
	 *             <li>IDBDatabase.deleteObjectStore()</li>
	 *             <li>IDBDatabase.transaction()</li>
	 *             </ul>
	 *             <li>Inheritance</li>
	 *             <ul>
	 *             <li>EventTarget</li>
	 *             </ul>
	 *             </ul>
	 *             first.</td>
	 *             </tr>
	 *             <tr>
	 *             <td>TransactionInactiveError</td>
	 *             <td>ccurs if a request is made on a source database that
	 *             doesn't exist (e.g. has been deleted or removed.) In Firefox
	 *             previous to version 41, an InvalidStateError was raised in
	 *             this case as well, which was misleading; this has now been
	 *             fixed</td>
	 *             </tr>
	 *             <tr>
	 *             <td>NotFoundError</td>
	 *             <td>You are trying to delete an object store that does not
	 *             exist. Names are case sensitive.</td>
	 *             </tr>
	 *             </table>
	 */
	public final IDBRequest<Void> deleteObjectStore(String name) throws IDBDatabaseException {
		try {
			return deleteObjectStoreImpl(name);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	private final native IDBRequest<Void> deleteObjectStoreImpl(String name) throws JavaScriptException /*-{
		return this.deleteObjectStore(name);
	}-*/;

	/**
	 * The transaction method of the IDBDatabase interface immediately returns a
	 * transaction object (IDBTransaction) containing the
	 * IDBTransaction.objectStore method, which you can use to access your
	 * object store.<br/>
	 * Example in javascript:
	 * 
	 * <pre>
	 * var transaction = db.transaction(['my-store-name', 'my-store-name2'], IDBTransaction.READ_WRITE_TRANSACTION);
	 * </pre>
	 * 
	 * You cannot pass an empty array into the storeNames parameter, such as in
	 * the following: <br/>
	 * 
	 * <pre>
	 * var transaction = db.transaction([], IDBTransaction.READ_ONLY_TRANSACTION);
	 * </pre>
	 * 
	 * <br/>
	 * Use something like: example in javascript:
	 * 
	 * <pre>
	 * var transaction = db.transaction(db.objectStoreNames, IDBTransaction.READ_ONLY_TRANSACTION);
	 * </pre>
	 * 
	 * <br/>
	 * 
	 * Warning: Accessing all obejct stores under the
	 * {@link IDBTransaction#READ_WRITE} mode means that you can run
	 * only that transaction. You cannot have writing transactions with
	 * overlapping scopes.
	 * 
	 * @param storeNames
	 *            The names of object stores and indexes that are in the scope
	 *            of the new transaction, declared as an array of strings.
	 *            Specify only the object stores that you need to access. <br/>
	 *            If you need to access only one object store, you can specify
	 *            its name as a string. Therefore the following lines are
	 *            equivalent:
	 * 
	 *            <pre>
	 *            	//javascript
	 *            	var transaction = db.transaction(['my-store-name']); 
	 *            	var transaction = db.transaction('my-store-name');
	 *            	//GWT
	 *            	List names = new ArrayList();
	 *            	names.add("my-store-name");
	 *            	IDBTransaction transaction = db.transaction(names);
	 *            	IDBTransaction transaction = db.transaction("my-store-name");
	 *            </pre>
	 * 
	 *            If you need to access all object stores in the database, you
	 *            can use the property IDBDatabase.getObjectStoreNames():
	 * 
	 *            <pre>
	 *            // javascript
	 *            var transaction = db.transaction(db.objectStoreNames);
	 *            // GWT
	 *            IDBTransaction transaction = db.transaction(db.getObjectStoreNames());
	 *            </pre>
	 * 
	 *            Passing an empty array will throw an exception.
	 * @param mode
	 *            The types of access that can be performed in the transaction.
	 *            Transactions are opened in one of three modes: readonly,
	 *            readwrite. versionchange mode can't be specified here. If you
	 *            don't provide the parameter, the default access mode is
	 *            readonly. To avoid slowing things down, don't open a readwrite
	 *            transaction unless you actually need to write into the
	 *            database. <br/>
	 *            If you need to open the object store in readwrite mode to
	 *            change data, you would use the following:
	 * 
	 *            <pre>
	 *            IDBTransaction transaction = db.transaction("my-store-name", IDBTransaction.READ_WRITE_TRANSACTION);
	 *            </pre>
	 * 
	 *            {@link IDBTransaction#READ_ONLY},
	 *            {@link IDBTransaction#READ_WRITE}.
	 * 
	 *            If you don't provide the parameter, the default access mode is
	 *            READ_ONLY. To avoid slowing things down, don't open a
	 *            {@link IDBTransaction#READ_WRITE} transaction,
	 *            unless you actually need to write into the database.
	 * @return An IDBTransaction object. This method may raise a DOMException
	 *         with a DOMError of one of the following types:
	 *         <p>
	 *         InvalidStateError - The close() method has previously been called
	 *         on this IDBDatabase instance.
	 *         </p>
	 *         <p>
	 *         NotFoundError - An object store specified in in the storeNames
	 *         parameter has been deleted or removed.
	 *         </p>
	 *         <p>
	 *         TypeError - The value for the mode parameter is invalid.
	 *         </p>
	 *         <p>
	 *         InvalidAccessError - The function was called with an empty list
	 *         of store names.
	 *         </p>
	 */
	public final IDBTransaction transaction(String[] storeNames, String mode) throws IDBDatabaseException {
		try {
			JsArrayString store = JsArrayString.createArray().cast();
			for (String name : storeNames) {
				store.push(name);
			}

			return this.transactionImpl(store, mode);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	/**
	 * The transaction method of the IDBDatabase interface immediately returns a
	 * transaction object (IDBTransaction) containing the
	 * IDBTransaction.objectStore method, which you can use to access your
	 * object store.<br/>
	 * Example in javascript:
	 * 
	 * <pre>
	 * var transaction = db.transaction(['my-store-name', 'my-store-name2'], IDBTransaction.READ_WRITE_TRANSACTION);
	 * </pre>
	 * 
	 * You cannot pass an empty array into the storeNames parameter, such as in
	 * the following: <br/>
	 * 
	 * <pre>
	 * var transaction = db.transaction([], IDBTransaction.READ_ONLY_TRANSACTION);
	 * </pre>
	 * 
	 * <br/>
	 * Use something like: example in javascript:
	 * 
	 * <pre>
	 * var transaction = db.transaction(db.objectStoreNames, IDBTransaction.READ_ONLY_TRANSACTION);
	 * </pre>
	 * 
	 * <br/>
	 * 
	 * Warning: Accessing all obejct stores under the
	 * {@link IDBTransaction#READ_WRITE} mode means that you can run
	 * only that transaction. You cannot have writing transactions with
	 * overlapping scopes.
	 * 
	 * @param storeNames
	 *            The names of object stores and indexes that are in the scope
	 *            of the new transaction, declared as an array of strings.
	 *            Specify only the object stores that you need to access. <br/>
	 *            If you need to access only one object store, you can specify
	 *            its name as a string. Therefore the following lines are
	 *            equivalent:
	 * 
	 *            <pre>
	 *            	//javascript
	 *            	var transaction = db.transaction(['my-store-name']); 
	 *            	var transaction = db.transaction('my-store-name');
	 *            	//GWT
	 *            	List names = new ArrayList();
	 *            	names.add("my-store-name");
	 *            	IDBTransaction transaction = db.transaction(names);
	 *            	IDBTransaction transaction = db.transaction("my-store-name");
	 *            </pre>
	 * 
	 *            If you need to access all object stores in the database, you
	 *            can use the property IDBDatabase.getObjectStoreNames():
	 * 
	 *            <pre>
	 *            // javascript
	 *            var transaction = db.transaction(db.objectStoreNames);
	 *            // GWT
	 *            IDBTransaction transaction = db.transaction(db.getObjectStoreNames());
	 *            </pre>
	 * 
	 *            Passing an empty array will throw an exception.
	 * @param mode
	 *            The types of access that can be performed in the transaction.
	 *            Transactions are opened in one of three modes: readonly,
	 *            readwrite. versionchange mode can't be specified here. If you
	 *            don't provide the parameter, the default access mode is
	 *            readonly. To avoid slowing things down, don't open a readwrite
	 *            transaction unless you actually need to write into the
	 *            database. <br/>
	 *            If you need to open the object store in readwrite mode to
	 *            change data, you would use the following:
	 * 
	 *            <pre>
	 *            IDBTransaction transaction = db.transaction("my-store-name", IDBTransaction.READ_WRITE_TRANSACTION);
	 *            </pre>
	 * 
	 *            {@link IDBTransaction#READ_ONLY},
	 *            {@link IDBTransaction#READ_WRITE}.
	 * 
	 *            If you don't provide the parameter, the default access mode is
	 *            READ_ONLY. To avoid slowing things down, don't open a
	 *            {@link IDBTransaction#READ_WRITE} transaction,
	 *            unless you actually need to write into the database.
	 * @return An IDBTransaction object. This method may raise a DOMException
	 *         with a DOMError of one of the following types:
	 *         <p>
	 *         InvalidStateError - The close() method has previously been called
	 *         on this IDBDatabase instance.
	 *         </p>
	 *         <p>
	 *         NotFoundError - An object store specified in in the storeNames
	 *         parameter has been deleted or removed.
	 *         </p>
	 *         <p>
	 *         TypeError - The value for the mode parameter is invalid.
	 *         </p>
	 *         <p>
	 *         InvalidAccessError - The function was called with an empty list
	 *         of store names.
	 *         </p>
	 */
	public final IDBTransaction transaction(String storeName, String mode) throws IDBDatabaseException {
		try {

			JsArrayString store = JsArrayString.createArray().cast();
			store.push(storeName);

			return this.transactionImpl(store, mode);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	private final native IDBTransaction transactionImpl(JsArrayString storeNames, String mode)
			throws JavaScriptException /*-{
		return this.transaction(storeNames, mode);
	}-*/;

	/**
	 * The onabort event handler of the IDBDatabase interface handles the abort
	 * event, fired when attempted access to the database is aborted.
	 * 
	 * @param handler
	 *            Fires when access of the database is aborted.
	 */
	public final native void addAbortHandler(IDBAbortHandler handler) /*-{
		this.onabort = function() {
			handler.@org.rest.client.storage.indexeddb.IDBAbortHandler::onAbort()();
		}
	}-*/;

	/**
	 * The onerror event handler of the IDBDatabase interface handles the error
	 * event, fired when access to the database fails.
	 * 
	 * @param handler
	 *            Fires when access to the database fails.
	 */
	public final native void addErrorHandler(IDBErrorHandler handler) /*-{
		this.onerror = function() {
			handler.@org.rest.client.storage.indexeddb.IDBErrorHandler::onError()();
		}
	}-*/;

	/**
	 * <p>The onversionchange event handler of the IDBDatabase interface handles
	 * the versionchange event, fired when a database structure change
	 * (IDBOpenDBRequest.onupgradeneeded event or IDBFactory.deleteDatabase) was
	 * requested elsewhere (most probably in another window/tab on the same
	 * computer).</p>
	 * 
	 * <p>This is different from the versionchange transaction (but it is related).</p>
	 * 
	 * @param handler
	 *            Fires when a database structure change
	 *            (IDBOpenDBRequest.onupgradeneeded event or
	 *            IDBFactory.deleteDatabase was requested elsewhere (most
	 *            probably in another window/tab on the same computer). This is
	 *            different from the version change transaction (see
	 *            IDBVersionChangeEvent), but it is related.
	 */
	public final native void addVersionChangeHandler(IDBVersionChangeHandler handler) /*-{
		this.onversionchange = function() {
			handler.@org.rest.client.storage.indexeddb.IDBVersionChangeHandler::onChangeVersion()();
		}
	}-*/;

}
