package com.restclient.client.event;

import java.util.List;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.HandlerRegistration;
import com.google.gwt.xhr2.client.RequestHeader;

/**
 * Change in headers input form
 * 
 */
public class HeadersChangeEvent extends GwtEvent<HeadersChangeEvent.Handler> {
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
	 * Handles {@link HeadersChangeEvent}.
	 */
	public interface Handler extends EventHandler {
		void onChange(List<RequestHeader> headers, Object source);
	}

	private final List<RequestHeader> headers;

	public HeadersChangeEvent(List<RequestHeader> headers) {
		this.headers = headers;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onChange(headers, this.getSource());
	}

	@Override
	public com.google.gwt.event.shared.GwtEvent.Type<Handler> getAssociatedType() {
		return TYPE;
	}
}
