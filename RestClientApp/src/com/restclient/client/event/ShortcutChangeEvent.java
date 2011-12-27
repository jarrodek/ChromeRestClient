package com.restclient.client.event;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.HandlerRegistration;
import com.restclient.client.Shortcut;

/**
 * Change in body input form
 * 
 */
public class ShortcutChangeEvent extends GwtEvent<ShortcutChangeEvent.Handler> {
	public static final Type<Handler> TYPE = new Type<Handler>();
	
	/**
	 * Register an handler for this event.
	 * @param eventBus
	 * @param handler
	 * @return
	 */
	public static HandlerRegistration register(EventBus eventBus,
			Handler handler) {
		return eventBus.addHandler(TYPE, handler);
	}

	/**
	 * Handles {@link ShortcutChangeEvent}.
	 */
	public interface Handler extends EventHandler {
		void onChange(ShortcutChangeEvent event);
	}

	private final Shortcut shortcut;

	public ShortcutChangeEvent(Shortcut shortcut) {
		this.shortcut = shortcut;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onChange(this);
	}
	
	public Shortcut getShortcut(){
		return shortcut;
	}
	
	@Override
	public com.google.gwt.event.shared.GwtEvent.Type<Handler> getAssociatedType() {
		return TYPE;
	}
}
