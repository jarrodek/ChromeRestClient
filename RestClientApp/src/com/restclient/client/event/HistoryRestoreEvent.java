package com.restclient.client.event;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.HandlerRegistration;
import com.restclient.client.RequestHistoryItem;

/**
 * Event to handle restore from history action.
 * 
 */
public class HistoryRestoreEvent extends GwtEvent<HistoryRestoreEvent.Handler> {
	/**
	 * Event type identifier
	 */
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
	 * Handles {@link HistoryRestoreEvent}.
	 */
	public interface Handler extends EventHandler {
		/**
		 * Action called after user select an history item to restore.
		 * @param form
		 * @param source
		 */
		void onRestoreAction(RequestHistoryItem form, Object source);
	}

	private RequestHistoryItem item;
	/**
	 * 
	 * @param object
	 */
	public HistoryRestoreEvent(RequestHistoryItem object) {
		this.item = object;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onRestoreAction(item, this.getSource());
	}

	@Override
	public com.google.gwt.event.shared.GwtEvent.Type<Handler> getAssociatedType() {
		return TYPE;
	}
}
