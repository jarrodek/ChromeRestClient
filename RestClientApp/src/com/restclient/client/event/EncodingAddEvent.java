package com.restclient.client.event;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.HandlerRegistration;

/**
 * End adding form encoding
 * 
 */
public class EncodingAddEvent extends GwtEvent<EncodingAddEvent.Handler> {
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
	 * Handles {@link EncodingAddEvent}.
	 */
	public interface Handler extends EventHandler {
		void onChange(String encoding, Object source);
	}

	private final String encoding;

	public EncodingAddEvent(String encoding) {
		this.encoding = encoding;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onChange(encoding, this.getSource());
	}

	@Override
	public com.google.gwt.event.shared.GwtEvent.Type<Handler> getAssociatedType() {
		return TYPE;
	}
}
