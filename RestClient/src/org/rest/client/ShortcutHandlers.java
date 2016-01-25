package org.rest.client;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.rest.client.analytics.GoogleAnalytics;
import org.rest.client.analytics.GoogleAnalyticsApp;
import org.rest.client.event.RequestStartActionEvent;
import org.rest.client.event.SaveRequestEvent;
import org.rest.client.log.Log;
import org.rest.client.place.HistoryPlace;
import org.rest.client.place.SavedPlace;
import org.rest.client.shortcuts.ShortcutItem;

import com.google.gwt.dom.client.NativeEvent;
import com.google.gwt.user.client.Event;
import com.google.gwt.user.client.Event.NativePreviewEvent;
import com.google.web.bindery.event.shared.EventBus;

@SuppressWarnings("deprecation")
public class ShortcutHandlers {

	private static ArrayList<ShortcutItem> shortcuts = new ArrayList<ShortcutItem>();

	private static boolean hasCtrl = false;
	private static boolean hasShift = false;
	private static boolean hasAlt = false;
	private static List<Integer> codes = new ArrayList<Integer>();

	private static boolean initialized = false;

	private static EventBus eventBus;

	public static void initialize(final EventBus eventBus) {
		ShortcutHandlers.eventBus = eventBus;
		assert initialized == false : "Shortcuts already has been set.";
		initialized = true;
		if (RestClient.isDebug()) {
			Log.debug("Initialize shortcuts handlers.");
		}
		ShortcutHandlers.shortcuts = getDefaultShortcuts();
		setListenersVariables();
		setupKeyboardShortcuts();
	}

	private static void setListenersVariables() {
		hasCtrl = false;
		hasShift = false;
		hasAlt = false;
		codes = new ArrayList<Integer>();
		for (int i = 0; i < ShortcutHandlers.shortcuts.size(); i++) {
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

	/**
	 * Create default shortcuts for application. It's create open and save
	 * request shortcuts.
	 * 
	 * @return
	 */
	private static ArrayList<ShortcutItem> getDefaultShortcuts() {
		ArrayList<ShortcutItem> result = new ArrayList<ShortcutItem>();

		ShortcutItem openState = new ShortcutItem();
		openState.setType(ShortcutType.OPEN_REQUEST.getType());
		openState.setControl(true);
		openState.setKeyCode(79); // O

		ShortcutItem saveState = new ShortcutItem();
		saveState.setType(ShortcutType.SAVE_REQUEST.getType());
		saveState.setControl(true);
		saveState.setKeyCode(83); // S

		result.add(openState);
		result.add(saveState);

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
		for (int i = 0; i < ShortcutHandlers.shortcuts.size(); i++) {
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
		GoogleAnalytics.sendEvent("Shortcats usage", "Shortcat used", type);
		GoogleAnalyticsApp.sendEvent("Shortcats usage", "Shortcat used", type);
	}
}
