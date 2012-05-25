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
 * Warning: The latest specification does not include this interface anymore as
 * the IDBDatabase.setVersion() method has been removed. However, it is still
 * implemented in not up-to-date browsers. See the compatibility table for
 * version details. The new way to do it is to use the IDBOpenDBRequest
 * interface which has now the onblocked handler and the newly needed
 * onupgradeneeded one.
 * 
 * The IDBVersionChangeRequest interface the IndexedDB API represents a request
 * to change the version of a database. It is used only by the {@link IDBDatabase#setVersion} method.
 * 
 * @author jarrod
 * 
 */
public class IDBVersionChangeRequest extends JavaScriptObject {
	protected IDBVersionChangeRequest() {
	}

	public final native int getErrorCode() /*-{
		return this.errorCode;
	}-*/;

	public final native int getReadyState() /*-{
		return this.readyState;
	}-*/;

	public final native IDBTransaction getResult() /*-{
		return this.result;
	}-*/;

	public final native IDBDatabase getSource() /*-{
		return this.source;
	}-*/;

	public final native IDBTransaction getTransaction() /*-{
		return this.transaction;
	}-*/;

	public final native void addErrorHandler(IDBErrorHandler handler) /*-{
		this.onerror = function() {
			handler
					.@org.rest.client.storage.indexeddb.IDBErrorHandler::onError()();
		}
	}-*/;

	public final native void addSuccessHandler(IDBSuccessHandler handler) /*-{
		this.onsuccess = function() {
			handler
					.@org.rest.client.storage.indexeddb.IDBSuccessHandler::onSuccess()();
		}
	}-*/;

	public final native void addBlockedHandler(IDBBlockedHandler handler) /*-{
		this.onblocked = function() {
			handler
					.@org.rest.client.storage.indexeddb.IDBBlockedHandler::onBlocked()();
		}
	}-*/;
}
