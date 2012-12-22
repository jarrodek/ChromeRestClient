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
package org.rest.client.task;

import org.rest.client.ui.html5.HTML5FileUpload;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.event.dom.client.ChangeEvent;
import com.google.gwt.event.dom.client.ChangeHandler;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.KeyDownHandler;
import com.google.gwt.event.logical.shared.CloseHandler;
import com.google.gwt.event.shared.HandlerRegistration;
import com.google.gwt.file.client.File;
import com.google.gwt.file.client.FileError;
import com.google.gwt.filereader.client.ErrorHandler;
import com.google.gwt.filereader.client.FileReader;
import com.google.gwt.filereader.client.LoadHandler;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.PopupPanel;

public class DefinitionsErrorDialog implements KeyDownHandler {

	interface Binder extends UiBinder<DialogBox, DefinitionsErrorDialog> {
		Binder BINDER = GWT.create(Binder.class);
	}

	@UiField DialogBox dialog;
	@UiField DivElement errorField;
	@UiField HTML5FileUpload fileImport;
	@UiField Button cancel;
	String result = null;
	
	public DefinitionsErrorDialog() {
		Binder.BINDER.createAndBindUi(this);
		dialog.addDomHandler(this, KeyDownEvent.getType());
		fileImport.addChangeHandler(new ChangeHandler() {
			@Override
			public void onChange(ChangeEvent event) {
				parseFile();
			}
		});
	}

	public void show() {
		dialog.show();
		dialog.center();
	}

	@UiHandler("cancel")
	void onDismiss(ClickEvent event) {
		dialog.hide();
	}
	
	public HandlerRegistration addCloseHandler(CloseHandler<PopupPanel> handler){
		return dialog.addCloseHandler(handler);
	}
	
	private void parseFile(){
		if(fileImport.getFiles().size() == 0) return;
		cancel.setEnabled(false);
		File file = fileImport.getFiles().get(0);
		FileReader reader = FileReader.create();
		reader.addLoadHandler(new LoadHandler() {
			@Override
			public void onLoad(File file) {
				result = file.getResult();
				dialog.hide();
			}
		});
		reader.addErrorHandler(new ErrorHandler() {
			@Override
			public void onError(File file, FileError error) {
				errorField.setInnerText("Unable read file :(");
				errorField.removeClassName("hidden");
				cancel.setEnabled(true);
			}
		});
		reader.readAsText(file);
	}
	

	@Override
	public void onKeyDown(KeyDownEvent event) {
		int keyCode = event.getNativeKeyCode();
		if (keyCode == KeyCodes.KEY_ESCAPE) {
			onDismiss(null);
		}
	}

	public String getResult() {
		return result;
	}
}
