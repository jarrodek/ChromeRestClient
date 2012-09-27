package org.rest.client;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.rest.client.event.RequestStartActionEvent;
import org.rest.client.event.SaveRequestEvent;
import org.rest.client.event.ShortcutChangeEvent;
import org.rest.client.place.HistoryPlace;
import org.rest.client.place.SavedPlace;
import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.store.LocalStore;
import org.rest.client.ui.desktop.StatusNotification;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.Callback;
import com.google.gwt.dom.client.NativeEvent;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONValue;
import com.google.gwt.user.client.Event;
import com.google.gwt.user.client.Event.NativePreviewEvent;
import com.google.web.bindery.event.shared.EventBus;


public class ShortcutHandlers {
	
	private static List<Shortcut> shortcuts = new ArrayList<Shortcut>();
	private static boolean hasCtrl = false;
	private static boolean hasShift = false;
	private static boolean hasAlt = false;
	private static List<Integer> codes = new ArrayList<Integer>();
	
	private static boolean initialized = false;
	private static LocalStore store;
	static {
		store = RestClient.getClientFactory().getLocalStore();
		store.open(new StoreResultCallback<Boolean>() {
			
			@Override
			public void onSuccess(Boolean result) {
				
			}
			
			@Override
			public void onError(Throwable e) {
				
			}
		});
	}
	
	private static EventBus eventBus;
	
	public static void initialize(final EventBus eventBus) {
		ShortcutHandlers.eventBus = eventBus;
		assert initialized == false : "Shortcuts already has been set.";
		initialized = true;
		if(RestClient.isDebug()){
			Log.debug("Initialize shortcuts handlers.");
		}
		getShortcuts(new Callback<List<Shortcut>, Throwable>() {
			
			@Override
			public void onSuccess(List<Shortcut> result) {
				if(RestClient.isDebug()){
					Log.debug("Has shortcuts list. Set handlers.");
				}
				setListenersVariables();
				setupKeyboardShortcuts();
			}
			
			@Override
			public void onFailure(Throwable reason) {
				StatusNotification.notify("Unable to lunch shortcuts :(", StatusNotification.TYPE_ERROR, StatusNotification.TIME_MEDIUM);
			}
		});
		
		ShortcutChangeEvent.register(eventBus,
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
		if(RestClient.isDebug()){
			Log.debug("Storing Shortcuts state.");
		}
		JSONArray array = new JSONArray();
		for (Shortcut item : ShortcutHandlers.shortcuts) {
			JSONObject obj = item.toJSON();
			array.set(array.size(), obj);
			if (RestClient.isDebug()) {
				Log.debug("Prepared Shortcut object to store: " + obj.toString());
			}
		}
		store.put(array.toString(), LocalStore.SHORTCUTS_VALUES, new StoreResultCallback<String>() {
			@Override
			public void onSuccess(String result) {
			}
			@Override
			public void onError(Throwable e) {
			}
		});
	}
	/**
	 * Restore shortcuts objects from local storage.
	 * 
	 * @return NULL if there is no saved state or list if there is saved state
	 *         (even if there is no defined shortcuts)
	 */
	private static void restoreShortcuts(final Callback<List<Shortcut>, Throwable> callback) {
		store.getByKey(LocalStore.SHORTCUTS_VALUES, new StoreResultCallback<String>() {
			@Override
			public void onSuccess(String data) {
				List<Shortcut> result = new ArrayList<Shortcut>();
				
				if (data == null) {
					callback.onSuccess(result);
					return;
				}
				
				JSONValue value = JSONParser.parseStrict(data);
				if (value == null) {
					callback.onSuccess(result);
					return;
				}
				JSONArray array = value.isArray();
				if (array == null) {
					callback.onSuccess(result);
					return;
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
				callback.onSuccess(result);
			}
			@Override
			public void onError(Throwable e) {
				callback.onFailure(e);
			}
		});
	}
	/**
	 * Get list of available shortcuts.
	 * @return
	 */
	public static void getShortcuts(final Callback<List<Shortcut>, Throwable> callback) {
		if (ShortcutHandlers.shortcuts == null
				|| ShortcutHandlers.shortcuts.size() == 0) {
			restoreShortcuts(new Callback<List<Shortcut>, Throwable>() {
				@Override
				public void onSuccess(List<Shortcut> result) {
					ShortcutHandlers.shortcuts = result;
					if (result == null || result.size() == 0) {
						//
						// Never stored (or manually removed), create default shortcuts
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
				if(event == null || event.getType() == null) return;
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
		
		if(type.equals(ShortcutType.OPEN_REQUEST)){
			RestClient.getClientFactory().getPlaceController().goTo(new SavedPlace("default"));
		} else if(type.equals(ShortcutType.SAVE_REQUEST)){
			eventBus.fireEvent(new SaveRequestEvent());
		} else if(type.equals(ShortcutType.SEND_REQUEST)){
			eventBus.fireEvent(new RequestStartActionEvent(new Date()));
		} else if(type.equals(ShortcutType.HISTORY_TAB)){
			RestClient.getClientFactory().getPlaceController().goTo(new HistoryPlace("default"));
		}
	}
}
