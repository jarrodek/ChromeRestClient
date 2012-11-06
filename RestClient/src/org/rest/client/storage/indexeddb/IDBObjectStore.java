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
 * The IDBObjectStore interface of the IndexedDB API represents an object store
 * in a database. Records within an object store are sorted according to their
 * keys. This sorting enable fast insertion, look-up, and ordered retrieval.
 * 
 * See <a
 * href="https://developer.mozilla.org/en/IndexedDB/IDBObjectStore">https:
 * //developer.mozilla.org/en/IndexedDB/IDBObjectStore</a>
 * 
 * @author jarrod
 * @param K key type used in datastore
 */
public class IDBObjectStore<K> extends JavaScriptObject {
	protected IDBObjectStore() {
	}

	/**
	 * Returns an {@link IDBRequest} object, and, in a separate thread, creates
	 * a structured clone of the value, and stores the cloned value in the
	 * object store. If the record is successfully stored, then a success event
	 * is fired on the returned request object, using the IDBTransactionEvent
	 * interface, with the result set to the key for the stored record, and
	 * transaction set to the transaction in which this object store is opened.
	 * If a record already exists in the object store with the key parameter as
	 * its key, then an error event is fired on the returned request object,
	 * with code set to {@link IDBDatabaseException#CONSTRAINT_ERR} See <a
	 * href="https://developer.mozilla.org/en/IndexedDB/IDBObjectStore#add"
	 * >https://developer.mozilla.org/en/IndexedDB/IDBObjectStore#add</a>
	 * 
	 * @param value
	 *            The value to be stored.
	 * @return
	 * @throws IDBDatabaseException
	 */
	public final IDBRequest<?> add(JavaScriptObject value) throws IDBDatabaseException {
		try{
			return addImpl(value, null);
		} catch(JavaScriptException e){
			throw new IDBDatabaseException(e);
		}
	}

	/**
	 * Returns an {@link IDBRequest} object, and, in a separate thread, creates
	 * a structured clone of the value, and stores the cloned value in the
	 * object store. If the record is successfully stored, then a success event
	 * is fired on the returned request object, using the IDBTransactionEvent
	 * interface, with the result set to the key for the stored record, and
	 * transaction set to the transaction in which this object store is opened.
	 * If a record already exists in the object store with the key parameter as
	 * its key, then an error event is fired on the returned request object,
	 * with code set to {@link IDBDatabaseException#CONSTRAINT_ERR}
	 * 
	 * See <a
	 * href="https://developer.mozilla.org/en/IndexedDB/IDBObjectStore#add"
	 * >https://developer.mozilla.org/en/IndexedDB/IDBObjectStore#add</a>
	 * 
	 * @param value
	 *            The value to be stored.
	 * @param key
	 *            The key to use to identify the record. If unspecified, it
	 *            results to null.
	 * @return
	 * @throws IDBDatabaseException
	 */
	public final IDBRequest<?> add(JavaScriptObject value, Object key)
			throws IDBDatabaseException {
		try{
			return addImpl(value, key);
		} catch(JavaScriptException e){
			throw new IDBDatabaseException(e);
		}
	}

	private final native IDBRequest<?> addImpl(JavaScriptObject value, Object key)
			throws JavaScriptException /*-{
		if(!key){
			return this.add(value);
		}
		return this.add(value, key);
	}-*/;

	/**
	 * If the mode of the transaction that this object store belongs to is
	 * {@link IDBTransaction#READ_ONLY}, this method raises an
	 * {@link IDBDatabaseException} with its code set to
	 * {@link IDBDatabaseException#READ_ONLY_ERR}. Otherwise, this method
	 * creates and immediately returns an {@link IDBRequest} object, and clears
	 * this object store in a separate thread. Clearing an object store consists
	 * of removing all records from the object store and removing all records in
	 * indexes that reference the object store. See <a
	 * href="https://developer.mozilla.org/en/IndexedDB/IDBObjectStore#clear"
	 * >https://developer.mozilla.org/en/IndexedDB/IDBObjectStore#clear</a>
	 * 
	 * @return
	 * @throws IDBDatabaseException
	 */
	public final IDBRequest<Void> clear() throws IDBDatabaseException {
		try{
			return clearImpl();
		} catch(JavaScriptException e){
			throw new IDBDatabaseException(e);
		}
	}
	
	private final native IDBRequest<Void> clearImpl() throws JavaScriptException /*-{
		return this.clear();
	}-*/;
	
