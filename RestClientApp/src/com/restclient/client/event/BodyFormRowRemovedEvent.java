package com.restclient.client.event;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.HandlerRegistration;
import com.restclient.client.widgets.BodyFormRow;

/**
 * Fired when edited header form row.
 * 
 */
public class BodyFormRowRemovedEvent extends GwtEvent<BodyFormRowRemovedEvent.Handler> {
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
	 * Handles {@link BodyFormRowRemovedEvent}.
	 */
	public interface Handler extends EventHandler {
		void onRemove(BodyFormRow row, Object source);
	}

	private final BodyFormRow row;

	public BodyFormRowRemovedEvent(BodyFormRow row) {
		this.row = row;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onRemove(row, this.getSource());
	}

	@Override
	public com.google.gwt.event.shared.GwtEvent.Type<Handler> getAssociatedType() {
		return TYPE;
	}
}
