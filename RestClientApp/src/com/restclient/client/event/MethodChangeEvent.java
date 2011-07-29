package com.restclient.client.event;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.HandlerRegistration;

/**
 * End editing a file input.
 * 
 */
public class MethodChangeEvent extends GwtEvent<MethodChangeEvent.Handler> {
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
	 * Handles {@link MethodChangeEvent}.
	 */
	public interface Handler extends EventHandler {
		void onChange(String oldMethod, String method);
	}

	private final String oldMethod;
	private final String newMethod;

	public MethodChangeEvent(String oldMethod, String method) {
		this.oldMethod = oldMethod;
		this.newMethod = method;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onChange(oldMethod, newMethod);
	}

	@Override
	public com.google.gwt.event.shared.GwtEvent.Type<Handler> getAssociatedType() {
		return TYPE;
	}
}
