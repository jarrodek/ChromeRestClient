package org.rest.client;

import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.GWT;

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
	static boolean observing = false;
	
	interface SyncResult {
		void onSync();
	}
	
	
	
	public static final void sync(final Callback<Void, Void> callback){
		getVars(new SyncResult() {
			@Override
			public void onSync() {
				observe();
				Void v = GWT.create(Void.class);
				callback.onSuccess(v);
			}
		});
	}
	
	private final native static void getVars(SyncResult fn) /*-{
		$wnd.arc.app.settings.getConfig()
		.then(function(data){
			@org.rest.client.SyncAdapter::debug = data.DEBUG_ENABLED;
			@org.rest.client.SyncAdapter::history = data.HISTORY_ENABLED;
			@org.rest.client.SyncAdapter::magicVars = data.MAGICVARS_ENABLED;
			@org.rest.client.SyncAdapter::codeMirrorHeaders = data.CMH_ENABLED;
			@org.rest.client.SyncAdapter::codeMirrorPayload = data.CMP_ENABLED;
			fn.@org.rest.client.SyncAdapter.SyncResult::onSync()();
		});
	}-*/;
	
	
	/**
	 * Observe changes to the storage.
	 */
	public static final native void observe() /*-{
		if(@org.rest.client.SyncAdapter::observing === true){
			return;
		}
		@org.rest.client.SyncAdapter::observing = true;
		var clb = $entry(function(changes, area){
			var keys = Object.keys(changes);
            var accepted = ['DEBUG_ENABLED', 'HISTORY_ENABLED', 'MAGICVARS_ENABLED', 'CMH_ENABLED', 'CMP_ENABLED'];
            keys.forEach(function(key) {
                if (accepted.indexOf(key) !== -1) {
                    switch(key){
                    	case 'DEBUG_ENABLED': @org.rest.client.SyncAdapter::debug = changes[key].newValue; break;
                    	case 'HISTORY_ENABLED': @org.rest.client.SyncAdapter::history = changes[key].newValue; break;
                    	case 'MAGICVARS_ENABLED': @org.rest.client.SyncAdapter::magicVars = changes[key].newValue; break;
                    	case 'CMH_ENABLED': @org.rest.client.SyncAdapter::codeMirrorHeaders = changes[key].newValue; break;
                    	case 'CMP_ENABLED': @org.rest.client.SyncAdapter::codeMirrorPayload = changes[key].newValue; break;
                    	default: return;
                    }
                }
            });
		});
		$wnd.arc.app.settings.observe(clb);
	}-*/;
}
