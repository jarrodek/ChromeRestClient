package com.restclient.client.event;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.HandlerRegistration;

/**
 * End editing a header value via helper.
 * 
 */
public class HeaderSupportSubmitEvent extends GwtEvent<HeaderSupportSubmitEvent.Handler> {
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
	 * Handles {@link HeaderSupportSubmitEvent}.
	 */
	public interface Handler extends EventHandler {
		void onSubmit(String value, Object source);
	}

	private final String value;

	public HeaderSupportSubmitEvent(String value) {
		this.value = value;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onSubmit(value, getSource());
	}

	@Override
	public com.google.gwt.event.shared.GwtEvent.Type<Handler> getAssociatedType() {
		return TYPE;
	}
}
