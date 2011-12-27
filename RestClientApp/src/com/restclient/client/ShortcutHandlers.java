package com.restclient.client;

import java.util.ArrayList;
import java.util.List;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.dom.client.NativeEvent;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONValue;
import com.google.gwt.storage.client.Storage;
import com.google.gwt.user.client.Event;
import com.google.gwt.user.client.History;
import com.google.gwt.user.client.Event.NativePreviewEvent;
import com.restclient.client.event.OpenRequestEvent;
import com.restclient.client.event.RequestStartEvent;
import com.restclient.client.event.SaveRequestEvent;
import com.restclient.client.event.ShortcutChangeEvent;

public abstract class ShortcutHandlers {

	private static final Storage store = Storage.getLocalStorageIfSupported();
	private static List<Shortcut> shortcuts = new ArrayList<Shortcut>();
	
	private static boolean hasCtrl = false;
	private static boolean hasShift = false;
	private static boolean hasAlt = false;
	private static List<Integer> codes = new ArrayList<Integer>();
	
	private static boolean initialized = false;
	
	public static void initialize() {
		assert initialized == false : "Shortcuts already has been set.";
		initialized = true;
		getShortcuts();
		setListenersVariables();
		setupKeyboardShortcuts();
		ShortcutChangeEvent.register(RestClientApp.getAppMainEventBus(),
				new ShortcutChangeEvent.Handler() {
					@Override
					public void onChange(ShortcutChangeEvent event) {
						Shortcut sh = event.getShortcut();
						int cc = sh.getCharCode(); // -1 mean remove shortcut.
						for (Shortcut item : ShortcutHandlers.shortcuts) {
							if (item.equals(sh)) {
								ShortcutHandlers.shortcuts.remove(item);
								break;
							}
						}
						if (cc > -1) {
							ShortcutHandlers.shortcuts.add(sh);
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
		
		for (Shortcut item : ShortcutHandlers.shortcuts) {
			if(item.isAlt()){
				hasAlt = true;
			}
			if(item.isCtrl()){
				hasCtrl = true;
			}
			if(item.isShift()){
				hasShift = true;
			}
			codes.add(item.getCharCode());
		}
	}

	public static void store() {
		if (store == null) {
			return;
		}
		if (RestApp.isDebug()) {
			Log.debug("Storing Shortcuts state.");
		}
		JSONArray array = new JSONArray();
		for (Shortcut item : ShortcutHandlers.shortcuts) {
			JSONObject obj = item.toJSON();
			array.set(array.size(), obj);
			if (RestApp.isDebug()) {
				Log.debug("Prepared Shortcut object to store: " + obj.toString());
			}
		}
		store.setItem(RestApp.StorageKeys.SHORTCUTS_VALUES, array.toString());
		
	}

	/**
	 * Restore shortcuts objects from local storage.
	 * 
	 * @return NULL if there is no saved state or list if there is saved state
	 *         (even if there is no defined shortcuts)
	 */
	private static List<Shortcut> restoreShortcuts() {
		if (store == null) {
			return null;
		}
		String data = store.getItem(RestApp.StorageKeys.SHORTCUTS_VALUES);
		if (data == null) {
			return null;
		}
		List<Shortcut> result = new ArrayList<Shortcut>();
		JSONValue value = JSONParser.parseLenient(data);
		if (value == null) {
			return result;
		}
		JSONArray array = value.isArray();
		if (array == null) {
			return result;
		}
		int size = array.size();
		for (int i = 0; i < size; i++) {
			JSONValue shortcutArrayValue = array.get(i);
			JSONObject shortcutObject = shortcutArrayValue.isObject();
			if (shortcutObject == null) {
				continue;
			}
			Shortcut sh = Shortcut.fromJSON(shortcutObject);
			if (sh == null) {
				continue;
			}
			result.add(sh);
		}
		return result;
	}

	public static List<Shortcut> getShortcuts() {
		if (ShortcutHandlers.shortcuts == null
				|| ShortcutHandlers.shortcuts.size() == 0) {
			ShortcutHandlers.shortcuts = restoreShortcuts();
			if (ShortcutHandlers.shortcuts == null) {
				//
				// Never stored (or manually removed), create default shortcuts
				//
				ShortcutHandlers.shortcuts = getDefaultShortcuts();
				store();
			}
		}
		return ShortcutHandlers.shortcuts;
	}

	/**
	 * Create default shortcuts for application. It's create open and save
	 * request shortcuts.
	 * 
	 * @return
	 */
	private static List<Shortcut> getDefaultShortcuts() {

		Shortcut openState = new Shortcut();
		openState.setType(ShortcutType.OPEN_REQUEST);
		openState.setCtrl(true);
		openState.setCharCode(79); // O

		Shortcut saveState = new Shortcut();
		saveState.setType(ShortcutType.SAVE_REQUEST);
		saveState.setCtrl(true);
		saveState.setCharCode(83); // S

		List<Shortcut> result = new ArrayList<Shortcut>();
		result.add(openState);
		result.add(saveState);

		return result;
	}
	
	private static void setupKeyboardShortcuts(){
		
		Event.addNativePreviewHandler(new Event.NativePreviewHandler() {

			@Override
			public void onPreviewNativeEvent(NativePreviewEvent preview) {
				final NativeEvent event = preview.getNativeEvent();
				
				if (!event.getType().equalsIgnoreCase("keydown")){
					return;
				}
				
				final int keycode = event.getKeyCode();
				final boolean ctrl = event.getCtrlKey();
				final boolean shift = event.getShiftKey();
				final boolean alt = event.getAltKey();
				
				if(alt && !hasAlt){
					return;
				}
				if(ctrl && !hasCtrl){
					return;
				}
				if(shift && !hasShift){
					return;
				}
				if(!codes.contains(keycode)){
					return;
				}
				
				if(handleKeycode(keycode, alt, ctrl, shift)){
					preview.cancel();
				}
			}
		});
	}
	private static boolean handleKeycode(final int keyCode, final boolean alt, final boolean ctrl, final boolean shift){
		Shortcut sc = null;
		for (Shortcut item : ShortcutHandlers.shortcuts) {
			if(item.getCharCode() != keyCode) continue;
			if(item.isAlt() != alt) continue;
			if(item.isShift() != shift) continue;
			if(item.isCtrl() != ctrl) continue;
			sc = item;
			break;
		}
		if(sc == null) return false;
		handleShortcut(sc);
		return true;
	}
	private static void handleShortcut(final Shortcut sc){
		ShortcutType type = sc.getType();
		EventBus eventBus = RestClientApp.getAppMainEventBus();
		if(type.equals(ShortcutType.OPEN_REQUEST)){
			eventBus.fireEvent(new OpenRequestEvent());
		} else if(type.equals(ShortcutType.SAVE_REQUEST)){
			eventBus.fireEvent(new SaveRequestEvent());
		} else if(type.equals(ShortcutType.SEND_REQUEST)){
			History.newItem("request");
			eventBus.fireEvent(new RequestStartEvent());
		} else if(type.equals(ShortcutType.HISTORY_TAB)){
			History.newItem("history");
		}
	}
}
