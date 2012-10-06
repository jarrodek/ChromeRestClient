package org.rest.client;

import com.google.gwt.core.client.JavaScriptObject;

public class SyncData extends JavaScriptObject {
	
	protected SyncData(){}
	
	public final native String getDebug()/*-{
		var key = @org.rest.client.storage.store.LocalStore::DEBUG_KEY;
		return this[key] || null;
	}-*/;
	public final native String getHistory()/*-{
		var key = @org.rest.client.storage.store.LocalStore::HISTORY_KEY;
		return this[key] || null;
	}-*/;
	public final native String getNotifications()/*-{
		var key = @org.rest.client.storage.store.LocalStore::NOTIFICATIONS_ENABLED_KEY;
		return this[key] || null;
	}-*/;
	
}
