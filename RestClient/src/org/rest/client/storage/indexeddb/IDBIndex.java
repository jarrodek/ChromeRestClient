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
 * The IDBIndex interface of the IndexedDB API provides asynchronous access to
 * an index in a database. An index is a kind of object store for looking up
 * records in another object store, called the referenced object store. You use
 * this interface to retrieve data.
 * 
 * See <a href="https://developer.mozilla.org/en/IndexedDB/IDBIndex">https://
 * developer.mozilla.org/en/IndexedDB/IDBIndex</a>
 * 
 * @author jarrod
 * @param K
 *            key class used in datastore
 */
public class IDBIndex<K> extends JavaScriptObject {
	protected IDBIndex() {
	}

	/**
	 * Returns an IDBRequest object, and, in a separate thread, finds either:
	 * 
	 * The value in the referenced object store that corresponds to the given
	 * key. The first corresponding value, if key is a key range.
	 * 
	 * If a value is successfully found, then a structured clone of it is
	 * created and set as the result of the request object.
	 * 
	 * <b>Note</b>: This method produces the same result for: a) a record that
	 * doesn't exist in the database and b) a record that has an undefined
	 * value. To tell these situations apart, call the openCursor() method with
	 * the same key. That method provides a cursor if the record exists, and not
	 * if it does not.
	 * 
	 * @param key
	 * @return
	 * @throws IDBDatabaseException
	 */
	public final IDBRequest<?> get(K key) throws IDBDatabaseException {
		try {
			return getImpl(key);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}
	
	public final IDBRequest<?> get(String query) throws IDBDatabaseException {
		try {
			return getImpl(query);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	private final native IDBRequest<?> getImpl(Object key)
			throws JavaScriptException /*-{
		return this.get(key);
	}-*/;

	/**
	 * Returns an IDBRequest object, and, in a separate thread, finds either:
	 * 
	 * - The value in the index that corresponds to the given key - The first
	 * corresponding value, if key is a key range.
	 * 
	 * If a value is successfully found, then a structured clone of it is
	 * created and set as the result of the request object.
	 * 
	 * <b>Note</b>: This method produces the same result for: a) a record that
	 * doesn't exist in the database and b) a record that has an undefined
	 * value. To tell these situations apart, call the openCursor() method with
	 * the same key. That method provides a cursor if the record exists, and not
	 * if it does not.
	 * 
	 * @param key
	 *            The key or key range that identifies the record to be
	 *            retrieved.
	 * @return A request object on which subsequent events related to this
	 *         operation are fired.
	 * @throws IDBDatabaseException
	 */
	public final IDBRequest<?> getKey(K key) throws IDBDatabaseException {
		try {
			return getKeyImpl(key);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	private final native IDBRequest<?> getKeyImpl(K key)
			throws JavaScriptException /*-{
		return this.getKey(key);
	}-*/;

	/**
	 * Returns an {@link IDBRequest} object, and in a separate thread, returns
	 * the number of records within a key range. For example, if you want to see
	 * how many records are between keys 1000 and 2000 in an object store, you
	 * can write the following: var req = store.count(IDBKeyRange.bound(1000,
	 * 2000));
	 * 
	 * @param key
	 *            The key or key range that identifies the record to be counted.
	 * @return A request object on which subsequent events related to this
	 *         operation are fired.
	 * @throws IDBDatabaseException
	 */
	public final IDBRequest<Long> count(K key) throws IDBDatabaseException {
		try {
			return countImpl(key);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	private final native IDBRequest<Long> countImpl(K key)
			throws JavaScriptException /*-{
		return this.count(key);
	}-*/;

	/**
	 * Returns an {@link IDBRequest} object, and, in a separate thread, creates
	 * a cursor over the specified key range. The method sets the position of
	 * the cursor to the appropriate record, based on the specified direction.
	 * 
	 * <ul>
	 * <li>If the key range is not specified or is null, then the range includes
	 * all the records.</li>
	 * <li>If at least one record matches the key range, then a success event is
	 * fired on the result object, with its result set to the new
	 * {@link IDBCursor} object; the value of the cursor object is set to a
	 * structured clone of the referenced value.</li>
	 * <li>If no records match the key range, then then an error event is fired
	 * on the request object, with its code set to
	 * {@link IDBDatabaseException#NOT_FOUND_ERR} and a suitable message.</li>
	 * </ul>
	 * 
	 * @param range
	 *            Optional. The key range to use as the cursor's range.
	 * @param direction
	 *            Optional. The cursor's required direction. See
	 *            {@link IDBCursor} Constants for possible values.
	 * @return A request object on which subsequent events related to this
	 *         operation are fired.
	 * @throws IDBDatabaseException
	 * @deprecated
	 */
	public final IDBRequest<?> openCursor(IDBKeyRange range, int direction)
			throws IDBDatabaseException {
		try {
			return openCursorImpl(range, direction);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}
	/**
	 * Returns an {@link IDBRequest} object, and, in a separate thread, creates
	 * a cursor over the specified key range. The method sets the position of
	 * the cursor to the appropriate record, based on the specified direction.
	 * 
	 * <ul>
	 * <li>If the key range is not specified or is null, then the range includes
	 * all the records.</li>
	 * <li>If at least one record matches the key range, then a success event is
	 * fired on the result object, with its result set to the new
	 * {@link IDBCursor} object; the value of the cursor object is set to a
	 * structured clone of the referenced value.</li>
	 * <li>If no records match the key range, then then an error event is fired
	 * on the request object, with its code set to
	 * {@link IDBDatabaseException#NOT_FOUND_ERR} and a suitable message.</li>
	 * </ul>
	 * 
	 * @param range
	 *            Optional. The key range to use as the cursor's range.
	 * @param direction
	 *            Optional. The cursor's required direction. See
	 *            {@link IDBCursor} Constants for possible values.
	 * @return A request object on which subsequent events related to this
	 *         operation are fired.
	 * @throws IDBDatabaseException
	 */
	public final IDBRequest<?> openCursor(IDBKeyRange range, String direction)
			throws IDBDatabaseException {
		try {
			return openCursorImpl(range, direction);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}
	/**
	 * @deprecated use {@link IDBIndex#openCursorImpl(IDBKeyRange, String)} instead.
	 */
	private final native IDBRequest<?> openCursorImpl(IDBKeyRange range,
			int direction) throws JavaScriptException /*-{
		var cursor = this.openCursor(range, direction);
		return cursor;
	}-*/;
	/**
	 * Native implementation of open cursor from index
	 * @param range
	 * @param direction
	 * @return
	 * @throws JavaScriptException
	 */
	private final native IDBRequest<?> openCursorImpl(IDBKeyRange range,
			String direction) throws JavaScriptException /*-{
		var cursor = this.openCursor(range, direction);
		return cursor;
	}-*/;
	/**
	 * Returns an {@link IDBRequest} object, and, in a separate thread, creates
	 * a cursor over the specified key range, as arranged by this index. The
	 * method sets the position of the cursor to the appropriate record, based
	 * on the specified direction.
	 * 
	 * <ul>
	 * <li>If the key range is not specified or is null, then the range includes
	 * all the records.</li>
	 * <li>If at least one record matches the key range, then a success event is
	 * fired on the result object, with its result set to the new
	 * {@link IDBCursor} object; the value of the cursor object is set to the
	 * value of the found record.</li>
	 * <li>If no records match the key range, then then an error event is fired
	 * on the request object, with its code set to
	 * {@link IDBDatabaseException#NOT_FOUND_ERR} and a suitable message.</li>
	 * 
	 * </ul>
	 * 
	 * @param range
	 *            Optional. The key range to use as the cursor's range.
	 * @param direction
	 *            Optional. The cursor's required direction. See IDBCursor
	 *            Constants for possible values.
	 * @return A request object on which subsequent events related to this
	 *         operation are fired.
	 * @throws IDBDatabaseException
	 */
	public final IDBRequest<?> openKeyCursor(IDBKeyRange range, int direction)
			throws IDBDatabaseException {
		try {
			return openKeyCursorImpl(range, direction);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	private final native IDBRequest<?> openKeyCursorImpl(IDBKeyRange range,
			int direction) throws JavaScriptException /*-{
		this.openKeyCursor(range, direction);
	}-*/;

	/**
	 * @return The name of this index.
	 */
	public final native String getName() /*-{
		return this.name;
	}-*/;

	/**
	 * @return The name of the object store referenced by this index.
	 */
	public final native IDBObjectStore<?> getObjectStore() /*-{
		return this.objectStore;
	}-*/;

	/**
	 * @return The key path of this index. If null, this index is not
	 *         auto-populated
	 */
	public final native String getKeyPath() /*-{
		return this.keyPath;
	}-*/;

	/**
	 * @return If true, this index does not allow duplicate values for a key.
	 */
	public final native boolean isUnique() /*-{
		return this.unique;
	}-*/;
}
