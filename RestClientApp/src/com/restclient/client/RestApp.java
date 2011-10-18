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
	
	public static final HeadersService HEADERS_SERVICE = GWT
			.create(HeadersService.class);
	public static final StatusCodesService STATUSES_SERVICE = GWT
			.create(StatusCodesService.class);
	public static final UrlsService URLS_SERVICE = GWT
			.create(UrlsService.class);
	public static final RestFormService FORM_SERVICE = GWT
			.create(RestFormService.class);

	/**
	 * Add an URL value to list of past URLs for suggestions oracle.
	 * <p>
	 * First checking if provided URL already exists. If exists it's updates use
	 * time. In oracle rows are ordered by last use time. If not exists it's
	 * insert new URL value.
	 * </p>
	 * 
	 * @param url
	 */
	public static void addOracleURL(final String requestUrl) {
		URLS_SERVICE.getUrls(requestUrl, new ListCallback<UrlRow>() {
			@Override
			public void onFailure(DataServiceException error) {
			}

			@Override
			public void onSuccess(List<UrlRow> result) {
				if (result == null) {
					// error?
					Log.error("Some undefined error during storage request. RestApp.addOracleURL(String)");
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

	private static boolean isHandlersKeycode(final int keyCode) {
		switch (keyCode) {
		case 83:// s
		case 79:// o
			return true;
		}
		return false;
	}

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
}
