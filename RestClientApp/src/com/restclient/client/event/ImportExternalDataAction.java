package com.restclient.client.event;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.HandlerRegistration;

/**
 * Store data on application server Action to run
 */
public class ImportExternalDataAction extends GwtEvent<ImportExternalDataAction.Handler> {
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
	 * Handles {@link ImportExternalDataAction}.
	 */
	public interface Handler extends EventHandler {
		void onAction(String uid);
	}
	final String uid;
	public ImportExternalDataAction(String uid) {
		this.uid = uid;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onAction(uid);
	}

	@Override
	public Type<Handler> getAssociatedType() {
		return TYPE;
	}
}
