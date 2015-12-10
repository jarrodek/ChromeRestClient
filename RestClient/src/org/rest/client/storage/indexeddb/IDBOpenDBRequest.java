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

/**
 * The IDBOpenDBRequest interface of the IndexedDB API provides access to the
 * results of requests to open or delete databases (performed using
 * IDBFactory.open and IDBFactory.deleteDatabase), using specific event handler
 * attributes.
 * 
 * @author Pawel Psztyc
 *
 */
public class IDBOpenDBRequest extends IDBRequest<IDBDatabase> {
	protected IDBOpenDBRequest() {
	}

	/**
	 * The IDBOpenDBRequest.onblocked event handler is the event handler for the
	 * blocked event. This event is triggered when the upgradeneeded should be
	 * triggered because of a version change but the database is still in use
	 * (that is, not closed) somewhere, even after the versionchange event was
	 * sent.
	 * 
	 * @param handler
	 */
	public final native void addBlockedHandler(IDBBlockedHandler handler) /*-{
		this.onblocked = function() {
			handler.@org.rest.client.storage.indexeddb.IDBBlockedHandler::onBlocked()();
		};
	}-*/;

	/**
	 * <p>
	 * The onupgradeneeded property of the IDBOpenDBRequest interface is the
	 * event handler for the upgradeneeded event, triggered when a database of a
	 * bigger version number than the existing stored database is loaded.
	 * </p>
	 * 
	 * <p>
	 * The event passed to the listener is an IDBVersionChangeEvent.
	 * </p>
	 * 
	 * <p>
	 * Inside the event handler function you can include code to upgrade the
	 * database structure, as shown in the example below.
	 * </p>
	 * 
	 * @param handler
	 */
	public final native void addUpdateNeededHandler(IDBUpdateNeededHandler handler) /*-{
		this.onupgradeneeded = function() {
			handler.@org.rest.client.storage.indexeddb.IDBUpdateNeededHandler::onUpdateNeeded()();
		};
	}-*/;

}
