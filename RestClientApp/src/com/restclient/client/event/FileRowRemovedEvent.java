package com.restclient.client.event;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.HandlerRegistration;
import com.restclient.client.widgets.FileInputRow;

/**
 * Fired when file row is removed.
 * 
 */
public class FileRowRemovedEvent extends GwtEvent<FileRowRemovedEvent.Handler> {
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
	 * Handles {@link FileRowRemovedEvent}.
	 */
	public interface Handler extends EventHandler {
		void onRemove(FileInputRow row);
	}

	private final FileInputRow row;

	public FileRowRemovedEvent(FileInputRow row) {
		this.row = row;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onRemove(row);
	}

	@Override
	public com.google.gwt.event.shared.GwtEvent.Type<Handler> getAssociatedType() {
		return TYPE;
	}
}
