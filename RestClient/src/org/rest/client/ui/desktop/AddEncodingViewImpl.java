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

import org.rest.client.event.AddEncodingEvent;
import org.rest.client.ui.AddEncodingView;

import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.Scheduler;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.KeyDownHandler;
import com.google.gwt.event.logical.shared.CloseEvent;
import com.google.gwt.event.logical.shared.CloseHandler;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.HasText;
import com.google.gwt.user.client.ui.PopupPanel;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.Widget;
import com.google.web.bindery.event.shared.EventBus;

public class AddEncodingViewImpl implements HasText,
		AddEncodingView, CloseHandler<PopupPanel>, KeyDownHandler {

	interface Binder extends UiBinder<DialogBox, AddEncodingViewImpl> {
		Binder BINDER = GWT.create(Binder.class);
	}

	@UiField DialogBox dialog;
	@UiField TextBox encoding;
	@UiField DivElement errorField;
	private EventBus eventBus;
	private boolean eventFired = false;
	private boolean hasErrorDiplayed = false;

	public AddEncodingViewImpl() {
		Binder.BINDER.createAndBindUi(this);
		dialog.addDomHandler(this, KeyDownEvent.getType());
		dialog.addCloseHandler(this);
		
		encoding.addKeyDownHandler(new KeyDownHandler() {
			@Override
			public void onKeyDown(KeyDownEvent event) {
				if(hasErrorDiplayed){
					errorField.setInnerText("");
					errorField.addClassName("hidden");
					hasErrorDiplayed = false;
				}
			}
		});
		
		Scheduler.get().scheduleDeferred(new Scheduler.ScheduledCommand() {
			@Override
			public void execute() {
				encoding.getElement().focus();
			}
		});
	}

	@Override
	public void show() {
		dialog.show();
		dialog.center();
	}

	@UiHandler("cancel")
	void onDismiss(ClickEvent event) {
		AddEncodingEvent ev = new AddEncodingEvent(null);
		eventBus.fireEvent(ev);
		eventFired = true;
		dialog.hide();
	}

	@UiHandler("save")
	void onSave(ClickEvent event) {
		String currentValue = encoding.getValue();
		if (currentValue.trim().isEmpty()) {
			errorField.setInnerText("You must enter encoding value");
			errorField.removeClassName("hidden");
			hasErrorDiplayed = true;
			return;
		}
		AddEncodingEvent ev = new AddEncodingEvent(currentValue);
		eventBus.fireEvent(ev);
		eventFired = true;
		dialog.hide();
	}

	public void setText(String text) {
		encoding.setValue(text);
	}

	public String getText() {
		return encoding.getValue();
	}

	@Override
	public void onClose(CloseEvent<PopupPanel> event) {
		if (eventFired == false) {
			AddEncodingEvent ev = new AddEncodingEvent(null);
			AddEncodingViewImpl.this.eventBus.fireEvent(ev);
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
	}

	@Override
	public Widget asWidget() {
		return this.asWidget();
	}
}
