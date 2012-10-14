package org.rest.client.event;


import com.google.gwt.xhr2.client.Response;
import com.google.web.bindery.event.shared.Event;
import com.google.web.bindery.event.shared.EventBus;
import com.google.web.bindery.event.shared.HandlerRegistration;

/**
 * Request finish event either successful or not.
 * 
 */
public class RequestEndEvent extends Event<RequestEndEvent.Handler> {
	
	
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
	public interface Handler {
		void onResponse(boolean success, Response response, long requestTime);
	}
	
	final private boolean success;
	final private Response response;
	final private long requestTime;
	
	/**
	 * Crate new request end event
	 * @param success either true or false
	 * @param response The response object or NULL on error 
	 * @param requestTime The request time in milliseconds 
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
	public Event.Type<Handler> getAssociatedType() {
		return TYPE;
	}
}
