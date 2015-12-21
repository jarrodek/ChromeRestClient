package com.google.gwt.chrome.storage;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * Each call to chrome.[storage area].get will end up with an object where keys
 * are requested keys and values are corresponding values.
 * 
 * This is convenient class to automatically cast types of the result to the T
 * type.
 * 
 * @author Pawel Psztyc
 *
 */
public class StorageResult<T> extends JavaScriptObject {
	protected StorageResult() {
	}
	
	/**
	 * Get value for given key.
	 * @param key requested key.
	 * @return T object or null if not found.
	 */
	public final native T get(String key) /*-{
		return this[key];
	}-*/;
	/**
	 * Get boolean value for given key.
	 * @param key requested key 
	 * @return
	 */
	public final native Boolean getBoolean(String key) /*-{
		if(!(key in this) || this[key] === null || this[key] === undefined){
			return null;
		}
		if(typeof this[key] !== 'boolean'){
			console.warn('Trying to cast ' + key + ' key on object ' , this , ' to boolean but it is a type of ', typeof this[key]);
			return null;
		}
		if(this[key]){
			return @java.lang.Boolean::TRUE;
		}
		return @java.lang.Boolean::FALSE;
	}-*/;
	/**
	 * Get double value for given key.
	 * @param key requested key 
	 * @return
	 */
	public final native Double getDouble(String key) /*-{
		if(!(key in this) || this[key] === null || this[key] === undefined){
			return null;
		}
		if(typeof this[key] !== 'number'){
			console.warn('Trying to cast ' + key + ' key on object ' , this , ' to number but it is a type of ', typeof this[key]);
			return null;
		}
		return @java.lang.Double::new(D)(this[key]);
	}-*/;
	/**
	 * Get JavaScriptObject value for given key.
	 * @param key requested key 
	 * @return
	 */
	public final native JavaScriptObject getObject(String key) /*-{
		return this[key];
	}-*/;
	/**
	 * Get value for given key.
	 * This method return a value of any Object.
	 * @param key key requested key.
	 * @return
	 */
	public final native Object getAny(String key) /*-{
		return this[key];
	}-*/;
	
	/**
	 * @return Object's keys
	 */
	public final native String[] getKeys() /*-{
	    var i = 0;
	    var result = [];
	    for (var key in this) {
	      if (this.hasOwnProperty(key)) {
	        result[i++] = key;
	      }
	    }
	    return result;
	}-*/; 
}
