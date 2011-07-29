package com.restclient.client.event;

import java.util.List;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.HandlerRegistration;
import com.restclient.client.storage.FilesObject;

/**
 * Fired when edited header form row.
 * 
 */
public class FilesChangeEvent extends GwtEvent<FilesChangeEvent.Handler> {
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
	 * Handles {@link FilesChangeEvent}.
	 */
	public interface Handler extends EventHandler {
		void onChange(List<FilesObject> files, Object source);
	}

	private final List<FilesObject> files;

	public FilesChangeEvent(List<FilesObject> files) {
		this.files = files;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onChange(files, this.getSource());
	}

	@Override
	public com.google.gwt.event.shared.GwtEvent.Type<Handler> getAssociatedType() {
		return TYPE;
	}
}
