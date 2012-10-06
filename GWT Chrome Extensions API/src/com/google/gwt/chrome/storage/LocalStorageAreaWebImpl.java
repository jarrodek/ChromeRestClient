package com.google.gwt.chrome.storage;

import java.util.Iterator;


import com.google.gwt.chrome.storage.StorageArea.StorageItemsCallback;
import com.google.gwt.chrome.storage.StorageArea.StorageSimpleCallback;
import com.google.gwt.chrome.storage.StorageArea.StorageUseCallback;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.json.client.JSONValue;

/**
 * Implementation of local storage for web applications (not extensions).
 * @author Paweł Psztyć
 * 
 */
public class LocalStorageAreaWebImpl implements StorageAreaImpl {
	
	private LocalStorageAreaWebImpl(){}
	/**
	 * This method is not available for web applications. 
	 * @param keys
	 * @param callback Immediately return 0 
	 */
	@Override
	public final void getBytesInUse(String[] keys, StorageUseCallback callback) {
		callback.onCalculate(0);
	};

	@Override
	public final native void clear(StorageSimpleCallback callback) /*-{
		$wnd.localStorage.clear();
		callback.@com.google.gwt.chrome.storage.StorageArea.StorageSimpleCallback::onDone()();
	}-*/;
	@Override
	public final native void set(JavaScriptObject data, StorageSimpleCallback callback) /*-{
		for(var key in data){
			if(data.hasOwnProperty(key)){
				if(typeof data[key] == 'object'){
					try{
						data[key] = JSON.stringify(data[key]);
					}catch(e){
						$wnd.console.error('Unable to set item to localStore. This function return success!. Item key: ' + key + ', object: ', data[key], e);
					}
				}
				$wnd.localStorage.setItem(key,data[key]);
			}
 		}
		callback.@com.google.gwt.chrome.storage.StorageArea.StorageSimpleCallback::onDone()();
	}-*/;
	@Override
	public final void remove(String[] keys, StorageSimpleCallback callback) {
		for(String key : keys){
			_remove(key);
		}
		callback.onDone();
	};
	
	private final native void _remove(String key) /*-{
		$wnd.localStorage.removeItem(key);
	}-*/;
	
	@Override
	public final void get(JavaScriptObject keysWithDefaults,
			StorageItemsCallback callback){
		JSONObject obj = new JSONObject(keysWithDefaults);
		Iterator<String> it = obj.keySet().iterator();
		JSONObject result = new JSONObject();
		while(it.hasNext()){
			String key = it.next();
			String value = _get(key);
			if(value == null || value.isEmpty()) {
				JSONValue jsValue = obj.get(key);
				if(jsValue == null){
					value = "";
				} else {
					if(jsValue.isString() == null){
						value = "";
					} else {
						value = jsValue.isString().stringValue();
					}
				}
			}
			result.put(key, new JSONString(value));
		}
		callback.onResult(result.getJavaScriptObject());
	}
	
	private final native String _get(String key) /*-{
		return $wnd.localStorage.getItem(key);
	}-*/;

}
