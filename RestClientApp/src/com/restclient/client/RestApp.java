package com.restclient.client;

import java.util.Date;
import java.util.List;

import com.allen_sauer.gwt.log.client.Log;
import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.ListCallback;
import com.google.code.gwt.database.client.service.RowIdListCallback;
import com.google.code.gwt.database.client.service.VoidCallback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.NativeEvent;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.storage.client.Storage;
import com.google.gwt.storage.client.StorageEvent;
import com.google.gwt.user.client.Event;
import com.google.gwt.user.client.Event.NativePreviewEvent;
import com.restclient.client.event.OpenRequestEvent;
import com.restclient.client.event.SaveRequestEvent;
import com.restclient.client.storage.HeadersService;
import com.restclient.client.storage.RestFormService;
import com.restclient.client.storage.StatusCodesService;
import com.restclient.client.storage.UrlRow;
import com.restclient.client.storage.UrlsService;

/**
 * @author jarrod
 *
 */
public class RestApp {
	
	@SuppressWarnings("javadoc")
	public static final HeadersService HEADERS_SERVICE = GWT
			.create(HeadersService.class);
	@SuppressWarnings("javadoc")
	public static final StatusCodesService STATUSES_SERVICE = GWT
			.create(StatusCodesService.class);
	@SuppressWarnings("javadoc")
	public static final UrlsService URLS_SERVICE = GWT
			.create(UrlsService.class);
	@SuppressWarnings("javadoc")
	public static final RestFormService FORM_SERVICE = GWT
			.create(RestFormService.class);

	/**
	 * Class - holder for local storage keys
	 * 
	 */
	public static class StorageKeys{
		private StorageKeys(){}
		
		/**
		 * Key for debug enabled.
		 */
		public static final String DEBUG_KEY = "DEBUG_ENABLED";
		/**
		 * Key for history list enabled value
		 */
		public static final String HISTORY_KEY = "HISTORY_ENABLED";
		/**
		 * Key for amount of history list
		 */
		public static final String HISTORY_AMOUNT = "HISTORY_AMOUNT";
		/**
		 * Key for cookies capture
		 */
		public static final String COOKIES_CAPTURE = "COOKIES_CAPTURE";
		
		public static final String SHORTCUTS_VALUES = "SHORTCUTS";
	}
	
	
	/**
	 * Add an URL value to list of past URLs for suggestions oracle.
	 * <p>
	 * First checking if provided URL already exists. If exists it's updates use
	 * time. In oracle rows are ordered by last use time. If not exists it's
	 * insert new URL value.
	 * </p>
	 * @param requestUrl 
	 * 
	 */
	public static void addOracleURL(final String requestUrl) {
		if(requestUrl==null||requestUrl.isEmpty()) return;
		
		URLS_SERVICE.getUrls(requestUrl, new ListCallback<UrlRow>() {
			@Override
			public void onFailure(DataServiceException error) {
			}

			@Override
			public void onSuccess(List<UrlRow> result) {
				if (result == null) {
					// error?
					if( RestApp.isDebug() ){
						Log.error("Some undefined error during storage request. RestApp.addOracleURL(String)");
					}
					return;
				}
				if (result.size() == 0) { // no such URL yet
					URLS_SERVICE.insertLink(requestUrl, new Date(),
							new RowIdListCallback() {
								@Override
								public void onFailure(DataServiceException error) {
								}

								@Override
								public void onSuccess(List<Integer> rowIds) {
								}
							});
				} else {
					UrlRow row = result.get(0);
					URLS_SERVICE.updateTime(row.getId(), new Date(),
							new VoidCallback() {
								@Override
								public void onFailure(DataServiceException error) {
								}

								@Override
								public void onSuccess() {
								}
							});
				}
			}
		});
	}
	
	/**
	 * Add keyboard shortcuts handlers.
	 * @deprecated
	 * @param eventBus
	 */
	public static void setupKeyboardShortcuts(final EventBus eventBus) {
		Event.addNativePreviewHandler(new Event.NativePreviewHandler() {
			@Override
			public void onPreviewNativeEvent(NativePreviewEvent preview) {
				final NativeEvent event = preview.getNativeEvent();
				//final  Element elt = event.getEventTarget().cast();
				final int keycode = event.getKeyCode();
				final boolean ctrl = event.getCtrlKey();
				final boolean shift = event.getShiftKey();
				final boolean alt = event.getAltKey();
				final boolean meta = event.getMetaKey();

				if (!event.getType().equalsIgnoreCase("keydown") || !ctrl
						|| shift || alt || meta || !isHandlersKeycode(keycode)) {
					// Tell the event handler to continue processing this event.
					return;
				}
				handleKeycode(keycode,eventBus);
				preview.cancel();
			}
		});
	}
	/**
	 * @deprecated
	 * @param keyCode
	 * @return
	 */
	private static boolean isHandlersKeycode(final int keyCode) {
		switch (keyCode) {
		case 83:// s
		case 79:// o
			return true;
		}
		return false;
	}
	/**
	 * @deprecated
	 * @param keyCode
	 * @param eventBus
	 */
	private static void handleKeycode(final int keyCode, final EventBus eventBus) {
		switch (keyCode) {
		case 83:// save action
			eventBus.fireEventFromSource(new SaveRequestEvent(), RestApp.class);
			break;
		case 79:// open action
			eventBus.fireEventFromSource(new OpenRequestEvent(), RestApp.class);
			break;
		default:
			return;
		}
	}
	/**
	 * Check if requests history is enabled.
	 * @return true if is enabled (default).
	 */
	public static final boolean isHistoryEabled(){
		boolean result = true;
		Storage storage = Storage.getLocalStorageIfSupported();
		if(storage != null){
			String historyValue = storage.getItem( RestApp.StorageKeys.HISTORY_KEY );
			if( historyValue == null || historyValue.isEmpty() ){
				historyValue = "true";
			}
			result = historyValue.equals("true");
		}
		return result;
	}
	
	private static Boolean isDebug = null;
	
	/**
	 * Check if debug is enabled.
	 * @return true if is enabled (default is false).
	 */
	public static final boolean isDebug(){
		if( isDebug == null ){
			setIsDebugState();
		}
		return isDebug.booleanValue();
	}
	
	private static void setIsDebugState(){
		boolean result = false;
		Storage storage = Storage.getLocalStorageIfSupported();
		if(storage != null){
			String debugValue = storage.getItem( RestApp.StorageKeys.DEBUG_KEY );
			if( debugValue == null || debugValue.isEmpty() ){
				debugValue = "true";
			}
			result = debugValue.equals("true");
			Storage.addStorageEventHandler( new StorageEvent.Handler() {
				@Override
				public void onStorageChange(StorageEvent event) {
					String key = event.getKey();
					if( RestApp.StorageKeys.DEBUG_KEY.equals( key ) ){
						isDebug = event.getNewValue().equals( "true" );
					}
				}
			});
		}
		isDebug = result;
	}
}
