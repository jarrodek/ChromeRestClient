package org.rest.client;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.rest.client.event.RequestStartActionEvent;
import org.rest.client.event.SaveRequestEvent;
import org.rest.client.event.ShortcutChangeEvent;
import org.rest.client.place.HistoryPlace;
import org.rest.client.place.SavedPlace;
import org.rest.client.shortcuts.ShortcutItem;
import org.rest.client.storage.store.StoreKeys;
import org.rest.client.ui.desktop.StatusNotification;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.chrome.storage.LocalStorageArea;
import com.google.gwt.chrome.storage.Storage;
import com.google.gwt.chrome.storage.StorageArea.StorageItemCallback;
import com.google.gwt.chrome.storage.StorageArea.StorageSimpleCallback;
import com.google.gwt.chrome.storage.StorageResult;
import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JsArray;
import com.google.gwt.dom.client.NativeEvent;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.user.client.Event;
import com.google.gwt.user.client.Event.NativePreviewEvent;
import com.google.web.bindery.event.shared.EventBus;

public class ShortcutHandlers {

	private static JsArray<ShortcutItem> shortcuts = GWT.create(JsArray.class);

	private static boolean hasCtrl = false;
	private static boolean hasShift = false;
	private static boolean hasAlt = false;
	private static List<Integer> codes = new ArrayList<Integer>();

	private static boolean initialized = false;
	private static LocalStorageArea store;

	static {
		Storage _store = GWT.create(Storage.class);
		store = _store.getLocal();
	}

	private static EventBus eventBus;

	public static void initialize(final EventBus eventBus) {
		ShortcutHandlers.eventBus = eventBus;
		assert initialized == false : "Shortcuts already has been set.";
		initialized = true;
		if (RestClient.isDebug()) {
			Log.debug("Initialize shortcuts handlers.");
		}
		getShortcuts(new Callback<JsArray<ShortcutItem>, Throwable>() {

			@Override
			public void onSuccess(JsArray<ShortcutItem> result) {
				if (RestClient.isDebug()) {
					Log.debug("Has shortcuts list. Set handlers.");
				}
				setListenersVariables();
				setupKeyboardShortcuts();
			}

			@Override
			public void onFailure(Throwable reason) {
				StatusNotification.notify("Unable to lunch shortcuts :(", StatusNotification.TYPE_ERROR,
						StatusNotification.TIME_MEDIUM);
			}
		});

		ShortcutChangeEvent.register(eventBus, new ShortcutChangeEvent.Handler() {
			@Override
			public void onChange(ShortcutChangeEvent event) {
				ShortcutItem sh = event.getShortcut();
				for (int i = 0; i < ShortcutHandlers.shortcuts.length(); i++) {
					ShortcutItem item = ShortcutHandlers.shortcuts.get(i);
					if (item.equals(sh)) {
						JsArray<ShortcutItem> newArr = GWT.create(JsArray.class);
						for (int j = 0; j < ShortcutHandlers.shortcuts.length(); j++) {
							if (ShortcutHandlers.shortcuts.get(j).equals(item)) {
								continue;
							}
							newArr.push(item);
						}
						ShortcutHandlers.shortcuts = newArr;
						break;
					}
				}

				Integer cc = sh.getKeyCode();
				if (cc == null) {
					ShortcutHandlers.shortcuts.push(sh);
				}
				store();
				setListenersVariables();
			}
		});
	}

	private static void setListenersVariables() {
		hasCtrl = false;
		hasShift = false;
		hasAlt = false;
		codes = new ArrayList<Integer>();
		for (int i = 0; i < ShortcutHandlers.shortcuts.length(); i++) {
			ShortcutItem item = ShortcutHandlers.shortcuts.get(i);
			if (item.isAlt()) {
				hasAlt = true;
			}
			if (item.isControl()) {
				hasCtrl = true;
			}
			if (item.isShift()) {
				hasShift = true;
			}
			codes.add(item.getKeyCode());
		}
	}

	public static void store() {
		if (RestClient.isDebug()) {
			Log.debug("Storing Shortcuts state.");
		}
		
		JSONObject jso = new JSONObject();
		jso.put(StoreKeys.SHORTCUTS_VALUES, new JSONObject(ShortcutHandlers.shortcuts));

		store.set(jso.getJavaScriptObject(), new StorageSimpleCallback() {

			@Override
			public void onError(String message) {
				// TODO: add analytics exception handler
			}

			@Override
			public void onDone() {
			}
		});
	}

