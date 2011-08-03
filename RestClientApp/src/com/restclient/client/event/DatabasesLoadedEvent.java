package com.restclient.client.event;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.HandlerRegistration;

/**
 * Event fired when all local DB has been loaded.
 * 
 */
public class DatabasesLoadedEvent extends GwtEvent<DatabasesLoadedEvent.Handler> {
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
	 * Handles {@link DatabasesLoadedEvent}.
	 */
	public interface Handler extends EventHandler {
		void onChange(DatabasesLoadedEvent event);
	}

	private final boolean success;

	public DatabasesLoadedEvent(boolean success) {
		this.success = success;
	}
	
	public boolean isSuccess(){
		return this.success;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onChange(this);
	}

	@Override
	public com.google.gwt.event.shared.GwtEvent.Type<Handler> getAssociatedType() {
		return TYPE;
	}
}
