package org.rest.client.event;

import com.google.web.bindery.event.shared.Event;
import com.google.web.bindery.event.shared.EventBus;
import com.google.web.bindery.event.shared.HandlerRegistration;

/**
 * Store data on application server Action to run
 */
public class StoreDataAction extends Event<StoreDataAction.Handler> {
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
