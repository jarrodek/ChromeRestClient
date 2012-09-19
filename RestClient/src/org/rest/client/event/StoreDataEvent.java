package org.rest.client.event;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.HandlerRegistration;

/**
 * Event called when data has been stored to application server.
 * 
 */
public class StoreDataEvent extends GwtEvent<StoreDataEvent.Handler> {
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
	 * Handles {@link StoreDataEvent}.
	 */
	public interface Handler extends EventHandler {
		void onSuccess();
		void onFailure();
	}

	private final boolean success;
	
	public StoreDataEvent(boolean success) {
		this.success = success;
	}

	@Override
	protected void dispatch(Handler handler) {
		if(success)
			handler.onSuccess();
		else
			handler.onFailure();
	}

	@Override
	public Type<Handler> getAssociatedType() {
		return TYPE;
	}
}
