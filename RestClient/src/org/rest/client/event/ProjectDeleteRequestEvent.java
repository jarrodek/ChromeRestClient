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
 * The user has requested to delete a project data.
 * 
 * The Dialog fire this event to notify handler to remove project data. {@link Handler} fire
 * {@link Handler#onProjectDelete()} method when ready. Event can result NULL
 * value witch means user cancels dialog.
 * <p>
 * Dialog itself don't make any changes to the storage. Event handlers must implement
 * delete action.
 * </p>
 * 
 * <p>
 * <b>Note</b> there is no sure that deletion is completed.</p>
 * 
 * @author Paweł Psztyć
 */
public class ProjectDeleteRequestEvent extends Event<ProjectDeleteRequestEvent.Handler> {
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
	 * Handles {@link ProjectDeleteRequestEvent}.
	 */
	public interface Handler {
		/**
		 * @param projectId
		 *            ID of the project to delete
		 */
		void onProjectDelete(int projectId);
	}

	private final int project;

	public ProjectDeleteRequestEvent(int project) {
		this.project = project;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onProjectDelete(project);
	}

	@Override
	public Event.Type<Handler> getAssociatedType() {
		return TYPE;
	}
}
