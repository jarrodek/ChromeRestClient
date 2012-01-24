package com.restclient.client.event;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.HandlerRegistration;

/**
 * Store data on application server Action to run
 */
public class StoreDataAction extends GwtEvent<StoreDataAction.Handler> {
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
	 * Handles {@link StoreDataAction}.
	 */
	public interface Handler extends ActionHandler {}
	public StoreDataAction() {}

	@Override
	protected void dispatch(Handler handler) {
		handler.onAction();
	}

	@Override
	public Type<Handler> getAssociatedType() {
		return TYPE;
	}
}
