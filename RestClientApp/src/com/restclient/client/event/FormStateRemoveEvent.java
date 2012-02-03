package com.restclient.client.event;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.HandlerRegistration;

/**
 * Called when saved form has been removed.
 * 
 */
public class FormStateRemoveEvent extends GwtEvent<FormStateRemoveEvent.Handler> {
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
	 * Handles {@link FormStateRemoveEvent}.
	 */
	public interface Handler extends EventHandler {
		void onRemove(int removedId);
	}
	/**
	 * Removed database ID 
	 */
	private final int id;

	public FormStateRemoveEvent(int id) {
		this.id = id;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onRemove(id);
	}

	@Override
	public com.google.gwt.event.shared.GwtEvent.Type<Handler> getAssociatedType() {
		return TYPE;
	}
}
