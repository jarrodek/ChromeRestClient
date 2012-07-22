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
 * The IDBRequest interface of the IndexedDB API provides access to results of
 * asynchronous requests to databases and database objects using event handler
 * attributes. Each reading and writing operation on a database is done using a
 * request.
 * 
 * The request object does not initially contain any information about the
 * result of the operation, but once information becomes available, an event is
 * fired on the request, and the information becomes available through the
 * properties of the IDBRequest instance.
 * 
 * See <a href="https://developer.mozilla.org/en/IndexedDB/IDBRequest">https://
 * developer.mozilla.org/en/IndexedDB/IDBRequest</a>
 * 
 * <br/>
 * 
 * <b>Example</b>
 * 
 * <pre>
 * <code>
 * var request = window.indexedDB.open('Database Name');
 * request.onsuccess = function(event) {
 *         var db = this.result;
 *         var transaction = db.transaction([], IDBTransaction.READ_ONLY);
 *         var curRequest = transaction.objectStore('ObjectStore Name').openCursor();
 *         curRequest.onsuccess = ...;
 *     };
 * request.onerror = function(event) {
 *          ...;
 *     }; 
 * 
 * <code>
 * </pre>
 * 
 * @author jarrod
 * @param T expected result type
 */
public class IDBRequest<T> extends JavaScriptObject {
	public static final int LOADING = 1;
	public static final int DONE = 2;

	protected IDBRequest() {
	}

	/**
	 * The following error codes are returned under certain conditions:
	 * <ul>
	 * <li>ABORT_ERR — If you abort the transaction, then all requests still in
	 * progress receive this error.</li>
	 * <li>CONSTRAINT_ERR — If you insert data that doesn't conform to a
	 * constraint. It's an exception type for creating stores and indexes. You
	 * get this error, for example, if you try to add a new key that already
	 * exists in the record.</li>
	 * <li>QUOTA_ERR — If you run out of disk quota and the user declined to
	 * grant you more space.</li>
	 * <li>UNKNOWN_ERR — If the operation failed for reasons unrelated to the
	 * database itself. A failure due to disk IO errors is such an example.</li>
	 * <li>NO_ERR — If the request succeeds.</li>
	 * <li>VERSION_ERR — If you try to open a database with a version lower than
	 * the one it already has.</li>
	 * 
	 * In addition to the error codes sent to the IDBRequest object,
	 * asynchronous operations can also raise exceptions. The list describes
	 * problems that could occur when the request is being executed, but you
	 * might also encounter other problems when the request is being made. For
	 * more information on all error codes that could occur, see
	 * {@link IDBDatabaseException}.
	 * <p>
	 * See <a
	 * href="https://developer.mozilla.org/en/IndexedDB/IDBRequest">https:
	 * //developer.mozilla.org/en/IndexedDB/IDBRequest</a> for more details
	 * </p>
	 */
	public final native int getErrorCode() /*-{
		return this.errorCode;
	}-*/;

	/**
	 * Every request starts in the LOADING state. The state changes to DONE when
	 * the request completes successfully or when an error occurs.
	 * <p>
	 * See <a
	 * href="https://developer.mozilla.org/en/IndexedDB/IDBRequest">https:
	 * //developer.mozilla.org/en/IndexedDB/IDBRequest</a> for more details
	 * </p>
	 * 
	 * @return The state of the request.
	 */
	public final native int getReadyState() /*-{
		return this.readyState;
	}-*/;

	/**
	 * Returns the result of the request. If the the request failed and the
	 * result is not available, the NOT_ALLOWED_ERR exception is thrown.
	 * <p>
	 * See <a
	 * href="https://developer.mozilla.org/en/IndexedDB/IDBRequest">https:
	 * //developer.mozilla.org/en/IndexedDB/IDBRequest</a> for more details
	 * </p>
	 * 
	 * <p>
	 * 	If numeric data is returned (eg {@link T} class is Long) this method returns Long value. 
	 * </p>
	 * 
	 * @return the result of the request.
	 */
	public final native T getResult() /*-{
		if(typeof this.result == 'number'){
			return @java.lang.Long::new(Ljava/lang/String;)(this.result.toString());
		} else if(typeof this.result == "boolean"){
			return @java.lang.Boolean::new(Ljava/lang/String;)(this.result.toString());
		}
//		$wnd.console.log('IDBRequest::getResult',typeof this.result, this.result, this);
		return this.result;
	}-*/;

	/**
	 * 
	 * @return The source of the request, such as an Index or a ObjectStore. If
	 *         no source exists (such as when calling indexedDB.open()), it
	 *         returns null.
	 */
	public final native IDBFactory getSource() /*-{
		return this.source;
	}-*/;

	/**
	 * 
	 * @return The transaction for the request. This property can be null for
	 *         certain requests, such as for request returned from
	 *         IDBFactory.open (You're just connecting to a database, so there
	 *         is no transaction to return).
	 */
	public final native IDBTransaction getTransaction() /*-{
		return this.transaction;
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
	public final native void addSuccessHandler(IDBSuccessHandler handler) /*-{
		this.onsuccess = function() {
			handler.@org.rest.client.storage.indexeddb.IDBSuccessHandler::onSuccess()();
		}
	}-*/;
	/**
	 * Determine if should use setVersion function or open() with version value
	 * @return if true you need use setVersion function
	 */
	public final native boolean useSetVersionToUpgrade()/*-{
		return !('onupgradeneeded' in this);
	}-*/;
}
