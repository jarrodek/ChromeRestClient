package com.restclient.client.event;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.HandlerRegistration;

/**
 * Change in body input form
 * 
 */
public class BodyChangeEvent extends GwtEvent<BodyChangeEvent.Handler> {
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
	 * Handles {@link BodyChangeEvent}.
	 */
	public interface Handler extends EventHandler {
		void onChange(String body, Object source);
	}

	private final String body;

	public BodyChangeEvent(String body) {
		if( body == null) body = "";
		this.body = body;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onChange(body, this.getSource());
	}

	@Override
	public com.google.gwt.event.shared.GwtEvent.Type<Handler> getAssociatedType() {
		return TYPE;
	}
}
