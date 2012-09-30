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

import com.google.web.bindery.event.shared.Event;
import com.google.web.bindery.event.shared.EventBus;
import com.google.web.bindery.event.shared.HandlerRegistration;

/**
 * Event fired when notifications setting change.
 */
public class NotificationsStateChangeEvent extends Event<NotificationsStateChangeEvent.Handler> {
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
	 * Handles {@link NotificationsStateChangeEvent}.
	 */
	public interface Handler {
		/**
		 * 
		 */
		void onStateChange(boolean state);
	}
	private final boolean state;
	public NotificationsStateChangeEvent(boolean currentState){
		state = currentState;
	}
	
	@Override
	protected void dispatch(Handler handler) {
		handler.onStateChange(state);
	}

	@Override
	public Event.Type<Handler> getAssociatedType() {
		return TYPE;
	}
}
