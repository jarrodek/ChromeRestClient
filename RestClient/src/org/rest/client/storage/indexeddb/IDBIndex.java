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
 * The IDBIndex interface of the IndexedDB API provides asynchronous access to
 * an index in a database. An index is a kind of object store for looking up
 * records in another object store, called the referenced object store. You use
 * this interface to retrieve data.
 * </p>
 * 
 * <p>
 * You can retrieve records in an object store through the primary key or by
 * using an index. An index lets you look up records in an object store using
 * properties of the values in the object stores records other than the primary
 * key
 * </p>
 * 
 * <p>
 * The index is a persistent key-value storage where the value part of its
 * records is the key part of a record in the referenced object store. The
 * records in an index are automatically populated whenever records in the
 * referenced object store are inserted, updated, or deleted. Each record in an
 * index can point to only one record in its referenced object store, but
 * several indexes can reference the same object store. When the object store
 * changes, all indexes that refers to the object store are automatically
 * updated.
 * </p>
 * 
 * <p>
 * You can grab a set of keys within a range. To learn more, see
 * {@link IDBKeyRange}.
 * </p>
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
	 * <p>
	 * The get() method of the {@link IDBIndex} interface returns an
	 * {@link IDBRequest} object, and, in a separate thread, finds either the
	 * value in the referenced object store that corresponds to the given key or
	 * the first corresponding value, if key is set to an {@link IDBKeyRange}.
	 * </p>
	 * 
	 * <p>
	 * If a value is successfully found, then a structured clone of it is
	 * created and set as the result of the request object: this returns the
	 * record the key is associated with.
	 * </p>
	 * 
	 * @param key
	 *            A key or {@link IDBKeyRange} that identifies the record to be
	 *            retrieved. If this value is null or missing, the browser will
	 *            use an unbound key range.
	 * @return An {@link IDBRequest} object on which subsequent events related
	 *         to this operation are fired.
	 * @throws IDBDatabaseException
	 *             TransactionInactiveError, DataError or
	 *             {@link org.rest.client.dom.error.InvalidStateError}
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

	private final native IDBRequest<?> getImpl(Object key) throws JavaScriptException /*-{
		return this.get(key);
	}-*/;

	/**
	 * <p>
	 * The getKey() method of the {@link IDBIndex} interface returns an
	 * {@link IDBRequest} object, and, in a separate thread, finds either the
	 * given key or the primary key, if key is set to an {@link IDBKeyRange}.
	 * </p>
	 * 
	 * <p>
	 * If a key is successfully found it is set as the result of the request
	 * object: this returns the primary key of the record the key is associated
	 * with, not the whole record as {@link IDBIndex#get(Object)} does.
	 * </p>
	 * 
	 * @param key
	 *            A key or {@link IDBKeyRange} that identifies a record to be
	 *            retrieved. If this value is null or missing, the browser will
	 *            use an unbound key range.
	 * @return An {@link IDBRequest} object on which subsequent events related
	 *         to this operation are fired.
	 * @throws IDBDatabaseException
	 *             TransactionInactiveError, DataError, InvalidStateError
	 */
	public final IDBRequest<?> getKey(K key) throws IDBDatabaseException {
		try {
			return getKeyImpl(key);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	private final native IDBRequest<?> getKeyImpl(K key) throws JavaScriptException /*-{
		return this.getKey(key);
	}-*/;

	/**
	 * The count() method of the {@link IDBIndex} interface returns an
	 * {@link IDBRequest} object, and in a separate thread, returns the number
	 * of records within a key range.
	 * 
	 * @param key
	 *            The key or key range that identifies the record to be counted.
	 * @return A {@link IDBRequest} object on which subsequent events related to
	 *         this operation are fired.
	 * @throws IDBDatabaseException
	 *             TransactionInactiveError, DataError, InvalidStateError
	 */
	public final IDBRequest<Long> count(K key) throws IDBDatabaseException {
		try {
			return countImpl(key);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	private final native IDBRequest<Long> countImpl(K key) throws JavaScriptException /*-{
		return this.count(key);
	}-*/;

	/**
	 * The openCursor() method of the {@link IDBIndex} interface returns an
	 * {@link IDBRequest} object, and, in a separate thread, creates a cursor
	 * over the specified key range.
	 * 
	 * The method sets the position of the cursor to the appropriate record,
	 * based on the specified direction.
	 * 
	 * <ul>
	 * <li>If the key range is not specified or is null, then the range includes
	 * all the records.</li>
	 * <li>A success event is always fired on the result object.</li>
	 * <ul>
	 * <li>If at least one record matches the key range then the result property
	 * of the event is set to the new {@link IDBCursor} object; the value of the
	 * cursor object is set to a structured clone of the referenced value.</li>
	 * <li>If no records match the key range then then the result property of
	 * the event is set to null.</li>
	 * </ul>
	 * </ul>
	 * 
	 * @param range
	 *            The key range to use as the cursor's range.
	 * @param direction
	 *            The cursor's required direction. See {@link IDBCursor}
	 *            Constants for possible values.
	 * @return A request object on which subsequent events related to this
	 *         operation are fired.
	 * @throws IDBDatabaseException
	 */
	public final IDBRequest<?> openCursor(IDBKeyRange range, String direction) throws IDBDatabaseException {
		try {
			return openCursorImpl(range, direction);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	/**
	 * Native implementation of open cursor from index
	 * 
	 * @param range
	 * @param direction
	 * @return
	 * @throws JavaScriptException
	 */
	private final native IDBRequest<?> openCursorImpl(IDBKeyRange range, String direction)
			throws JavaScriptException /*-{
		var cursor = this.openCursor(range, direction);
		return cursor;
	}-*/;

	/**
	 * The openKeyCursor() method of the {@link IDBIndex} interface returns an
	 * {@link IDBRequest} object, and, in a separate thread, creates a cursor
	 * over the specified key range, as arranged by this index.
	 * 
	 * The method sets the position of the cursor to the appropriate key, based
	 * on the specified direction.
	 * 
	 * <ul>
	 * <li>If the key range is not specified or is null, then the range includes
	 * all the keys.</li>
	 * <li>If at least one key matches the key range, then a success event is
	 * fired on the result object, with its result set to the new
	 * {@link IDBCursor} object; the value of the cursor object is set to the
	 * value of the found record.</li>
	 * <li>If no keys ranges match the key range specified, then then an error
	 * event is fired on the request object.</li>
	 * </ul>
	 * 
	 * @param range
	 *            A key or {@link IDBKeyRange} to use as the cursor's range. If
	 *            nothing is passed, this will default to a key range that
	 *            selects all the records in this object store.
	 * @param direction
	 *            Optional. The cursor's direction. See {@link IDBCursor}
	 *            Constants for possible values.
	 * @return An {@link IDBRequest} object on which subsequent events related
	 *         to this operation are fired.
	 * @throws IDBDatabaseException
	 *             TransactionInactiveError, TypeError, DataError,
	 *             InvalidStateError
	 */
	public final IDBRequest<?> openKeyCursor(IDBKeyRange range, int direction) throws IDBDatabaseException {
		try {
			return openKeyCursorImpl(range, direction);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	private final native IDBRequest<?> openKeyCursorImpl(IDBKeyRange range, int direction)
			throws JavaScriptException /*-{
		this.openKeyCursor(range, direction);
	}-*/;

	/**
	 * The name property of the IDBIndex interface returns the name of the
	 * current index.
	 * 
	 * @return The name of this index.
	 */
	public final native String getName() /*-{
		return this.name;
	}-*/;

	/**
	 * The objectStore property of the IDBIndex interface returns the name of
	 * the object store referenced by the current index.
	 * 
	 * @return The name of the object store referenced by this index.
	 */
	public final native IDBObjectStore<?> getObjectStore() /*-{
		return this.objectStore;
	}-*/;

	/**
	 * The keyPath property of the IDBIndex interface returns the key path of
	 * the current index. If null, this index is not auto-populated.
	 * 
	 * @return The key path of this index. If null, this index is not
	 *         auto-populated
	 */
	public final native String getKeyPath() /*-{
		return this.keyPath;
	}-*/;

	/**
	 * <p>
	 * The unique property returns a boolean that states whether the index
	 * allows duplicate keys or not.
	 * </p>
	 * 
	 * <p>
	 * This is decided when the index is created, using the
	 * IDBObjectStore.createIndex method. This method takes an optional
	 * parameter, unique, which if set to true means that the index will not be
	 * able to accept duplicate entries.
	 * </p>
	 * 
	 * @return If true, this index does not allow duplicate values for a key.
	 */
	public final native boolean isUnique() /*-{
		return this.unique;
	}-*/;

	/**
	 * The multiEntry property of the IDBIndex interface returns a boolean value
	 * that affects how the index behaves when the result of evaluating the
	 * index's key path yields an array.
	 * 
	 * This is decided when the index is created, using the
	 * IDBObjectStore.createIndex method. This method takes an optional
	 * parameter, multientry, which is set to true/false.
	 * 
	 * @return A Boolean:
	 * 	true - There is one record in the index for each item in an array of keys.
	 * 	false - There is one record for each key that is an array.
	 */
	public final native boolean getMultiEntry() /*-{
		return this.multiEntry;
	}-*/;
}
