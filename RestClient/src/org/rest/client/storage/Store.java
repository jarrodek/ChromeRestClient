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
package org.rest.client.storage;

import java.util.List;
import java.util.Map;

/**
 * Main store interface. It should be implemented by adapters via
 * {@link StorageAdapter} interface.
 * 
 * @author Paweł Psztyć
 * 
 * @param <K>
 *            key representation object
 * @param <V>
 *            value representation object
 */
public interface Store<K, V> {
	/**
	 * Open storage implementation. As a asynchronous nature of many storage
	 * implementation result will be passed to callback function.
	 * 
	 * @param callback
	 */
	void open(StoreResultCallback<Boolean> callback);

	/**
	 * Returns in callback list of all available keys.
	 * <p>
	 * By keys I mean list of the key value of key-value pair.
	 * </p>
	 * <p>
	 * Not all implementations can result for keys. Some of them should pass
	 * null if it is not impossible to get all keys from storage.
	 * </p>
	 * 
	 * @param callback
	 */
	void keys(StoreResultCallback<List<K>> callback);

	/**
	 * Add new value {@link V} to store. As a result it returns {@link K} as
	 * inserted key
	 * 
	 * @param obj
	 *            object value to save
	 * @param key
	 *            Key for storage. Can be NULL if store do not request keys for
	 *            save action.
	 * @param callback
	 *            callback parameter is created key
	 */
	void put(V obj, K key, StoreResultCallback<K> callback);

	/**
	 * Get object by it's key
	 * 
	 * @param key
	 * @param callback
	 */
	void getByKey(K key, StoreResultCallback<V> callback);

	/**
	 * Check if value exists for given Key
	 * 
	 * @param key
	 * @param callback
	 */
	void exists(K key, StoreResultCallback<Boolean> callback);

	/**
	 * Get all values from datastore.
	 * 
	 * @param callback
	 */
	void all(StoreResultCallback<Map<K, V>> callback);

	/**
	 * Remove from storage by key.
	 * 
	 * @param key
	 * @param callback
	 */
	void remove(K key, StoreResultCallback<Boolean> callback);

	/**
	 * Get count of all stored values
	 * 
	 * @param callback
	 */
	void countAll(StoreResultCallback<Integer> callback);

	/**
	 * Query storage for data. Some storage implementations do not provide query
	 * methods.
	 * 
	 * @param query
	 *            String query to look for
	 * @param index
	 *            Indexed search field
	 * @param callback
	 */
	void query(String query, String index,
			StoreResultCallback<Map<K, V>> callback);
}
