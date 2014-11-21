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
package org.rest.client.ui.desktop;

import org.rest.client.event.ProjectChangeRequestEvent;
import org.rest.client.event.ProjectDeleteEvent;
import org.rest.client.event.ProjectDeleteRequestEvent;
import org.rest.client.storage.store.objects.ProjectObject;
import org.rest.client.ui.EditProjectView;

import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.Scheduler;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.dom.client.Style.VerticalAlign;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.KeyDownHandler;
import com.google.gwt.event.logical.shared.CloseEvent;
import com.google.gwt.event.logical.shared.CloseHandler;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.DOM;
import com.google.gwt.dom.client.Element;
import com.google.gwt.user.client.ui.Anchor;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.HasText;
import com.google.gwt.user.client.ui.PopupPanel;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.Widget;
import com.google.web.bindery.event.shared.EventBus;

public class EditProjectViewImpl implements HasText,
		EditProjectView, CloseHandler<PopupPanel>, KeyDownHandler {

	interface Binder extends UiBinder<DialogBox, EditProjectViewImpl> {
		Binder BINDER = GWT.create(Binder.class);
	}

	@UiField DialogBox dialog;
	@UiField TextBox projectNameInput;
	@UiField DivElement errorField;
	@UiField Anchor deleteProjectAnchor;
	@UiField DivElement deleteContainer;
	private EventBus eventBus;
	private boolean eventFired = false;
	private boolean hasErrorDiplayed = false;
	ProjectObject project = null;

	public EditProjectViewImpl() {
		Binder.BINDER.createAndBindUi(this);
		dialog.addDomHandler(this, KeyDownEvent.getType());
		dialog.addCloseHandler(this);
		dialog.setAutoHideEnabled(true);
		dialog.setAutoHideOnHistoryEventsEnabled(true);
		
		projectNameInput.addKeyDownHandler(new KeyDownHandler() {
			@Override
			public void onKeyDown(KeyDownEvent event) {
				if(hasErrorDiplayed){
					errorField.setInnerText("");
					errorField.addClassName("hidden");
					hasErrorDiplayed = false;
				}
			}
		});
		
	}

	@Override
	public void show() {
		dialog.show();
		dialog.center();
		Scheduler.get().scheduleDeferred(new Scheduler.ScheduledCommand() {
			@Override
			public void execute() {
				projectNameInput.getElement().focus();
			}
		});
	}

	@UiHandler("cancel")
	void onDismiss(ClickEvent event) {
		ProjectChangeRequestEvent ev = new ProjectChangeRequestEvent(null);
		eventBus.fireEvent(ev);
		eventFired = true;
		dialog.hide();
	}

	@UiHandler("save")
	void onSave(ClickEvent event) {
		String currentValue = projectNameInput.getValue();
		if (currentValue.trim().isEmpty()) {
			errorField.setInnerText("You must enter project name");
			errorField.removeClassName("hidden");
			hasErrorDiplayed = true;
			return;
		}
		
		project.setName(currentValue);
		if(!project.getName().equals(currentValue)){
			project = ProjectObject.redefineObject(project);
			project.setName(currentValue);
		}
		
		ProjectChangeRequestEvent ev = new ProjectChangeRequestEvent(project);
		eventBus.fireEvent(ev);
		eventFired = true;
		dialog.hide();
	}

	public void setText(String text) {
		projectNameInput.setValue(text);
	}

	public String getText() {
		return projectNameInput.getValue();
	}

	@Override
	public void onClose(CloseEvent<PopupPanel> event) {
		if (eventFired == false) {
			ProjectChangeRequestEvent ev = new ProjectChangeRequestEvent(null);
			eventBus.fireEvent(ev);
		}
	}

	@Override
	public void onKeyDown(KeyDownEvent event) {
		
		int keyCode = event.getNativeKeyCode();
		if (keyCode == KeyCodes.KEY_ENTER) {
			onSave(null);
		} else if (keyCode == KeyCodes.KEY_ESCAPE) {
			onDismiss(null);
		}
	}

	@Override
	public void setEventBus(EventBus eventBus) {
		this.eventBus = eventBus;
		ProjectDeleteEvent.register(eventBus, new ProjectDeleteEvent.Handler() {
			
			@Override
			public void onProjectDelete(int projectId) {
				eventFired = true;
				dialog.hide();
			}
		});
	}

	@Override
	public Widget asWidget() {
		return this.asWidget();
	}

	@Override
	public void setProjectData(ProjectObject project) {
		this.project = project;
		projectNameInput.setText(project.getName());
	}
	@UiHandler("deleteProjectAnchor")
	void onDeleteProject(ClickEvent e){
		e.preventDefault();
		ProjectDeleteRequestEvent ev = new ProjectDeleteRequestEvent(project.getId());
		eventBus.fireEvent(ev);
		deleteProjectAnchor.setEnabled(false);
		Element span = DOM.createSpan();
		span.setClassName("loaderImage");
		span.getStyle().setVerticalAlign(VerticalAlign.MIDDLE);
		deleteContainer.appendChild(span);
	}
}
