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
 * <p>
 * The {@link IDBCursor} interface of the IndexedDB API represents a cursor for
 * traversing or iterating over multiple records in a database.
 * </p>
 * 
 * <p>
 * The cursor has a source that indicates which index or object store it is
 * iterating over. It has a position within the range, and moves in a direction
 * that is increasing or decreasing in the order of record keys. The cursor
 * enables an application to asynchronously process all the records in the
 * cursor's range.
 * </p>
 * <p>
 * You can have an unlimited number of cursors at the same time. You always get
 * the same {@link IDBCursor} object representing a given cursor. Operations are
 * performed on the underlying index or object store.
 * </p>
 * 
 * About cursors read
 * <a href="https://developer.mozilla.org/en/IndexedDB/IDBCursor" >https://
 * developer.mozilla.org/en/IndexedDB/IDBCursor</a>
 * 
 * <p>
 * IDBCursor Constants:
 * </p>
 * <ul>
 * <li>{@link #NEXT}</li>
 * <li>{@link #NEXT_UNIQUE}</li>
 * <li>{@link #PREV}</li>
 * <li>{@link #PREV_UNIQUE}</li>
 * </ul>
 * 
 * @author jarrod
 * 
 */
public class IDBCursor<K> extends JavaScriptObject {
	protected IDBCursor() {
	}

	/**
	 * The cursor shows all records, including duplicates. It starts at the
	 * lower bound of the key range and moves upwards (monotonically increasing
	 * in the order of keys).
	 */
	public static final String NEXT = "next";
	/**
	 * The cursor shows all records, excluding duplicates. If multiple records
	 * exist with the same key, only the first one iterated is retrieved. It
	 * starts at the lower bound of the key range and moves upwards.
	 */
	public static final String NEXT_UNIQUE = "nextunique";
	/**
	 * The cursor shows all records, including duplicates. It starts at the
	 * upper bound of the key range and moves downwards (monotonically
	 * decreasing in the order of keys).
	 */
	public static final String PREV = "prev";
	/**
	 * The cursor shows all records, excluding duplicates. If multiple records
	 * exist with the same key, only the first one iterated is retrieved. It
	 * starts at the upper bound of the key range and moves downwards.
	 */
	public static final String PREV_UNIQUE = "prevunique";

	/**
	 * The advance() method of the {@link IDBCursor} interface sets the number
	 * times a cursor should move its position forward.
	 * 
	 * @param count
	 *            The number of times to move the cursor forward.
	 * @throws JavaScriptException
	 *             This method may raise a DOMException with a DOMError of one
	 *             of the following types:
	 *             <p>
	 *             TransactionInactiveError - This IDBCursor's transaction is
	 *             inactive.
	 *             </p>
	 *             <p>
	 *             TypeError - The value passed into the count parameter was
	 *             zero or a negative number.
	 *             </p>
	 *             <p>
	 *             InvalidStateError - The cursor is currently being iterated or
	 *             has iterated past its end.
	 *             </p>
	 */
	public final void advance(long count) throws IDBDatabaseException {
		try {
			advanceImpl(count);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	private final native void advanceImpl(double count) throws JavaScriptException /*-{
		this.advance(count);
	}-*/;

	/**
	 * The continue() method of the {@link IDBCursor} interface advances the
	 * cursor to the next position along its direction, to the item whose key
	 * matches the optional key parameter. If no key is specified, the cursor
	 * advances to the immediate next position, based on the its direction.
	 * 
	 * @throws IDBDatabaseException
	 *             This method may raise a DOMException with a DOMError of one
	 *             of the following types:
	 * 
	 *             TransactionInactiveError - This IDBCursor's transaction is
	 *             inactive.<br/>
	 *             DataError - The key parameter may have any of the following
	 *             conditions: The key is not a valid key; The key is less than
	 *             or equal to this cursor's position and the cursor's direction
	 *             is next or nextunique.; The key is greater than or equal to
	 *             this cursor's position and this cursor's direction is prev or
	 *             prevunique.<br/>
	 *             InvalidStateError - The cursor is currently being iterated or
	 *             has iterated past its end.
	 */
	public final void cont() throws IDBDatabaseException {
		try {
			continueImpl(null);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	/**
	 * The continue() method of the {@link IDBCursor} interface advances the
	 * cursor to the next position along its direction, to the item whose key
	 * matches the optional key parameter. If no key is specified, the cursor
	 * advances to the immediate next position, based on the its direction.
	 * 
	 * @param key
	 *            The key to position the cursor at.
	 * @throws IDBDatabaseException
	 *             This method may raise a DOMException with a DOMError of one
	 *             of the following types:
	 * 
	 *             TransactionInactiveError - This IDBCursor's transaction is
	 *             inactive.<br/>
	 *             DataError - The key parameter may have any of the following
	 *             conditions: The key is not a valid key; The key is less than
	 *             or equal to this cursor's position and the cursor's direction
	 *             is next or nextunique.; The key is greater than or equal to
	 *             this cursor's position and this cursor's direction is prev or
	 *             prevunique.<br/>
	 *             InvalidStateError - The cursor is currently being iterated or
	 *             has iterated past its end.
	 */
	public final void cont(K key) throws IDBDatabaseException {
		try {
			continueImpl(key);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	private final native void continueImpl(K key) throws JavaScriptException /*-{
		if (!key) {
			this["continue"]();
		} else {
			this["continue"](key);
		}
	}-*/;

	/**
	 * The delete() method of the {@link IDBCursor} interface returns an
	 * {@link IDBRequest} object, and, in a separate thread, deletes the record
	 * at the cursor's position, without changing the cursor's position. Once
	 * the record is deleted, the cursor's value is set to null.
	 * 
	 * @return An {@link IDBRequest} object on which subsequent events related
	 *         to this operation are fired. The result attribute is set to
	 *         undefined.
	 * @throws IDBDatabaseException
	 */
	public final IDBRequest<Void> delete() throws IDBDatabaseException {
		try {
			return deleteImpl();
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	private final native IDBRequest<Void> deleteImpl() throws JavaScriptException /*-{
		return this["delete"]();
	}-*/;

	/**
	 * The update() method of the {@link IDBCursor} interface returns an
	 * {@link IDBRequest} object, and, in a separate thread, updates the value
	 * at the current position of the cursor in the object store. If the cursor
	 * points to a record that has just been deleted, a new record is created.
	 * 
	 * @param value
	 *            The new value to be stored at the current position.
	 * @return An {@link IDBRequest} object on which subsequent events related
	 *         to this operation are fired.
	 * @throws IDBDatabaseException
	 */
	public final IDBRequest<?> update(JavaScriptObject value) throws IDBDatabaseException {
		try {
			return updateImpl(value);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	private final native IDBRequest<?> updateImpl(JavaScriptObject value) throws JavaScriptException /*-{
		return this.update(value);
	}-*/;

	/**
	 * The source property of the {@link IDBCursor} interface returns the
	 * {@link IDBObjectStore} or {@link IDBIndex} that the cursor is iterating
	 * over. This function never returns null or throws an exception, even if
	 * the cursor is currently being iterated, has iterated past its end, or its
	 * transaction is not active.
	 * 
	 * @return The {@link IDBObjectStore} or {@link IDBIndex} that the cursor is
	 *         iterating over.
	 * 
	 */
	public final native JavaScriptObject getSource() /*-{
		return this.source;
	}-*/;

	/**
	 * The direction property of the {@link IDBCursor} interface is a DOMString
	 * that returns the direction of traversal of the cursor (set using
	 * {@link IDBObjectStore#openCursor(IDBKeyRange, String)} for example). See
	 * the return section below for possible values.
	 * 
	 * @return A string indicating the direction in which the cursor is
	 *         traversing the data. Possible values are: {@link #NEXT},
	 *         {@link #NEXT_UNIQUE}, {@link #PREV} or {@link #PREV_UNIQUE}.
	 */
	public final native int getDirection() /*-{
		return this.direction;
	}-*/;

	/**
	 * 
	 * @return Returns the key for the record at the cursor's position. If the
	 *         cursor is outside its range, this is set to NULL. The cursor's
	 *         key can be any data type.
	 */
	public final native K getKey() /*-{
		if(typeof this.key == 'number'){
			return @java.lang.Long::new(Ljava/lang/String;)(this.key.toString());
		} else if(typeof this.key == "boolean"){
			return @java.lang.Boolean::new(Ljava/lang/String;)(this.key.toString());
		}
		return this.key || null;
	}-*/;

	/**
	 * 
	 * @return Returns the cursor's current effective primary key. If the cursor
	 *         is currently being iterated or has iterated outside its range,
	 *         this is set to NULL. The cursor's primary key can be any data
	 *         type.
	 */
	public final native K getPrimaryKey() /*-{
		if(typeof this.primaryKey == 'number'){
			return @java.lang.Long::new(Ljava/lang/String;)(this.primaryKey.toString());
		} else if(typeof this.primaryKey == "boolean"){
			return @java.lang.Boolean::new(Ljava/lang/String;)(this.primaryKey.toString());
		}
		return this.primaryKey || null;
	}-*/;
}
