package org.rest.client.event;

import org.rest.client.Shortcut;

import com.google.web.bindery.event.shared.Event;
import com.google.web.bindery.event.shared.EventBus;
import com.google.web.bindery.event.shared.HandlerRegistration;

/**
 * Change in body input form
 * 
 */
public class ShortcutChangeEvent extends Event<ShortcutChangeEvent.Handler> {
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
	public interface Handler {
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
	public Event.Type<Handler> getAssociatedType() {
		return TYPE;
	}
}
