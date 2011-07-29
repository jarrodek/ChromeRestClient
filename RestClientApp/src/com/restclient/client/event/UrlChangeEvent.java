package com.restclient.client.event;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.HandlerRegistration;

/**
 * End editing a file input.
 * 
 */
public class UrlChangeEvent extends GwtEvent<UrlChangeEvent.Handler> {
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
	 * Handles {@link UrlChangeEvent}.
	 */
	public interface Handler extends EventHandler {
		void onChange(String url, Object source);
	}

	private final String url;

	public UrlChangeEvent(String url) {
		if( url == null ) url = "";
		this.url = url;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onChange(url, this.getSource());
	}

	@Override
	public com.google.gwt.event.shared.GwtEvent.Type<Handler> getAssociatedType() {
		return TYPE;
	}
}
