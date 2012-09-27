package org.rest.client.chrome;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.json.client.JSONObject;

public interface StorageArea {
	/**
	 * Callback with the amount of space being used by storage, or on failure
	 * (in which case chrome.runtime.lastError will be set).
	 * 
	 * @author jarrod
	 * 
	 */
	public interface StorageUseCallback {
		/**
		 * @param bytesInUse
		 *            Amount of space being used in storage, in bytes.
		 */
		void onCalculate(double bytesInUse);
		/**
		 * Called when error occurred
		 * @param message
		 */
		void onError(String message);
	}

	/**
	 * Callback on success, or on failure (in which case
	 * chrome.runtime.lastError will be set).
	 * 
	 * @author jarrod
	 * 
	 */
	public interface StorageSimpleCallback {
		void onDone();
	}

	/**
	 * Callback with storage items, or on failure (in which case
	 * chrome.runtime.lastError will be set).
	 * 
	 * @author jarrod
	 * 
	 */
	public interface StorageItemsCallback {
		/**
		 * 
		 * @param data
		 *            Object with items in their key-value mappings.
		 */
		void onResult(JSONObject data);
		/**
		 * Called when error occurred
		 * @param message
		 */
		void onError(String message);
	}
	/**
	 * Callback with storage one item, or on failure (in which case
	 * chrome.runtime.lastError will be set).
	 * 
	 * @author jarrod
	 * 
	 */
	public interface StorageItemCallback {
		/**
		 * 
		 * @param data
		 *            Object with items in their key-value mappings.
		 */
		void onResult(String data);
		/**
		 * Called when error occurred
		 * @param message
		 */
		void onError(String message);
	}

	/**
	 * Gets the amount of space (in bytes) being used by one or more items.
	 * 
	 * @param key
	 *            A single key to get the total usage for. Pass in null to get
	 *            the total usage of all of storage.
	 * @param callback
	 *            Callback with the amount of space being used by storage, or on
	 *            failure (in which case chrome.runtime.lastError will be set).
	 */
	void getBytesInUse(String key, StorageUseCallback callback);

	/**
	 * 
	 * @param keys
	 *            A list of keys to get the total usage for. An empty list will
	 *            return 0.
	 * @param callback
	 *            Callback with the amount of space being used by storage, or on
	 *            failure (in which case chrome.runtime.lastError will be set).
	 */
	void getBytesInUse(String[] keys, StorageUseCallback callback);

	/**
	 * Removes all items from storage.
	 * 
	 * @param callback
	 *            Callback on success, or on failure (in which case
	 *            chrome.runtime.lastError will be set).
	 */
	void clear(StorageSimpleCallback callback);

	/**
	 * Sets multiple items.
	 * 
	 * @param data
	 *            Object specifying items to augment storage with. Values that
	 *            cannot be serialized (functions, etc) will be ignored.
	 * @param callback
	 *            Callback on success, or on failure (in which case
	 *            chrome.runtime.lastError will be set).
	 */
	void set(JavaScriptObject data, StorageSimpleCallback callback);

	/**
	 * Removes item from storage.
	 * 
	 * @param key
	 *            A single key of the item to remove.
	 * @param callback
	 *            Callback on success, or on failure (in which case
	 *            chrome.runtime.lastError will be set).
	 */
	void remove(String key, StorageSimpleCallback callback);

	/**
	 * Removes many items from storage.
	 * 
	 * @param keys
	 *            A list of keys for items to remove.
	 * @param callback
	 *            Callback on success, or on failure (in which case
	 *            chrome.runtime.lastError will be set).
	 */
	void remove(String[] keys, StorageSimpleCallback callback);

	/**
	 * Gets item from storage.
	 * 
	 * @param key
	 *            A single key to get. Pass in null to get the entire contents
	 *            of storage.
	 * @param callback
	 *            Callback with storage item, or on failure (in which case
	 *            chrome.runtime.lastError will be set).
	 */
	void get(String key, StorageItemCallback callback);

	/**
	 * Gets items from storage.
	 * 
	 * @param keys
	 *            A list of keys to get. An empty list or object will return an
	 *            empty result object.
	 * @param callback
	 *            Callback with storage items, or on failure (in which case
	 *            chrome.runtime.lastError will be set).
	 */
	void get(String[] keys, StorageItemsCallback callback);

	/**
	 * Gets items from storage.
	 * 
	 * @param keysWithDefaults
	 *            A dictionary specifying default values. An empty object will
	 *            return an empty result object.
	 * @param callback
	 *            Callback with storage items, or on failure (in which case
	 *            chrome.runtime.lastError will be set).
	 */
	void get(JavaScriptObject keysWithDefaults, StorageItemsCallback callback);
}