	/**
	 * Immediately returns an {@link IDBRequest} object and asynchronously count
	 * the amount of objects in the object store that match the parameter, a key
	 * or a key range. If the parameter is not valid returns an exception.
	 * 
	 * See <a
	 * href="https://developer.mozilla.org/en/IndexedDB/IDBObjectStore#count"
	 * >https://developer.mozilla.org/en/IndexedDB/IDBObjectStore#count</a>
	 * 
	 * @return A request object on which subsequent events related to this
	 *         operation are fired.
	 * @throws IDBDatabaseException
	 */
	public final IDBRequest<Integer> count() throws IDBDatabaseException {
		try{
			return countImpl(null);
		} catch(JavaScriptException e){
			throw new IDBDatabaseException(e);
		}
	}
	
	/**
	 * Immediately returns an {@link IDBRequest} object and asynchronously count
	 * the amount of objects in the object store that match the parameter, a key
	 * or a key range. If the parameter is not valid returns an exception.
	 * 
	 * See <a
	 * href="https://developer.mozilla.org/en/IndexedDB/IDBObjectStore#count"
	 * >https://developer.mozilla.org/en/IndexedDB/IDBObjectStore#count</a>
	 * 
	 * @param key
	 *            The key or key range that identifies the records to be
	 *            counted.
	 * @return A request object on which subsequent events related to this
	 *         operation are fired.
	 * @throws IDBDatabaseException
	 */
	public final IDBRequest<Integer> count(K key) throws IDBDatabaseException {
		try{
			return countImpl(key);
		} catch(JavaScriptException e){
			throw new IDBDatabaseException(e);
		}
	}
	
	private final native IDBRequest<Integer> countImpl(K key) throws JavaScriptException /*-{
		return this.count(key);
	}-*/;
	/**
	 * Creates and returns a new index in the connected database. Note that this
	 * method must be called only from a {@link IDBTransaction#VERSION_CHANGE}
	 * transaction callback.
	 * 
	 * See <a href=
	 * "https://developer.mozilla.org/en/IndexedDB/IDBObjectStore#createIndex"
	 * >https
	 * ://developer.mozilla.org/en/IndexedDB/IDBObjectStore#createIndex</a>
	 * 
	 * @param name
	 *            The name of the index to create.
	 * @param keyPath
	 *            The key path for the index to use.
	 * 
	 * @return The newly created index.
	 * @throws IDBDatabaseException
	 */
	public final IDBIndex<K> createIndex(String name, String keyPath) throws IDBDatabaseException {
		try{
			return createIndexImpl(name, keyPath, null);
		} catch(JavaScriptException e){
			throw new IDBDatabaseException(e);
		}
	}
	/**
	 * Creates and returns a new index in the connected database. Note that this
	 * method must be called only from a {@link IDBTransaction#VERSION_CHANGE}
	 * transaction callback.
	 * 
	 * See <a href=
	 * "https://developer.mozilla.org/en/IndexedDB/IDBObjectStore#createIndex"
	 * >https
	 * ://developer.mozilla.org/en/IndexedDB/IDBObjectStore#createIndex</a>
	 * 
	 * @param name
	 *            The name of the index to create.
	 * @param keyPath
	 *            The key path for the index to use.
	 * @param parameters
	 *            Optional. <b>Warning</b>: The latest draft of the
	 *            specification changed this to IDBIndexParameters, which is not
	 *            yet recognized by any browser. Options object whose attributes
	 *            are optional parameters to the method. It includes the
	 *            following properties: <br/>
	 *            <b>unique</b> If true, the index will not allow duplicate
	 *            values for a single key. <br/>
	 *            <b>multientry</b> If true, the index will add an entry in the
	 *            index for each array element when the keypath resolves to an
	 *            Array. If false, it will add one single entry containing the
	 *            Array.<br/>
	 *            Unknown parameters are ignored.
	 * @return The newly created index.
	 * @throws IDBDatabaseException
	 */
	public final IDBIndex<K> createIndex(String name, String keyPath,
			IDBIndexParameters parameters) throws IDBDatabaseException {
		try{
			return createIndexImpl(name, keyPath, parameters);
		} catch(JavaScriptException e){
			throw new IDBDatabaseException(e);
		}
	}
	
	private final native IDBIndex<K> createIndexImpl(String name, String keyPath,
			IDBIndexParameters parameters) throws JavaScriptException /*-{
		return this.createIndex(name, keyPath, parameters);
	}-*/;
	
