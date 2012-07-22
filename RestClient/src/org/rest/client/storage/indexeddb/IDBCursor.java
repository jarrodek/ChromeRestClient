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
 * The IDBCursor interface of the IndexedDB API represents a cursor for
 * traversing or iterating over multiple records in a database.
 * 
 * About cursors read <a
 * href="https://developer.mozilla.org/en/IndexedDB/IDBCursor"
 * >https://developer.mozilla.org/en/IndexedDB/IDBCursor</a>
 * 
 * <p>IDBCursor Constants:</p>
 * <ul>
 * 	<li>{@link #CURSOR_NEXT}</li>
 * 	<li>{@link #CURSOR_NEXT_NO_DUPLICATE}</li>
 * 	<li>{@link #CURSOR_PREV}</li>
 * 	<li>{@link #CURSOR_PREV_NO_DUPLICATE}</li>
 * </ul>
 * @author jarrod
 * 
 */
public class IDBCursor<K> extends JavaScriptObject {
	protected IDBCursor() {
	}

	/**
	 * Indicates that this cursor should yield all records, including duplicates
	 * and its direction is monotonically increasing order of keys.
	 * @deprecated
	 */
	public static final int NEXT;
	/**
	 * Indicates that this cursor should yield all records, including duplicates
	 * and its direction is monotonically increasing order of keys.
	 */
	public static final String CURSOR_NEXT = "next";
	/**
	 * Indicates that this cursor should yield all records, not including
	 * duplicates and its direction is monotonically increasing order of keys.
	 * For every key with duplicate values, only the first record is yielded.
	 * @deprecated
	 */
	public static final int NEXT_NO_DUPLICATE;
	/**
	 * Indicates that this cursor should yield all records, not including
	 * duplicates and its direction is monotonically increasing order of keys.
	 * For every key with duplicate values, only the first record is yielded.
	 */
	public static final String CURSOR_NEXT_NO_DUPLICATE = "nextunique";
	/**
	 * Indicates that cursor should yield all records, including duplicates and
	 * its direction is monotonically decreasing order of keys.
	 * @deprecated
	 */
	public static final int PREV;
	/**
	 * Indicates that cursor should yield all records, including duplicates and
	 * its direction is monotonically decreasing order of keys.
	 */
	public static final String CURSOR_PREV = "prev";
	/**
	 * Indicates that this cursor should yield all records, not including
	 * duplicates and its direction is monotonically decreasing order of keys.
	 * For every key with duplicate values, only the first record is yielded.
	 * @deprecated
	 */
	public static final int PREV_NO_DUPLICATE;
	/**
	 * Indicates that this cursor should yield all records, not including
	 * duplicates and its direction is monotonically decreasing order of keys.
	 * For every key with duplicate values, only the first record is yielded.
	 */
	public static final String CURSOR_PREV_NO_DUPLICATE = "prevunique";

	static {
		setVariables();
		NEXT = getNextConstant();
		NEXT_NO_DUPLICATE = getNextNoDuplicateConstant();
		PREV = getPrevConstant();
		PREV_NO_DUPLICATE = getPrevNoDuplicateConstant();
	}

	private static final native void setVariables() /*-{
		$wnd.IDBCursor = $wnd.IDBCursor || $wnd.webkitIDBCursor;
	}-*/;

	private static final native int getNextConstant() /*-{
		return $wnd.IDBCursor.NEXT;
	}-*/;

	private static final native int getNextNoDuplicateConstant() /*-{
		return $wnd.IDBCursor.NEXT_NO_DUPLICATE;
	}-*/;

	private static final native int getPrevConstant() /*-{
		return $wnd.IDBCursor.PREV;
	}-*/;

	private static final native int getPrevNoDuplicateConstant() /*-{
		return $wnd.IDBCursor.PREV_NO_DUPLICATE;
	}-*/;

	/**
	 * Returns an IDBRequest object, and, in a separate thread, updates the
	 * value at the current position of the cursor in the object store. If the
	 * cursor points to a record that has just been deleted, a new record is
	 * created.
	 * 
	 * @param value
	 *            The value to be stored
	 * @return A request object on which subsequent events related to this
	 *         operation are fired.
	 * @throws IDBDatabaseException
	 */
	public final IDBRequest<?> update(JavaScriptObject value)
			throws IDBDatabaseException {
		try {
			return updateImpl(value);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	private final native IDBRequest<?> updateImpl(JavaScriptObject value)
			throws JavaScriptException /*-{
		return this.update(value);
	}-*/;

	/**
	 * Sets the number times a cursor should move its position forward.
	 * 
	 * @param count
	 *            The number of advances forward the cursor should make.
	 * @throws JavaScriptException
	 */
	public final void advance(long count) throws IDBDatabaseException {
		try {
			advanceImpl(count);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	private final native void advanceImpl(double count)
			throws JavaScriptException /*-{
		this.advance(count);
	}-*/;

	/**
	 * Advances the cursor to the immediate next position, based on the cursor's
	 * direction.
	 * 
	 * @throws IDBDatabaseException
	 */
	public final void cont() throws IDBDatabaseException {
		try {
			continueImpl(null);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	/**
	 * Advances the cursor to the next position along its direction, to the item
	 * whose key matches the optional key parameter. If no key is specified,
	 * advance to the immediate next position, based on the cursor's direction.
	 * 
	 * @param key
	 *            The key to position the cursor at.
	 * @throws IDBDatabaseException
	 */
	public final void cont(K key) throws IDBDatabaseException {
		try {
			continueImpl(key);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	private final native void continueImpl(K key)
			throws JavaScriptException /*-{
		if(!key){
			this["continue"]();
		} else {
			this["continue"](key);
		}
	}-*/;

	/**
	 * Returns an {@link IDBRequest} object, and, in a separate thread, deletes
	 * the record at the cursor's position, without changing the cursor's
	 * position. Once the record is deleted, the cursor's value is set to null.
	 * 
	 * @return A request object on which subsequent events related to this
	 *         operation are fired. The result attribute is set to undefined.
	 * @throws IDBDatabaseException
	 */
	public final IDBRequest<Void> delete() throws IDBDatabaseException {
		try {
			return deleteImpl();
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	private final native IDBRequest<Void> deleteImpl()
			throws JavaScriptException /*-{
		return this["delete"]();
	}-*/;

	/**
	 * @return returns the {@link IDBObjectStore} or {@link IDBIndex} that the
	 *         cursor is iterating. This function never returns null or throws
	 *         an exception, even if the cursor is currently being iterated, has
	 *         iterated past its end, or its transaction is not active.
	 * 
	 */
	public final native JavaScriptObject getSource() /*-{
		return this.source;
	}-*/;

	/**
	 * 
	 * @return returns the direction of traversal of the cursor. See Constants
	 *         for possible values.
	 */
	public final native int getDirection() /*-{
		return this.direction;
	}-*/;

	/**
	 * 
	 * @return Returns the key for the record at the cursor's position. If the
	 *         cursor is outside its range, this is NULL.
	 */
	public final native K getKey() /*-{
		if(typeof this.key == 'number'){
			return @java.lang.Long::new(Ljava/lang/String;)(this.key.toString());
		} else if(typeof this.key == "boolean"){
			return @java.lang.Boolean::new(Ljava/lang/String;)(this.key.toString());
		}
		$wnd.console.log('IDBCursor::Key',typeof this.key, this.key, this);
		return this.key || null;
	}-*/;

	/**
	 * 
	 * @return Returns the cursor's current effective key. If the cursor is
	 *         currently being iterated or has iterated outside its range, this
	 *         is NULL.
	 */
	public final native K getPrimaryKey() /*-{
		if(typeof this.primaryKey == 'number'){
			return @java.lang.Long::new(Ljava/lang/String;)(this.primaryKey.toString());
		} else if(typeof this.primaryKey == "boolean"){
			return @java.lang.Boolean::new(Ljava/lang/String;)(this.primaryKey.toString());
		}
		$wnd.console.log('IDBCursor::PrimaryKey',typeof this.primaryKey, this.primaryKey, this);
		return this.primaryKey || null;
	}-*/;
}
