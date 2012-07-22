/*******************************************************************************
 * Copyright 2012 Paweł Psztyć
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
package org.rest.client.event;

import java.util.Date;

import com.google.web.bindery.event.shared.Event;
import com.google.web.bindery.event.shared.EventBus;
import com.google.web.bindery.event.shared.HandlerRegistration;

/**
 * This event is fired when request has stopped either by error or success.
 * <p>
 * It will be propagated through the applications {@link EventBus} and fired on
 * browser's document object as custom event {@link CustomEvent#REQUEST_STOP} so
 * external extensions can handle action.
 * </p>
 * <p>
 * For example:
 * 
 * <pre>
 * document.addEventListener('arc:httpstop', function(e){ //do something... });
 * </pre>
 * 
 * </p>
 */
public class RequestStopEvent extends Event<RequestStopEvent.Handler> {
	public static final Type<Handler> TYPE = new Type<Handler>();

	/**
	 * Register an handler for this event.
	 * 
	 * @param eventBus
	 * @param handler
	 * @return
	 */
	public static HandlerRegistration register(EventBus eventBus,
			Handler handler) {
		return eventBus.addHandler(TYPE, handler);
	}

	/**
	 * Handles {@link RequestStopEvent}.
	 */
	public interface Handler{
		/**
		 * Called when request has stopped either with error or success.
		 * @param time Time when event occurred.
		 */
		void onStop(Date time);
	}
	private final Date time;
	/**
	 * Create request stop event.
	 * @param time Start time as a new Date().getTime();
	 */
	public RequestStopEvent(Date time){
		this.time = time;
	}
	
	@Override
	protected void dispatch(Handler handler) {
		handler.onStop(time);
	}

	@Override
	public Event.Type<Handler> getAssociatedType() {
		return TYPE;
	}
}
