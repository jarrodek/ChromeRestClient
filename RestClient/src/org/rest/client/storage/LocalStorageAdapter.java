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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.google.gwt.chrome.storage.LocalStorageArea;
import com.google.gwt.chrome.storage.Storage;
import com.google.gwt.chrome.storage.StorageArea;
import com.google.gwt.chrome.storage.StorageArea.StorageItemsCallback;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;

public class LocalStorageAdapter implements StorageAdapter<String, String> {
	
	private LocalStorageArea _storeImpl;
	private com.google.gwt.storage.client.Storage _oldStorage;

	@Override
	public void open(StoreResultCallback<Boolean> callback) {
		_oldStorage = com.google.gwt.storage.client.Storage.getLocalStorageIfSupported();
		_storeImpl = Storage.getStorage().getLocal();
		callback.onSuccess(true);
	}

	@Override
	public void keys(final StoreResultCallback<List<String>> callback) {
		_storeImpl.get(new StorageItemsCallback() {
			
			@Override
			public void onResult(JavaScriptObject data) {
				final ArrayList<String> result = new ArrayList<String>();
				if(data == null){
					callback.onSuccess(result);
					return;
				}
				JSONObject o = new JSONObject(data);
				Set<String> set = o.keySet();
				String[] keys = (String[]) set.toArray();
				for(int i=0; i<keys.length; i++){
					result.add(keys[i]);
				}
				callback.onSuccess(result);
			}
			
			@Override
			public void onError(String message) {
				callback.onError(new Throwable(message));
			}
		});
	}

	@Override
	public void put(final String obj, final String key, final StoreResultCallback<String> callback) {
		if(key == null || key.isEmpty()){
			callback.onError(null);
			return;
		}
		JSONObject o = new JSONObject();
		o.put(key, new JSONString(obj));
		_storeImpl.set(o.getJavaScriptObject(), new StorageArea.StorageSimpleCallback() {
			
			@Override
			public void onError(String message) {
				callback.onError(new Throwable(message));
			}
			
			@Override
			public void onDone() {
				callback.onSuccess(key);
			}
		});
	}

	@Override
	public void getByKey(final String key, final StoreResultCallback<String> callback) {
		final String oldValue = _oldStorage.getItem(key);
		if(oldValue != null){
			put(oldValue, key, new StoreResultCallback<String>() {
				@Override
				public void onSuccess(String result) {
					_oldStorage.removeItem(key);
					callback.onSuccess(oldValue);
				}
				
				@Override
				public void onError(Throwable e) {
					callback.onSuccess(oldValue);
				}
			});
		} else {
			getByKeyNew(key, callback);
		}
	}
	
	private void getByKeyNew(final String key, final StoreResultCallback<String> callback){
		_storeImpl.get(key, new StorageArea.StorageItemCallback() {
			@Override
			public void onResult(String data) {
				callback.onSuccess(data);
			}
			
			@Override
			public void onError(String message) {
				callback.onError(new Throwable(message));
			}
		});
	}

	@Override
	public void exists(final String key, final StoreResultCallback<Boolean> callback) {
		final String oldValue = _oldStorage.getItem(key);
		if(oldValue != null){
			put(oldValue, key, new StoreResultCallback<String>() {
				@Override
				public void onSuccess(String result) {
					_oldStorage.removeItem(key);
					callback.onSuccess(oldValue != null);
				}
				
				@Override
				public void onError(Throwable e) {
					callback.onSuccess(oldValue != null);
				}
			});
		} else {
			existsNew(key, callback);
		}
	}
	
	private void existsNew(String key, final StoreResultCallback<Boolean> callback) {
		getByKeyNew(key, new StoreResultCallback<String>() {
			
			@Override
			public void onSuccess(String result) {
				if(result == null){
					callback.onSuccess(false);
				} else {
					callback.onSuccess(true);
				}
			}
			
			@Override
			public void onError(Throwable e) {
				callback.onError(e);
			}
		});
	}

	@Override
	public void all(final StoreResultCallback<Map<String, String>> callback) {
		final Map<String, String> oldValues = new HashMap<String, String>();
		int len = _oldStorage.getLength();
		for(int i=0; i<len; i++){
			String key = _oldStorage.key(i);
			oldValues.put(key, _oldStorage.getItem(key));
		}
		if(oldValues.size() > 0){
			JSONObject o = new JSONObject();
			Iterator<String> it = oldValues.keySet().iterator();
			while(it.hasNext()){
				String key = it.next();
				o.put(key, new JSONString(oldValues.get(key)));
			}
			_storeImpl.set(o.getJavaScriptObject(), new StorageArea.StorageSimpleCallback() {
				@Override
				public void onError(String message) {
					callback.onSuccess(oldValues);
				}
				
				@Override
				public void onDone() {
					Iterator<String> it = oldValues.keySet().iterator();
					while(it.hasNext()){
						String key = it.next();
						_oldStorage.removeItem(key);
					}
					allNew(callback);
				}
			});
		} else {
			allNew(callback);
		}
	}
	
	private void allNew(final StoreResultCallback<Map<String, String>> callback){
		final Map<String, String> result = new HashMap<String, String>();
		_storeImpl.get(new StorageItemsCallback() {
			
			@Override
			public void onResult(JavaScriptObject data) {
				JSONObject o = new JSONObject(data);
				Set<String> set = o.keySet();
				if(set == null){
					callback.onSuccess(result);
					return;
				}
				Iterator<String> it = set.iterator();
				if(it == null){
					callback.onSuccess(result);
					return;
				}
				while(it.hasNext()){
					String key = it.next();
					result.put(key, o.get(key).toString());
				}
				callback.onSuccess(result);
			}
			
			@Override
			public void onError(String message) {
				callback.onError(new Throwable(message));
			}
		});
	}

	@Override
	public void remove(String key, final StoreResultCallback<Boolean> callback) {
		_oldStorage.removeItem(key);
		_storeImpl.remove(key, new StorageArea.StorageSimpleCallback() {
			@Override
			public void onError(String message) {
				callback.onError(new Throwable(message));
			}
			
			@Override
			public void onDone() {
				callback.onSuccess(true);
			}
		});
		
	}

	@Override
	public String adapter() {
		return "chrome-storage-local";
	}

	@Override
	public void valid(StoreResultCallback<Boolean> callback) {
		callback.onSuccess(true);
	}

	@Override
	public void countAll(final StoreResultCallback<Integer> callback) {
		all(new StoreResultCallback<Map<String,String>>() {
			
			@Override
			public void onSuccess(Map<String, String> result) {
				callback.onSuccess(result.size());
			}
			
			@Override
			public void onError(Throwable e) {
				callback.onError(e);
			}
		});
	}

	@Override
	public void query(String query, String index,
			StoreResultCallback<Map<String, String>> callback) {
		callback.onError(new Throwable("This adapter do not support query method."));
	}

}
