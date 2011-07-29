package com.restclient.client.event;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.HandlerRegistration;

/**
 * End editing a file input.
 * 
 */
public class EncodingChangeEvent extends GwtEvent<EncodingChangeEvent.Handler> {
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
	 * Handles {@link EncodingChangeEvent}.
	 */
	public interface Handler extends EventHandler {
		void onChange(String enc, Object source);
	}

	private final String encoding;

	public EncodingChangeEvent(String enc) {
		this.encoding = enc;
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