	/**
	 * Immediately returns an {@link IDBRequest} object, and removes the record
	 * specified by the given key from this object store, and any indexes that
	 * reference it, in a separate thread. If no record exists in this object
	 * store corresponding to the key, an error event is fired on the returned
	 * request object, with its code set to
	 * {@link IDBDatabaseException#NOT_FOUND_ERR} and an appropriate message. If
	 * the record is successfully removed, then a success event is fired on the
	 * returned request object, using the IDBTransactionEvent interface, with
	 * the result set to undefined, and transaction set to the transaction in
	 * which this object store is opened.
	 * 
	 * See <a
	 * href="https://developer.mozilla.org/en/IndexedDB/IDBObjectStore#delete"
	 * >https://developer.mozilla.org/en/IndexedDB/IDBObjectStore#delete</a>
	 * 
	 * @param key
	 *            The key to use to identify the record.
	 * @return A request object on which subsequent events related to this
	 *         operation are fired.
	 * @throws IDBDatabaseException
	 */
	public final IDBRequest<Void> delete(K key) throws IDBDatabaseException {
		try{
			if(key instanceof Long){
				return deleteNumericImpl(((Long)key).doubleValue());
			}
			return deleteImpl(key);
		} catch(JavaScriptException e){
			throw new IDBDatabaseException(e);
		}
	}
	private final native IDBRequest<Void> deleteNumericImpl(double key) throws JavaScriptException /*-{
		
		return this["delete"](key);
	}-*/;
	private final native IDBRequest<Void> deleteImpl(K key) throws JavaScriptException /*-{
		return this["delete"](key);
	}-*/;
	/**
	 * Destroys the index with the specified name in the connected database.
	 * Note that this method must be called only from a
	 * {@link IDBTransaction#VERSION_CHANGE} transaction callback.
	 * 
	 * See <a href=
	 * "https://developer.mozilla.org/en/IndexedDB/IDBObjectStore#deleteIndex"
	 * >https
	 * ://developer.mozilla.org/en/IndexedDB/IDBObjectStore#deleteIndex</a>
	 * 
	 * @param indexName
	 *            The name of the existing index to remove
	 * @throws IDBDatabaseException
	 */
	public final void deleteIndex(String indexName) throws IDBDatabaseException {
		try{
			deleteIndexImpl(indexName);
		} catch(JavaScriptException e){
			throw new IDBDatabaseException(e);
		}
	}
	private final native void deleteIndexImpl(String indexName) throws JavaScriptException /*-{
		this.deleteIndex(indexName);
	}-*/;
	/**
	 * Immediately returns an {@link IDBRequest} object, and retrieves the
	 * requested record from the object store in a separate thread. If the
	 * operation is successful, then a success event is fired on the returned
	 * object, using the IDBTransactionEvent interface, with its result set to
	 * the retrieved value, and transaction set to the transaction in which this
	 * object store is opened. If a record does not exist in the object store
	 * for the key parameter, then an error event is fired on the returned
	 * object, with its code set to {@link IDBDatabaseException#NOT_FOUND_ERR}
	 * and an appropriate message.
	 * <p>
	 * <b>Note</b>: This function produces the same result if no record with the
	 * given key exists in the database as when a record exists, but with an
	 * undefined value. To tell these situations apart, call the
	 * {@link #openCursor()} method with the same key. That method provides a
	 * cursor if the record exists, and not if it does not.
	 * </p>
	 * 
	 * See <a
	 * href="https://developer.mozilla.org/en/IndexedDB/IDBObjectStore#get"
	 * >https://developer.mozilla.org/en/IndexedDB/IDBObjectStore#get</a>
	 * 
	 * @param key
	 *            The key identifying the record to retrieve.
	 * @return A request object on which subsequent events related to this
	 *         operation are fired.
	 * @throws IDBDatabaseException
	 */
	public final IDBRequest<?> get(K key) throws IDBDatabaseException {
		try{
			if(key instanceof Long){
				return getNumericImpl(((Long)key).doubleValue());
			}
			return getImpl(key);
		} catch(JavaScriptException e){
			throw new IDBDatabaseException(e);
		}
	}
	private final native IDBRequest<?> getNumericImpl(double key) throws JavaScriptException /*-{
		return this.get(key);
	}-*/;
	private final native IDBRequest<?> getImpl(K key) throws JavaScriptException /*-{
		return this.get(key);
	}-*/;
	/**
	 * Opens the named index in this object store.
	 * 
	 * See <a
	 * href="https://developer.mozilla.org/en/IndexedDB/IDBObjectStore#index"
	 * >https://developer.mozilla.org/en/IndexedDB/IDBObjectStore#index</a>
	 * 
	 * @param name
	 *            The name of the index to open.
	 * @return An object for accessing the index.
	 * @throws IDBDatabaseException
	 */
	public final IDBIndex<K> index(String name) throws IDBDatabaseException {
		try{
			return indexImpl(name);
		} catch(JavaScriptException e){
			throw new IDBDatabaseException(e);
		}
	}
	private final native IDBIndex<K> indexImpl(String name) throws JavaScriptException /*-{
		return this.index(name);
	}-*/;
	/**
	 * Immediately returns an {@link IDBRequest} object, and creates a cursor
	 * over the records in this object store, in a separate thread. If there is
	 * even a single record that matches the key range, then a success event is
	 * fired on the returned object, with its result set to the
	 * {@link IDBCursor} object for the new cursor. If no records match the key
	 * range, then a success event is fired on the returned object, with its
	 * result set to null.
	 * 
	 * See <a href=
	 * "https://developer.mozilla.org/en/IndexedDB/IDBObjectStore#openCursor"
	 * >https://developer.mozilla.org/en/IndexedDB/IDBObjectStore#openCursor</a>
	 * 
	 * @param range
	 *            The key range to use as the cursor's range. If this parameter
	 *            is unspecified or null, then the range includes all the
	 *            records in the object store.
	 * @param direction
	 *            The cursor's direction. One of {@link IDBCursor#NEXT},
	 *            {@link IDBCursor#NEXT_NO_DUPLICATE}, {@link IDBCursor#PREV} or
	 *            {@link IDBCursor#PREV_NO_DUPLICATE}
	 * @return A request object on which subsequent events related to this
	 *         operation are fired.
	 * @throws IDBDatabaseException
	 * @deprecated
	 */
	public final IDBRequest<?> openCursor(IDBKeyRange range, int direction)
			throws IDBDatabaseException {
		try{
			return openCursorImpl(range, direction);
		} catch(JavaScriptException e){
			throw new IDBDatabaseException(e);
		}
	}
	/**
	 * Immediately returns an {@link IDBRequest} object, and creates a cursor
	 * over the records in this object store, in a separate thread. If there is
	 * even a single record that matches the key range, then a success event is
	 * fired on the returned object, with its result set to the
	 * {@link IDBCursor} object for the new cursor. If no records match the key
	 * range, then a success event is fired on the returned object, with its
	 * result set to null.
	 * 
	 * See <a href=
	 * "https://developer.mozilla.org/en/IndexedDB/IDBObjectStore#openCursor"
	 * >https://developer.mozilla.org/en/IndexedDB/IDBObjectStore#openCursor</a>
	 * 
	 * @param range
	 *            The key range to use as the cursor's range. If this parameter
	 *            is unspecified or null, then the range includes all the
	 *            records in the object store.
	 * @param direction
	 *            The cursor's direction. One of {@link IDBCursor#CURSOR_NEXT},
	 *            {@link IDBCursor#CURSOR_NEXT_NO_DUPLICATE}, {@link IDBCursor#CURSOR_PREV} or
	 *            {@link IDBCursor#CURSOR_PREV_NO_DUPLICATE}
	 * @return A request object on which subsequent events related to this
	 *         operation are fired.
	 * @throws IDBDatabaseException
	 */
	public final IDBRequest<?> openCursor(IDBKeyRange range, String direction)
			throws IDBDatabaseException {
		try{
			return openCursorImpl(range, direction);
		} catch(JavaScriptException e){
			throw new IDBDatabaseException(e);
		}
	}
	/**
	 * @deprecated use new API implementation {@link IDBObjectStore#openCursorImpl(IDBKeyRange, String)} instead.
	 */
	private final native IDBRequest<?> openCursorImpl(IDBKeyRange range, int direction) throws JavaScriptException /*-{
		return this.openCursor(range, direction);
	}-*/;
	/**
	 * Native implementation of open cursor.
	 * @param range
	 * @param direction
	 * @return
	 * @throws JavaScriptException
	 */
	private final native IDBRequest<?> openCursorImpl(IDBKeyRange range, String direction) throws JavaScriptException /*-{
		return this.openCursor(range, direction);
	}-*/;
	/**
	 * Returns an {@link IDBRequest} object, and, in a separate thread, creates
	 * a structured clone of the value, and stores the cloned value in the
	 * object store. If the record is successfully stored, then a success event
	 * is fired on the returned request object, using the IDBTransactionEvent
	 * interface, with the result set to the key for the stored record, and
	 * transaction set to the transaction in which this object store is opened.
	 * 
	 * See <a
	 * href="https://developer.mozilla.org/en/IndexedDB/IDBObjectStore#put"
	 * >https://developer.mozilla.org/en/IndexedDB/IDBObjectStore#put</a>
	 * 
	 * @param value
	 *            The value to be stored.
	 * @param key
	 *            The key to use to identify the record. If unspecified, it
	 *            results to null.
	 * @return A request object on which subsequent events related to this
	 *         operation are fired.
	 * @throws IDBDatabaseException
	 */
	public final IDBRequest<?> put(JavaScriptObject value, K key)
			throws IDBDatabaseException {
		try{
			return putImpl(value, key);
		} catch(JavaScriptException e){
			throw new IDBDatabaseException(e);
		}
	}
	private final native IDBRequest<?> putImpl(JavaScriptObject value, K key) throws JavaScriptException /*-{
		if(!key){
			return this.put(value);
		}
		return this.put(value, key);
	}-*/;
}
