package org.rest.client.storage;

import com.google.gwt.core.client.JavaScriptObject;

public abstract class WebSqlAdapter<K, V extends JavaScriptObject> implements StorageAdapter<K, V> {
	
	
		@Override
	public String adapter() {
		return "WebSqlAdapter";
	}

	@Override
	public void valid(StoreResultCallback<Boolean> callback) {
		callback.onSuccess(true);
	}

}
