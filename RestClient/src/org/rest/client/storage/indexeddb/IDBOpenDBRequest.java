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


public class IDBOpenDBRequest extends IDBRequest<IDBDatabase> {
	protected IDBOpenDBRequest(){}
	
	/**
	 * The event handler for the error event.
	 * 
	 * @param handler
	 */
	public final native void addBlockedHandler(IDBBlockedHandler handler) /*-{
		this.onblocked = function() {
			handler
					.@org.rest.client.storage.indexeddb.IDBBlockedHandler::onBlocked()();
		}
	}-*/;
	/**
	 * The event handler for the error event.
	 * 
	 * @param handler
	 */
	public final native void addUpdateNeededHandler(IDBUpdateNeededHandler handler) /*-{
		this.onupgradeneeded = function() {
			handler
					.@org.rest.client.storage.indexeddb.IDBUpdateNeededHandler::onUpdateNeeded()();
		}
	}-*/;
	
	
}
