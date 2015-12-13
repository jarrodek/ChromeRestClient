package org.rest.client;

import org.rest.client.storage.store.LocalStore;

import com.google.gwt.core.client.JavaScriptObject;

public class SyncData extends JavaScriptObject {
	
	protected SyncData(){}
	
	public final boolean getDebug(){
		return getVar(LocalStore.DEBUG_KEY);
	}
	public final boolean getHistory(){
		return getVar(LocalStore.HISTORY_KEY);
	}
	public final boolean getNotifications(){
		return getVar(LocalStore.NOTIFICATIONS_ENABLED_KEY);
	}
	public final boolean getMagicVariables(){
		return getVar(LocalStore.MAGIC_VARS_ENABLED_KEY);
	}
	public final boolean getCodeMirrorHeaders(){
		return getVar(LocalStore.CODE_MIRROR_HEADERS_KEY);
	}
	public final boolean getCodeMirrorPayload(){
		return getVar(LocalStore.CODE_MIRROR_PAYLOAD_KEY);
	}
	private final native boolean getVar(String key)/*-{
		if(typeof this[key] === 'undefined'){
			this[key] = true;
		}
		return this[key];
	}-*/;
}
