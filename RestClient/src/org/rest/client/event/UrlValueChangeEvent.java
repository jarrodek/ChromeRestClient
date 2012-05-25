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
 * Event fired each time when URL field value has changed.<br/>
 * URL value change even when any part of URL's detailed view has change.
 * <p>
 * It will be propagated through the applications {@link EventBus} and fired on
 * browser's document object as custom event {@link CustomEvent#URL_CHANGE} so
 * external extensions can handle action.
 * </p>
 * <p>
 * For example:
 * 
 * <pre>
 * document.addEventListener('arc:urlchange', function(e){ var newUrl = e.data; //do something... });
 * </pre>
 * 
 * </p>
 * <p>
 * <b>Note</b> This event will have "data" attribute with new URL value. It can
 * be either empty string or NULL ("undefined" in javascript).
 * </p>
 * 
 * @author Paweł Psztyć
 */
public class UrlValueChangeEvent extends Event<UrlValueChangeEvent.Handler> {
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
	 * Handles {@link UrlValueChangeEvent}.
	 */
	public interface Handler {
		/**
		 * Fired when URL value has changed either via URL field or detailed
		 * view's fields.
		 * 
		 * @param url
		 *            New url value or NULL if none provided.
		 */
		void onUrlChange(String url);
	}

	private final String url;

	public UrlValueChangeEvent(String url) {
		this.url = url;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onUrlChange(url);
	}

	@Override
	public Event.Type<Handler> getAssociatedType() {
		return TYPE;
	}
}
