package com.restclient.client.event;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.HandlerRegistration;

/**
 * User select items to import from import dialog.
 * 
 */
public class ImportItemsSelectedEvent extends GwtEvent<ImportItemsSelectedEvent.Handler> {
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
	 * Handles {@link ImportItemsSelectedEvent}.
	 */
	public interface Handler extends EventHandler {
		void onChange(String[] keys);
	}

	private final String[] keys;

	public ImportItemsSelectedEvent(String[] keys) {
		this.keys = keys;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onChange(keys);
	}

	@Override
	public com.google.gwt.event.shared.GwtEvent.Type<Handler> getAssociatedType() {
		return TYPE;
	}
}
