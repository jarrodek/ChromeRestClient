package org.rest.client;

import org.rest.client.storage.store.LocalStore;

import com.google.gwt.core.client.JavaScriptObject;

public class SyncData extends JavaScriptObject {
	
	protected SyncData(){}
	
	public final String getDebug(){
		return getVar(LocalStore.DEBUG_KEY);
	}
	public final String getHistory(){
		return getVar(LocalStore.HISTORY_KEY);
	}
	public final String getNotifications(){
		return getVar(LocalStore.NOTIFICATIONS_ENABLED_KEY);
	}
	public final String getMagicVariables(){
		return getVar(LocalStore.MAGIC_VARS_ENABLED_KEY);
	}
	public final String getCodeMirrorHeaders(){
		return getVar(LocalStore.CODE_MIRROR_HEADERS_KEY);
	}
	public final String getCodeMirrorPayload(){
		return getVar(LocalStore.CODE_MIRROR_PAYLOAD_KEY);
	}
	private final native String getVar(String key)/*-{
		return this[key] || null;
	}-*/;
}
