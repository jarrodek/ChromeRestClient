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
import java.util.List;
import java.util.Map;

import com.google.gwt.storage.client.Storage;

public class LocalStorageAdapter implements StorageAdapter<String, String> {
	
	private Storage _storeImpl = null;
	
	@Override
	public void open(StoreResultCallback<Boolean> callback) {
		_storeImpl = Storage.getLocalStorageIfSupported();
		callback.onSuccess(_storeImpl != null);
	}

	@Override
	public void keys(StoreResultCallback<List<String>> callback) {
		ArrayList<String> result = new ArrayList<String>();
		int len = _storeImpl.getLength();
		for(int i=0; i<len; i++){
			result.add(_storeImpl.key(i));
		}
		callback.onSuccess(result);
	}

	@Override
	public void put(String obj, String key, StoreResultCallback<String> callback) {
		if(key == null || key.isEmpty()){
			callback.onError(null);
			return;
		}
		_storeImpl.setItem(key, obj);
		callback.onSuccess(key);
	}

	@Override
	public void getByKey(String key, StoreResultCallback<String> callback) {
		callback.onSuccess(_storeImpl.getItem(key));
	}

	@Override
	public void exists(String key, StoreResultCallback<Boolean> callback) {
		callback.onSuccess(_storeImpl.getItem(key) != null);
	}

	@Override
	public void all(StoreResultCallback<Map<String, String>> callback) {
		Map<String, String> result = new HashMap<String, String>();
		
		int len = _storeImpl.getLength();
		for(int i=0; i<len; i++){
			String key = _storeImpl.key(i);
			result.put(key, _storeImpl.getItem(key));
		}
		
		callback.onSuccess(result);
	}

	@Override
	public void remove(String key, StoreResultCallback<Boolean> callback) {
		_storeImpl.removeItem(key);
		callback.onSuccess(true);
	}

	@Override
	public String adapter() {
		return "local-storage";
	}

	@Override
	public void valid(StoreResultCallback<Boolean> callback) {
		callback.onSuccess(Storage.isLocalStorageSupported());
	}

	@Override
	public void countAll(StoreResultCallback<Integer> callback) {
		callback.onSuccess(_storeImpl.getLength());
	}

	@Override
	public void query(String query, String index,
			StoreResultCallback<Map<String, String>> callback) {
		callback.onError(null);
	}

}