	/**
	 * Restore shortcuts objects from local storage.
	 * 
	 * @return NULL if there is no saved state or list if there is saved state
	 *         (even if there is no defined shortcuts)
	 */
	private static void restoreShortcuts(final Callback<JsArray<ShortcutItem>, Throwable> callback) {
		store.get(StoreKeys.SHORTCUTS_VALUES, new StorageItemCallback<JsArray<ShortcutItem>>() {

			@Override
			public void onError(String message) {
				callback.onFailure(new Throwable(message));
			}

			@Override
			public void onResult(StorageResult<JsArray<ShortcutItem>> data) {
				if (data == null) {
					callback.onFailure(new Throwable("Shortcuts not found in the store."));
					return;
				}
				JsArray<ShortcutItem> items = data.get(StoreKeys.SHORTCUTS_VALUES);
				if (items == null) {
					callback.onFailure(new Throwable("Shortcuts not found in the store. Cast object is null."));
					return;
				}
				callback.onSuccess(items);
			}
		});
	}

	/**
	 * Get list of available shortcuts.
	 * 
	 * @return
	 */
	public static void getShortcuts(final Callback<JsArray<ShortcutItem>, Throwable> callback) {
		if (ShortcutHandlers.shortcuts == null || ShortcutHandlers.shortcuts.length() == 0) {
			restoreShortcuts(new Callback<JsArray<ShortcutItem>, Throwable>() {
				@Override
				public void onSuccess(JsArray<ShortcutItem> result) {
					ShortcutHandlers.shortcuts = result;
					if (result == null || result.length() == 0) {
						//
						// Never stored (or manually removed), create default
						// shortcuts
						//
						ShortcutHandlers.shortcuts = getDefaultShortcuts();
						store();
					}
					callback.onSuccess(result);
				}

				@Override
				public void onFailure(Throwable reason) {
					callback.onFailure(reason);
				}
			});
		} else {
			callback.onSuccess(ShortcutHandlers.shortcuts);
		}

	}

	/**
	 * Create default shortcuts for application. It's create open and save
	 * request shortcuts.
	 * 
	 * @return
	 */
	private static JsArray<ShortcutItem> getDefaultShortcuts() {
		JsArray<ShortcutItem> result = GWT.create(JsArray.class);

		ShortcutItem openState = GWT.create(ShortcutItem.class);
		openState.setType(ShortcutType.OPEN_REQUEST.getType());
		openState.setControl(true);
		openState.setKeyCode(79); // O

		ShortcutItem saveState = GWT.create(ShortcutItem.class);
		saveState.setType(ShortcutType.SAVE_REQUEST.getType());
		saveState.setControl(true);
		saveState.setKeyCode(83); // S

		result.push(openState);
		result.push(saveState);

		return result;
	}

	private static void setupKeyboardShortcuts() {
		Event.addNativePreviewHandler(new Event.NativePreviewHandler() {

			@Override
			public void onPreviewNativeEvent(NativePreviewEvent preview) {
				final NativeEvent event = preview.getNativeEvent();
				if (event == null)
					return;
				String eventType = event.getType();
				if (eventType == null)
					return;
				if (!eventType.equalsIgnoreCase("keydown")) {
					return;
				}

				final int keycode = event.getKeyCode();
				final boolean ctrl = event.getCtrlKey();
				final boolean shift = event.getShiftKey();
				final boolean alt = event.getAltKey();

				if (alt && !hasAlt) {
					return;
				}
				if (ctrl && !hasCtrl) {
					return;
				}
				if (shift && !hasShift) {
					return;
				}
				if (!codes.contains(keycode)) {
					return;
				}

				if (handleKeycode(keycode, alt, ctrl, shift)) {
					preview.cancel();
				}
			}
		});
	}

	private static boolean handleKeycode(final int keyCode, final boolean alt, final boolean ctrl,
			final boolean shift) {
		ShortcutItem sc = null;
		for (int i = 0; i < ShortcutHandlers.shortcuts.length(); i++) {
			ShortcutItem item = ShortcutHandlers.shortcuts.get(i);
			if (item.getKeyCode() != keyCode)
				continue;
			if (item.isAlt() != alt)
				continue;
			if (item.isShift() != shift)
				continue;
			if (item.isControl() != ctrl)
				continue;
			sc = item;
			break;
		}
		if (sc == null)
			return false;
		handleShortcut(sc);
		return true;
	}

	private static void handleShortcut(final ShortcutItem sc) {
		String type = sc.getType();

		if (type.equals(ShortcutType.OPEN_REQUEST.toString())) {
			RestClient.getClientFactory().getPlaceController().goTo(new SavedPlace("default"));
		} else if (type.equals(ShortcutType.SAVE_REQUEST.toString())) {
			eventBus.fireEvent(new SaveRequestEvent());
		} else if (type.equals(ShortcutType.SEND_REQUEST.toString())) {
			eventBus.fireEvent(new RequestStartActionEvent(new Date()));
		} else if (type.equals(ShortcutType.HISTORY_TAB.toString())) {
			RestClient.getClientFactory().getPlaceController().goTo(new HistoryPlace("default"));
		}
	}
}
