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

import org.rest.client.dom.error.DOMError;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * <p>
 * The IDBRequest interface of the IndexedDB API provides access to results of
 * asynchronous requests to databases and database objects using event handler
 * attributes. Each reading and writing operation on a database is done using a
 * request.
 * </p>
 * <p>
 * The request object does not initially contain any information about the
 * result of the operation, but once information becomes available, an event is
 * fired on the request, and the information becomes available through the
 * properties of the IDBRequest instance.
 * </p>
 * <p>
 * All asynchronous operations immediately return an IDBRequest instance. Each
 * request has a readyState that is set to the pending state; this changes to
 * done when the request is completed or fails. When the state is set to done,
 * every request returns a result and an error, and an event is fired on the
 * request. When the state is still pending, any attempt to access the result or
 * error raises an InvalidStateError exception.
 * </p>
 * <p>
 * See <a href="https://developer.mozilla.org/en/IndexedDB/IDBRequest">https://
 * developer.mozilla.org/en/IndexedDB/IDBRequest</a>
 * </p>
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
 * @author Pawel Psztyc
 * @param T
 *            expected result type
 */
public class IDBRequest<T> extends JavaScriptObject {
	public static final int PENDING = 1;
	public static final int DONE = 2;

	protected IDBRequest() {
	}

	/**
	 * The error property of the {@link IDBRequest} interface returns the error
	 * in the event of an unsuccessful request.
	 * 
	 * @return A DOMError containing the relevant error. See
	 *         {@link org.rest.client.dom.error} package for available errors.
	 * 
	 *         The following error codes are returned under certain conditions:
	 *         <p>
	 *         AbortError - If you abort the transaction, then all requests
	 *         still in progress receive this error.
	 *         </p>
	 *         <p>
	 *         ConstraintError - If you insert data that doesn't conform to a
	 *         constraint. It's an exception type for creating stores and
	 *         indexes. You get this error, for example, if you try to add a new
	 *         key that already exists in the record.
	 *         </p>
	 *         <p>
	 *         QuotaExceededError - If you run out of disk quota and the user
	 *         declined to grant you more space.
	 *         </p>
	 *         <p>
	 *         UnknownError - If the operation failed for reasons unrelated to
	 *         the database itself. A failure due to disk IO errors is such an
	 *         example.
	 *         </p>
	 *         <p>
	 *         NoError - If the request succeeds.
	 *         </p>
	 *         <p>
	 *         VersionError - If you try to open a database with a version lower
	 *         than the one it already has.
	 *         </p>
	 * 
	 *         In addition to the error codes sent to the IDBRequest object,
	 *         asynchronous operations can also raise exceptions. The list
	 *         describes problems that could occur when the request is being
	 *         executed, but you might also encounter other problems when the
	 *         request is being made. For example, if the the request failed and
	 *         the result is not available, the InvalidStateError exception is
	 *         thrown.
	 */
	public final native DOMError getError() /*-{
		return this.error;
	}-*/;

	/**
	 * <p>
	 * The readyState property of the IDBRequest interface returns the state of
	 * the request.
	 * </p>
	 * 
	 * <p>
	 * Every request starts in the pending state. The state changes to done when
	 * the request completes successfully or when an error occurs.
	 * </p>
	 * 
	 * <p>
	 * See
	 * <a href="https://developer.mozilla.org/en/IndexedDB/IDBRequest">https:
	 * //developer.mozilla.org/en/IndexedDB/IDBRequest</a> for more details
	 * </p>
	 * 
	 * @return The IDBRequestReadyState of the request, which takes one of the
	 *         following two values: {@link #PENDING} - The request is pending.
	 *         <br/>
	 *         {@link #DONE} - The request is done.
	 */
	public final native int getReadyState() /*-{
		return this.readyState;
	}-*/;

	/**
	 * The result property of the {@link IDBRequest} interface returns the
	 * result of the request. If the the request failed and the result is not
	 * available, an {@link InvalidStateError} exception is thrown.
	 * <p>
	 * See
	 * <a href="https://developer.mozilla.org/en/IndexedDB/IDBRequest">https:
	 * //developer.mozilla.org/en/IndexedDB/IDBRequest</a> for more details
	 * </p>
	 * 
	 * <p>
	 * If numeric data is returned (eg {@link T} class is Long) this method
	 * returns Long value.
	 * </p>
	 * 
	 * @return An IDBObjectStore containing the result of the request.
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
	 * The source property of the {@link IDBRequest} interface returns the
	 * source of the request, such as an Index or an object store. If no source
	 * exists (such as when calling {@link IDBFactory#open(String)}), it returns
	 * null.
	 * 
	 * @return An object representing the source of the request, such as an
	 *         IDBIndex, IDBObjectStore or IDBCursor.
	 */
	public final native IDBFactory getSource() /*-{
		return this.source;
	}-*/;

	/**
	 * The transaction property of the {@link IDBRequest} interface returns the
	 * transaction for the request, that is, the transaction the request is
	 * being made inside.
	 * 
	 * @return An {@link IDBTransaction}.
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
}
