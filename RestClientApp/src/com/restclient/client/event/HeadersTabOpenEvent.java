package com.restclient.client.event;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.HandlerRegistration;

/**
 * Event fired on Request Headers UI tab opened.
 * 
 */
public class HeadersTabOpenEvent extends GwtEvent<HeadersTabOpenEvent.Handler> {
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
	 * Handles {@link HeadersTabOpenEvent}.
	 */
	public interface Handler extends EventHandler {
		void onOpen(int tabPosition, Object source);
	}

	private final int tabPosition;

	public HeadersTabOpenEvent(int tabPosition) {
		this.tabPosition = tabPosition;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onOpen(tabPosition, this.getSource());
	}

	@Override
	public com.google.gwt.event.shared.GwtEvent.Type<Handler> getAssociatedType() {
		return TYPE;
	}
}
