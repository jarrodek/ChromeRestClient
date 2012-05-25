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
 * The IDBTransaction interface of the IndexedDB API provides a static,
 * asynchronous transaction on a database using event handler attributes. All
 * reading and writing of data are done within transactions. You actually use
 * IDBDatabase to start transactions and use IDBTransaction to set the mode of
 * the transaction and access an object store and make your request. You can
 * also use it to abort transactions. See <a
 * href="https://developer.mozilla.org/en/IndexedDB/IDBTransaction"
 * >https://developer.mozilla.org/en/IndexedDB/IDBTransaction</a>
 * 
 * @author jarrod
 * 
 */
public class IDBTransaction extends JavaScriptObject {
	protected IDBTransaction(){}
	
	static {
		setVariables();
	}
	
	private static final native void setVariables() /*-{
		$wnd.IDBTransaction = $wnd.IDBTransaction || $wnd.webkitIDBTransaction || $wnd.mozIDBTransaction;
	}-*/;
	/**
	 * Allows data to be read but not changed.
	 * 
	 * @value 0
	 */
	public static final int READ_ONLY = 0;
	/**
	 * Allows reading and writing of data in existing data stores to be changed.
	 * 
	 * @value 1
	 */
	public static final int READ_WRITE = 1;
	/**
	 * Allows any operation to be performed, including ones that delete and
	 * create object stores and indexes. This mode is for updating the version
	 * number of transactions that were started using the setVersion() method of
	 * IDBDatabase objects. Transactions of this mode cannot run concurrently
	 * with other transactions.
	 * 
	 * @value 2
	 */
	public static final int VERSION_CHANGE = 2;

	/**
	 * 
	 * @return The database connection that this transaction is associated with.
	 */
	public final native IDBDatabase getDB() /*-{
		return this.db;
	}-*/;

	/**
	 * @return The mode for isolating access to data in the object stores that
	 *         are in the scope of the transaction. For possible values, see
	 *         Constants. The default value is {@link #READ_ONLY}.
	 */
	public final native IDBDatabase getMode() /*-{
		return this.mode;
	}-*/;

	/**
	 * The event handler for the onabort event.
	 * 
	 * @param handler
	 */
	public final native void addAbortHandler(IDBAbortHandler handler) /*-{
		this.onabort = function() {
			handler
					.@org.rest.client.storage.indexeddb.IDBAbortHandler::onAbort()();
		}
	}-*/;

	/**
	 * The event handler for the error event.
	 * 
	 * @param handler
	 */
	public final native void addErrorHandler(IDBErrorHandler handler) /*-{
		this.onerror = function() {
			handler
					.@org.rest.client.storage.indexeddb.IDBErrorHandler::onError()();
		}
	}-*/;

	/**
	 * The event handler for the oncomplete event.
	 * 
	 * @param handler
	 */
	public final native void addCompleteHandler(IDBCompleteHandler handler) /*-{
		this.oncomplete = function() {
			handler
					.@org.rest.client.storage.indexeddb.IDBCompleteHandler::onComplete()();
		}
	}-*/;

	/**
	 * Returns immediately, and undoes all the changes to objects in the
	 * database associated with this transaction. If this transaction has been
	 * aborted or completed, then this method throws an error event, with its
	 * code set to {@link IDBDatabaseException#ABORT_ERR} and a suitable
	 * message.
	 * 
	 * @throws IDBDatabaseException
	 */
	public final void abort() throws IDBDatabaseException {
		try {
			abortImpl();
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	private final native void abortImpl() /*-{
		this.abort();
	}-*/;

	/**
	 * Returns an object store that has already been added to the scope of this
	 * transaction. Every call to this method on the same transaction object,
	 * with the same name, returns the same {@link IDBObjectStore} instance. If
	 * this method is called on a different transaction object, a different
	 * {@link IDBObjectStore} instance is returned.
	 * 
	 * @param name
	 *            The name of the requested object store.
	 * @return An object for accessing the requested object store.
	 * @throws IDBDatabaseException
	 *             The method can raise an IDBDatabaseException with the
	 *             following code: {@link IDBDatabaseException#NOT_FOUND_ERR} -
	 *             The requested object store is not in this transaction's
	 *             scope. {@link IDBDatabaseException#NOT_ALLOWED_ERR} - request
	 *             is made on a source object that has been deleted or removed.
	 */
	public final IDBObjectStore<?> objectStore(String name) throws IDBDatabaseException {
		try {
			return objectStoreImpl(name);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	private final native IDBObjectStore<?> objectStoreImpl(String name) /*-{
		return this.objectStore(name);
	}-*/;
}
