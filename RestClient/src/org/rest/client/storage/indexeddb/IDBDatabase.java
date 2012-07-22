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

public class IDBDatabase extends JavaScriptObject {
	protected IDBDatabase() {
	}

	public final native String getName() /*-{
		return this.name;
	}-*/;

	public final native String getVersion() /*-{
		return this.version;
	}-*/;

	public final native DOMStringList getObjectStoreNames() /*-{
		return this.objectStoreNames;
	}-*/;

	/**
	 * Creates and returns a new object store or index. The method takes the
	 * name of the store as well as a parameter object. The parameter object
	 * lets you define important optional properties. You can use the property
	 * to uniquely identify individual objects in the store. As the property is
	 * an identifier, it should be unique to every object, and every object
	 * should have that property.
	 * 
	 * But before you can create any object store or index, you must first call
	 * the setVersion() method.
	 * 
	 * @param name
	 *            The name of the new object store.
	 * @param parameters
	 *            Options object whose attributes are optional parameters to the
	 *            method. It includes the following properties: - keyPath: The
	 *            key path to be used by the new object store. If empty or not
	 *            specified, the object store is created without a key path and
	 *            uses out-of-line keys. - autoIncrement: If true, the object
	 *            store has a key generator. Defaults to false.
	 * @return
	 * @throws IDBDatabaseException
	 */
	public final IDBObjectStore<?> createObjectStore(String name,
			IDBObjectStoreParameters parameters) throws IDBDatabaseException {
		try {
			return createObjectStoreImpl(name, parameters);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	/**
	 * Creates and returns a new object store or index. The method takes the
	 * name of the store as well as a parameter object. The parameter object
	 * lets you define important optional properties. You can use the property
	 * to uniquely identify individual objects in the store. As the property is
	 * an identifier, it should be unique to every object, and every object
	 * should have that property.
	 * 
	 * But before you can create any object store or index, you must first call
	 * the setVersion() method.
	 * 
	 * @param name
	 *            The name of the new object store.
	 * @return IDBObjectStore
	 * @throws IDBDatabaseException
	 */
	public final IDBObjectStore<?> createObjectStore(String name)
			throws IDBDatabaseException {
		try {
			return createObjectStoreImpl(name, null);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	private final native IDBObjectStore<?> createObjectStoreImpl(String name,
			IDBObjectStoreParameters parameters) throws JavaScriptException /*-{
		return this.createObjectStore(name, parameters);
	}-*/;

	/**
	 * Destroys the object store with the given name in the connected database,
	 * along with any indexes that reference it. As with createObjectStore(),
	 * this method can be called only within a VERSION_CHANGE transaction. So
	 * you must call the setVersion() method first before you can remove any
	 * object store or index.
	 * 
	 * @param name
	 *            The name of the data store to delete.
	 * @return
	 * @throws IDBDatabaseException
	 */
	public final IDBRequest<Void> deleteObjectStore(String name)
			throws IDBDatabaseException {
		try {
			return deleteObjectStoreImpl(name);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	private final native IDBRequest<Void> deleteObjectStoreImpl(String name)
			throws JavaScriptException /*-{
		return this.deleteObjectStore(name);
	}-*/;

	/**
	 * Updates the version of the database. Returns immediately and runs a
	 * VERSION_CHANGE transaction on the connected database in a separate
	 * thread.
	 * 
	 * Call this method before creating or deleting an object store.
	 * 
	 * Warning: The latest draft of the specification dropped this method. Some
	 * not up-to-date browsers still implement this method. The new way is to
	 * define the version in the IDBDatabase.open() method and to create and
	 * delete object stores in the onupdateneeded event handler associated to
	 * the returned request.
	 * 
	 * @param newVersion
	 *            The version to store in the database.
	 * @return The request to change the version of a database.
	 * @throws IDBDatabaseException
	 */
	public final IDBVersionChangeRequest setVersion(String newVersion)
			throws IDBDatabaseException {
		try {
			return this.setVersionImpl(newVersion);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	private final native IDBVersionChangeRequest setVersionImpl(
			String newVersion) throws JavaScriptException /*-{
		var versionRequest = this.setVersion(newVersion);
		return versionRequest;
	}-*/;

	/**
	 * Immediately returns an {@link IDBTransaction} object, and starts a
	 * transaction in a separate thread. The method returns a transaction object
	 * ({@link IDBTransaction}) containing the objectStore() method, which you
	 * can use to access your object store. <br/>
	 * Example in javascript:
	 * 
	 * <pre>
	 * var transaction = db.transaction(['my-store-name', 'my-store-name2'], IDBTransaction.READ_ONLY_TRANSACTION);
	 * </pre>
	 * 
	 * You cannot pass an empty array into the storeNames parameter, such as in
	 * the following: <br/>
	 * var transaction = db.transaction([],
	 * IDBTransaction.READ_ONLY_TRANSACTION); <br/>
	 * Use something like: example in javascript:
	 * 
	 * <pre>
	 * var transaction = db.transaction(db.objectStoreNames,
	 * 		IDBTransaction.READ_ONLY_TRANSACTION);
	 * </pre>
	 * 
	 * <br/>
	 * 
	 * Warning: Accessing all obejct stores under the
	 * {@link IDBTransaction#READ_WRITE_TRANSACTION} mode means that you can run
	 * only that transaction. You cannot have writing transactions with
	 * overlapping scopes.
	 * 
	 * @param storeNames
	 *            The names of object stores and indexes that are in the scope
	 *            of the new transaction. Specify only the object stores that
	 *            you need to access. Include into transaction multiple object
	 *            stores.
	 * @param mode
	 *            The types of access that can be performed in the transaction.
	 *            Transactions are opened in one of three modes:
	 *            {@link IDBTransaction#READ_ONLY_TRANSACTION},
	 *            {@link IDBTransaction#READ_WRITE_TRANSACTION}, and
	 *            {@link IDBTransaction#VERSION_CHANGE}. If you don't provide
	 *            the parameter, the default access mode is READ_ONLY. To avoid
	 *            slowing things down, don't open a
	 *            {@link IDBTransaction#READ_WRITE_TRANSACTION} transaction,
	 *            unless you actually need to write into the database.
	 * @return
	 */
	public final IDBTransaction transaction(String[] storeNames, String mode)
			throws IDBDatabaseException {
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
	 * Immediately returns an {@link IDBTransaction} object, and starts a
	 * transaction in a separate thread. The method returns a transaction object
	 * ({@link IDBTransaction}) containing the objectStore() method, which you
	 * can use to access your object store. <br/>
	 * Example in javascript:
	 * 
	 * <pre>
	 * var transaction = db.transaction(['my-store-name'], IDBTransaction.READ_ONLY);
	 * or
	 * var transaction = db.transaction('my-store-name', IDBTransaction.READ_ONLY);
	 * </pre>
	 * 
	 * @param storeName
	 *            The names of object stores and indexes that are in the scope
	 *            of the new transaction. Specify only the object stores that
	 *            you need to access. Include into transaction single object
	 *            store
	 * @param mode
	 *            The types of access that can be performed in the transaction.
	 *            Transactions are opened in one of three modes:
	 *            {@link IDBTransaction#READ_ONLY},
	 *            {@link IDBTransaction#READ_WRITE}, and
	 *            {@link IDBTransaction#VERSION_CHANGE}. If you don't provide
	 *            the parameter, the default access mode is READ_ONLY. To avoid
	 *            slowing things down, don't open a
	 *            {@link IDBTransaction#READ_WRITE} transaction, unless you
	 *            actually need to write into the database.
	 * @return current {@link IDBTransaction}
	 * @deprecated use {@link IDBDatabase#transaction(String, String)} instead
	 */
	public final IDBTransaction transaction(String storeName, int mode)
			throws IDBDatabaseException {
		String modeStr = "";
		switch (mode) {
		case 0:
			modeStr = IDBTransaction.READ_ONLY_TRANSACTION;
			break;
		case 1:
			modeStr = IDBTransaction.READ_WRITE_TRANSACTION;
			break;
		}
		if (modeStr.isEmpty()) {
			return null;
		}
		return transaction(storeName, modeStr);
	}

	/**
	 * Immediately returns an {@link IDBTransaction} object, and starts a
	 * transaction in a separate thread. The method returns a transaction object
	 * ({@link IDBTransaction}) containing the objectStore() method, which you
	 * can use to access your object store. <br/>
	 * Example in javascript:
	 * 
	 * <pre>
	 * var transaction = db.transaction(['my-store-name'], IDBTransaction.READ_ONLY_TRANSACTION);
	 * or
	 * var transaction = db.transaction('my-store-name', IDBTransaction.READ_ONLY_TRANSACTION);
	 * </pre>
	 * 
	 * @param storeName
	 *            The names of object stores and indexes that are in the scope
	 *            of the new transaction. Specify only the object stores that
	 *            you need to access. Include into transaction single object
	 *            store
	 * @param mode
	 *            The types of access that can be performed in the transaction.
	 *            Transactions are opened in one of three modes:
	 *            {@link IDBTransaction#READ_ONLY_TRANSACTION},
	 *            {@link IDBTransaction#READ_WRITE_TRANSACTION}, and
	 *            {@link IDBTransaction#VERSION_CHANGE}. If you don't provide
	 *            the parameter, the default access mode is
	 *            {@link IDBTransaction#READ_ONLY_TRANSACTION}. To avoid slowing
	 *            things down, don't open a
	 *            {@link IDBTransaction#READ_WRITE_TRANSACTION} transaction,
	 *            unless you actually need to write into the database.
	 * @return current {@link IDBTransaction}
	 * @throws IDBDatabaseException
	 */
	public final IDBTransaction transaction(String storeName, String mode)
			throws IDBDatabaseException {
		try {

			JsArrayString store = JsArrayString.createArray().cast();
			store.push(storeName);

			return this.transactionImpl(store, mode);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	private final native IDBTransaction transactionImpl(
			JsArrayString storeNames, String mode) throws JavaScriptException /*-{
		return this.transaction(storeNames, mode);
	}-*/;

	/**
	 * Returns immediately and closes the connection in a separate thread. The
	 * connection is not actually closed until all transactions created using
	 * this connection are complete. No new transactions can be created for this
	 * connection once this method is called. Methods that create transactions
	 * throw an exception if a closing operation is pending.
	 */
	public final native void close() /*-{
		return this.close();
	}-*/;

	/**
	 * The event handler for the onabort event.
	 * 
	 * @param handler
	 */
	public final native void addAbortHandler(IDBAbortHandler handler) /*-{
		this.onabort = function() {
			handler.@org.rest.client.storage.indexeddb.IDBAbortHandler::onAbort()();
		}
	}-*/;

	/**
	 * The event handler for the error event.
	 * 
	 * @param handler
	 */
	public final native void addErrorHandler(IDBErrorHandler handler) /*-{
		this.onerror = function() {
			handler.@org.rest.client.storage.indexeddb.IDBErrorHandler::onError()();
		}
	}-*/;

	/**
	 * The event handler for the error event.
	 * 
	 * @param handler
	 */
	public final native void addVersionChangeHandler(
			IDBVersionChangeHandler handler) /*-{
		this.onversionchange = function() {
			handler.@org.rest.client.storage.indexeddb.IDBVersionChangeHandler::onChangeVersion()();
		}
	}-*/;

}
