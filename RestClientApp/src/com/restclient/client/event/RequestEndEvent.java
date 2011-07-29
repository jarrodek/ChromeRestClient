package com.restclient.client.event;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.HandlerRegistration;
import com.google.gwt.xhr2.client.Response;

/**
 * Request finish event either successful or not.
 * 
 */
public class RequestEndEvent extends GwtEvent<RequestEndEvent.Handler> {
	
	
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
	 * Handles {@link RequestEndEvent}.
	 */
	public interface Handler extends EventHandler {
		void onResponse(boolean success, Response response, long requestTime);
	}
	
	final private boolean success;
	final private Response response;
	final private long requestTime;
	
	/**
	 * 
	 * @param payload action to perform
	 * @param data any object to pass with request
	 */
	public RequestEndEvent(boolean success, Response response, long requestTime) {
		this.success = success;
		this.response = response;
		this.requestTime = requestTime;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onResponse(success, response, requestTime);
	}

	@Override
	public com.google.gwt.event.shared.GwtEvent.Type<Handler> getAssociatedType() {
		return TYPE;
	}
}
