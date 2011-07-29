package com.restclient.client.event;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.HandlerRegistration;

/**
 * Called when user click to save button on save state dialog
 * 
 */
public class FormStateSaveEvent extends GwtEvent<FormStateSaveEvent.Handler> {
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
	 * Handles {@link FormStateSaveEvent}.
	 */
	public interface Handler extends EventHandler {
		void onSave(String formName, Object source);
	}
	/**
	 * User input - name for saved form.
	 */
	private final String name;

	public FormStateSaveEvent(String name) {
		this.name = name;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onSave(name, this.getSource());
	}

	@Override
	public com.google.gwt.event.shared.GwtEvent.Type<Handler> getAssociatedType() {
		return TYPE;
	}
}
