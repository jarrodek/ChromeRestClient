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
 * This event is fired when new project has been saved into database.
 * 
 * {@link Handler} fire {@link Handler#onNewProject()} method when ready.
 * 
 * @author Paweł Psztyć
 */
public class NewProjectAvailableEvent extends Event<NewProjectAvailableEvent.Handler> {
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
	 * Handles {@link NewProjectAvailableEvent}.
	 */
	public interface Handler {
		/**
		 * Fired when user save new project
		 * 
		 * @param projectId
		 *            inserted project ID
		 */
		void onNewProject(int projectId);
	}

	private final int projectId;

	public NewProjectAvailableEvent(int projectId) {
		this.projectId = projectId;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onNewProject(projectId);
	}

	@Override
	public Event.Type<Handler> getAssociatedType() {
		return TYPE;
	}
}
