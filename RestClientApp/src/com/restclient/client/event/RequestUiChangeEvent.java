package com.restclient.client.event;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.HandlerRegistration;

/**
 * Request to change Request view.
 * Actually it's form of communication with request form view to send a command to do some task.
 * 
 */
public class RequestUiChangeEvent extends GwtEvent<RequestUiChangeEvent.Handler> {
	/**
	 * Disable UI controls during request.<br/>
	 * Value: 1
	 */
	public static final int ACTION_DISABLE_BUTTONS = 1;
	/**
	 * Enable UI controls after request.<br/>
	 * Value: 2
	 */
	public static final int ACTION_ENABLE_BUTTONS = 2;
	/**
	 * On request upload set controls data<br/>
	 * Value: 3
	 */
	public static final int ACTION_SET_UPLOAD_CONTROLS = 3;
	/**
	 * On upload start event. Set upload controls.<br/>
	 * Value: 4
	 */
	public static final int ACTION_SET_UPLOAD_START = 4;
	/**
	 * On upload end event. Hide all upload controls.<br/>
	 * Value: 5
	 */
	public static final int ACTION_SET_UPLOAD_END = 5;
	/**
	 * When downloading data from remote server.<br/>
	 * Value: 6
	 */
	public static final int ACTION_SET_DOWNLOAD_CONTROLS = 6;
	
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
	 * Handles {@link RequestUiChangeEvent}.
	 */
	public interface Handler extends EventHandler {
		void performAction(int payload, Object data);
	}
	
	final private int payload;
	final private Object data;
	/**
	 * 
	 * @param payload action to perform
	 * @param data any object to pass with request
	 */
	public RequestUiChangeEvent(int payload, Object data) {
		this.payload = payload;
		this.data = data;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.performAction(payload, data);
	}

	@Override
	public com.google.gwt.event.shared.GwtEvent.Type<Handler> getAssociatedType() {
		return TYPE;
	}
}
