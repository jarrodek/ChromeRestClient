package org.rest.client;

import org.rest.client.storage.store.LocalStore;

import com.google.gwt.chrome.storage.Storage;
import com.google.gwt.chrome.storage.StorageArea.StorageItemsCallback;
import com.google.gwt.chrome.storage.StorageChangeObject;
import com.google.gwt.chrome.storage.SyncStorageArea;
import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.json.client.JSONBoolean;
import com.google.gwt.json.client.JSONObject;

/**
 * App's adapter for chrome.sync API.
 * 
 * 
 * @author Pawel Psztyc
 *
 */
public class SyncAdapter {
	/**
	 * Is debug setting enabled.
	 */
	public static boolean debug = true;
	/**
	 * Id history setting enabled.
	 */
	public static boolean history = true;
	/**
	 * Are notifications from developer setting enabled.
	 */
	public static boolean notifications = true;
	/**
	 * Are magic variables setting enabled.
	 */
	public static boolean magicVars = true;
	/**
	 * is code mirror support for headers setting enabled.
	 */
	public static boolean codeMirrorHeaders = true;
	/**
	 * s code mirror support for payload setting enabled.
	 */
	public static boolean codeMirrorPayload = true;
	/**
	 * True if this adapter already set storage event handlers.
	 */
	public static boolean observing = false;
	
	public static void sync(final Callback<Void, Void> callback){
		Storage chromeStore = GWT.create(Storage.class);
		SyncStorageArea sync = chromeStore.getSync();
		
		JSONObject query = new JSONObject();
		query.put(LocalStore.DEBUG_KEY, JSONBoolean.getInstance(debug));
		query.put(LocalStore.HISTORY_KEY, JSONBoolean.getInstance(history));
		query.put(LocalStore.NOTIFICATIONS_ENABLED_KEY, JSONBoolean.getInstance(notifications));
		query.put(LocalStore.MAGIC_VARS_ENABLED_KEY, JSONBoolean.getInstance(magicVars));
		query.put(LocalStore.CODE_MIRROR_HEADERS_KEY, JSONBoolean.getInstance(codeMirrorHeaders));
		query.put(LocalStore.CODE_MIRROR_PAYLOAD_KEY, JSONBoolean.getInstance(codeMirrorPayload));
		
		sync.get(query.getJavaScriptObject(), new StorageItemsCallback() {
			@Override
			public void onResult(JavaScriptObject _data) {
				if(_data == null){
					callback.onFailure(null);
					return;
				}
				SyncData data = _data.cast();
				debug = data.getDebug();
				history = data.getHistory();
				notifications = data.getNotifications();
				magicVars = data.getMagicVariables();
				codeMirrorHeaders = data.getCodeMirrorHeaders();
				codeMirrorPayload = data.getCodeMirrorPayload();
				callback.onSuccess(null);
			}
			
			@Override
			public void onError(String message) {
				callback.onFailure(null);
			}
		});
	}
	/**
	 * Observe changes to the storage.
	 */
	public static void observe(){
		if(observing) return;
		observing = true;
		Storage chromeStore = GWT.create(Storage.class);
		chromeStore.addChangeHandler(new Storage.StorageChangeHandler() {
			@Override
			public void onChange(StorageChangeObject data, String areaName) {
				if(areaName.equals(com.google.gwt.chrome.storage.Storage.SYNC)){
					sync(new Callback<Void, Void>() {

						@Override
						public void onFailure(Void reason) {}

						@Override
						public void onSuccess(Void result) {}
					});
				}
			}
		});
	}
}
