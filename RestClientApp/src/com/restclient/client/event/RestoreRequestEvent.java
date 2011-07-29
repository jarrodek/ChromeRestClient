package com.restclient.client.event;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.HandlerRegistration;
import com.restclient.client.storage.RestForm;

/**
 * Called when user click restore button in saved forms tab.
 * 
 */
public class RestoreRequestEvent extends GwtEvent<RestoreRequestEvent.Handler> {
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
	 * Handles {@link RestoreRequestEvent}.
	 */
	public interface Handler extends EventHandler {
		void onRestoreAction(RestForm form, Object source);
	}

	private RestForm form;

	public RestoreRequestEvent(RestForm object) {
		this.form = object;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onRestoreAction(form, this.getSource());
	}

	@Override
	public com.google.gwt.event.shared.GwtEvent.Type<Handler> getAssociatedType() {
		return TYPE;
	}
}
