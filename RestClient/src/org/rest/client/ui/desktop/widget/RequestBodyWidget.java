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
package org.rest.client.ui.desktop.widget;

import java.util.ArrayList;

import org.rest.client.request.FilesObject;
import org.rest.client.request.FormPayloadData;
import org.rest.client.request.RequestPayloadParser;
import org.rest.client.resources.AppCssResource;
import org.rest.client.resources.AppResources;
import org.rest.client.ui.IsHideable;
import org.rest.client.ui.html5.HTML5Element;
import org.rest.client.ui.html5.HTML5FileUpload;
import org.rest.client.ui.html5.ListItem;
import org.rest.client.ui.html5.ListPanel;
import org.rest.client.ui.html5.SpanElement;
import org.rest.client.util.Units;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.dom.client.InputElement;
import com.google.gwt.dom.client.Style.Display;
import com.google.gwt.event.dom.client.ChangeEvent;
import com.google.gwt.event.dom.client.ChangeHandler;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.KeyUpEvent;
import com.google.gwt.event.dom.client.KeyUpHandler;
import com.google.gwt.event.dom.client.MouseOutEvent;
import com.google.gwt.event.dom.client.MouseOutHandler;
import com.google.gwt.event.dom.client.MouseOverEvent;
import com.google.gwt.event.dom.client.MouseOverHandler;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.resources.client.CssResource;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.HasText;
import com.google.gwt.user.client.ui.InlineLabel;
import com.google.gwt.user.client.ui.TextArea;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.Widget;
import com.google.gwt.xhr2.client.File;
import com.google.gwt.xhr2.client.FileList;

public class RequestBodyWidget extends Composite implements IsHideable, HasText {
	interface Binder extends UiBinder<Widget, RequestBodyWidget> {
	}
	
	interface WidgetStyle extends CssResource {
		String selectedFilesList();
	}
	
	public enum TABS { RAW, FORM, FILES }
	
	private class FormInputs {
		public FormInputs(TextBox keyBox, TextBox valueBox) {
			this.key = keyBox;
			this.value = valueBox;
		}
		final TextBox key;
		final TextBox value;
	}
	
	@UiField InlineLabel rawTab;
	@UiField InlineLabel formTab;
	@UiField InlineLabel filesTab;
	@UiField DivElement tabContent;
	@UiField HTMLPanel payloadFormPanel;
	@UiField HTMLPanel filesFormPanel;
	@UiField WidgetStyle style;
	@UiField TextArea payloadRawInput;
	
	private TABS currentTab = TABS.RAW;
	AppCssResource appStyle = AppResources.INSTANCE.appCss();
	
	private int fileFieldNumber = 0;
	private String fileFieldName = "fileUpload";
	private String payloadData = "";
	private ArrayList<FormInputs> formInputs = new ArrayList<FormInputs>();
	
	public RequestBodyWidget() {
		initWidget(GWT.<Binder> create(Binder.class).createAndBindUi(this));
		
		payloadRawInput.addKeyUpHandler(new KeyUpHandler() {
			@Override
			public void onKeyUp(KeyUpEvent event) {
				payloadData = payloadRawInput.getValue();
			}
		});
		
		
		rawTab.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				if(currentTab.equals(TABS.RAW)) return;
				
				String tabHandlercurrent = appStyle.inlineButtonChecked();
				
				SpanElement tab = (SpanElement) rawTab.getElement();
				((SpanElement)tab.getParentElement()).querySelector("."+tabHandlercurrent).getClassList().remove(tabHandlercurrent);
				tab.getClassList().add(tabHandlercurrent);
				
				HTML5Element contentParent = (HTML5Element) tabContent.getParentElement();
				contentParent.querySelector("." + appStyle.tabsContent() + " ." + appStyle.tabContent() + "." + appStyle.tabContentCurrent()).getClassList().remove(appStyle.tabContentCurrent());
				contentParent.querySelector("." + appStyle.tabsContent() + " ." + appStyle.tabContent() + "[data-tab=\"raw\"]").getClassList().add(appStyle.tabContentCurrent());
		        
				currentTab = TABS.RAW;
			}
		});
		rawTab.addMouseOverHandler(new MouseOverHandler() {
			@Override
			public void onMouseOver(MouseOverEvent event) {
				SpanElement tab = (SpanElement) rawTab.getElement();
				if(!tab.getClassList().contains(appStyle.inlineButtonChecked()))
					tab.getClassList().add(appStyle.inlineButtonHover());
			}
		});
		rawTab.addMouseOutHandler(new MouseOutHandler() {
			@Override
			public void onMouseOut(MouseOutEvent event) {
				SpanElement tab = (SpanElement) rawTab.getElement();
				if(!tab.getClassList().contains(appStyle.inlineButtonHover()))
					tab.getClassList().remove(appStyle.inlineButtonHover());
			}
		});
		formTab.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				if(currentTab.equals(TABS.FORM)) return;
				
				updateForm();
				ensureFormHasRow();
				
				String tabHandlercurrent = appStyle.inlineButtonChecked();
				
				SpanElement tab = (SpanElement) formTab.getElement();
				((SpanElement)tab.getParentElement()).querySelector("."+tabHandlercurrent).getClassList().remove(tabHandlercurrent);
				tab.getClassList().add(tabHandlercurrent);
				
				HTML5Element contentParent = (HTML5Element) tabContent.getParentElement();
				contentParent.querySelector("." + appStyle.tabsContent() + " ." + appStyle.tabContent() + "." + appStyle.tabContentCurrent()).getClassList().remove(appStyle.tabContentCurrent());
				contentParent.querySelector("." + appStyle.tabsContent() + " ." + appStyle.tabContent() + "[data-tab=\"form\"]").getClassList().add(appStyle.tabContentCurrent());
		        
				currentTab = TABS.FORM;
			}
		});
		formTab.addMouseOverHandler(new MouseOverHandler() {
			@Override
			public void onMouseOver(MouseOverEvent event) {
				SpanElement tab = (SpanElement) formTab.getElement();
				if(!tab.getClassList().contains(appStyle.inlineButtonChecked()))
					tab.getClassList().add(appStyle.inlineButtonHover());
			}
		});
		formTab.addMouseOutHandler(new MouseOutHandler() {
			@Override
			public void onMouseOut(MouseOutEvent event) {
				SpanElement tab = (SpanElement) formTab.getElement();
				if(tab.getClassList().contains(appStyle.inlineButtonHover()))
					tab.getClassList().remove(appStyle.inlineButtonHover());
			}
		});
		filesTab.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				if(currentTab.equals(TABS.FILES)) return;
				
				ensureFilesHasRow();
				
				String tabHandlercurrent = appStyle.inlineButtonChecked();
				
				SpanElement tab = (SpanElement) filesTab.getElement();
				((SpanElement)tab.getParentElement()).querySelector("."+tabHandlercurrent).getClassList().remove(tabHandlercurrent);
				tab.getClassList().add(tabHandlercurrent);
				
				HTML5Element contentParent = (HTML5Element) tabContent.getParentElement();
				contentParent.querySelector("." + appStyle.tabsContent() + " ." + appStyle.tabContent() + "." + appStyle.tabContentCurrent()).getClassList().remove(appStyle.tabContentCurrent());
				contentParent.querySelector("." + appStyle.tabsContent() + " ." + appStyle.tabContent() + "[data-tab=\"file\"]").getClassList().add(appStyle.tabContentCurrent());
		        
				currentTab = TABS.FILES;
			}
		});
		filesTab.addMouseOverHandler(new MouseOverHandler() {
			@Override
			public void onMouseOver(MouseOverEvent event) {
				SpanElement tab = (SpanElement) filesTab.getElement();
				if(!tab.getClassList().contains(appStyle.inlineButtonChecked()))
					tab.getClassList().add(appStyle.inlineButtonHover());
			}
		});
		filesTab.addMouseOutHandler(new MouseOutHandler() {
			@Override
			public void onMouseOut(MouseOutEvent event) {
				SpanElement tab = (SpanElement) filesTab.getElement();
				if(tab.getClassList().contains(appStyle.inlineButtonHover()))
					tab.getClassList().remove(appStyle.inlineButtonHover());
			}
		});
	}
	/**
	 * Reset widget
	 */
	public void clear(){
		clearForm();
		payloadData = "";
		filesFormPanel.clear();
		fileFieldNumber = 0;
		payloadRawInput.setValue(null);
		allFilesCount = 0;
		filesTab.setText("Files (0)");
	}
	
	
	@Override
	public void hide() {
		if(!isHidden())
			this.getElement().getStyle().setDisplay(Display.NONE);
	}

	@Override
	public void show() {
		if(isHidden())
			this.getElement().getStyle().clearDisplay();
	}

	@Override
	public boolean isHidden() {
		String display = this.getElement().getStyle().getDisplay();
		if(display.toLowerCase().equals("none")){
			return true;
		}
		return false;
	}
	
	@UiHandler("addValue")
	void onAddValue(ClickEvent e){
		e.preventDefault();
		addNewFormRow(null, null);
	}
	@UiHandler("addFile")
	void onAddFile(ClickEvent e){
		e.preventDefault();
		addNewFileRow(null);
	}
	
	ValueChangeHandler<String> formRowChange = new ValueChangeHandler<String>() {
		@Override
		public void onValueChange(ValueChangeEvent<String> event) {
			updateRaw();
		}
	};
	
	private void addNewFormRow(String key, String value){
		final HTMLPanel row = new HTMLPanel("");
		row.setStyleName(appStyle.formRow());
		TextBox keyBox = new TextBox();
		TextBox valueBox = new TextBox();
		InlineLabel removeButton = new InlineLabel("x");
		
		final FormInputs inputsListItem = new FormInputs(keyBox,valueBox);
		formInputs.add(inputsListItem);
		
		if(key != null){
			keyBox.setValue(key);
		}
		if(value != null){
			valueBox.setValue(value);
		}
		
		keyBox.getElement().setAttribute("placeholder", "key");
		valueBox.getElement().setAttribute("placeholder", "value");
		
		valueBox.addStyleName(appStyle.formValueInput());
		removeButton.addStyleName(appStyle.removeButton());
		
		removeButton.setTitle("Remove");
		
		keyBox.addValueChangeHandler(formRowChange);
		valueBox.addValueChangeHandler(formRowChange);
		
		row.add(keyBox);
		row.add(valueBox);
		row.add(removeButton);
		
		payloadFormPanel.add(row);
		
		removeButton.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				formInputs.remove(inputsListItem);
				row.removeFromParent();
				updateRaw();
			}
		});
		
		keyBox.getElement().focus();
	}
	
	private int allFilesCount = 0;
	private ArrayList<HTML5FileUpload> fileInputs = new ArrayList<HTML5FileUpload>();
	
	private void addNewFileRow(String key){
		final HTMLPanel row = new HTMLPanel("");
		final ListPanel listPanel = new ListPanel();
		listPanel.setStyleName(style.selectedFilesList());
		
		row.setStyleName(appStyle.formRow());
		TextBox keyBox = new TextBox();
		final HTML5FileUpload valueBox = new HTML5FileUpload();
		InlineLabel removeButton = new InlineLabel("x");
		
		fileInputs.add(valueBox);
		keyBox.getElement().setAttribute("placeholder", "Field name");
		
		String value = null;
		if(key == null){
			value = fileFieldName;
			if(fileFieldNumber > 0){
				value += "" + fileFieldNumber;
			}
		} else {
			value = key;
		}
		keyBox.setValue(value);
		removeButton.addStyleName(appStyle.removeButton());
		removeButton.setTitle("Remove");
		
		valueBox.setMultiple(true);
		valueBox.addChangeHandler(new ChangeHandler() {
			
			@Override
			public void onChange(ChangeEvent event) {
				int prevCnt = listPanel.getWidgetCount();
				allFilesCount -= prevCnt;
				listPanel.clear();
				FileList files = valueBox.getFiles();
				int cnt = files.size();
				allFilesCount += cnt;
				filesTab.setText("Files (" + allFilesCount + ")");
				for(int i=0; i<cnt; i++){
					File file = files.get(i);
					
					String sizeValue = String.valueOf(file.getSize());
					int dotPos = sizeValue.indexOf(",");
					if(dotPos == -1){
						dotPos = sizeValue.indexOf(".");
					}
					if(dotPos > -1){
						sizeValue = sizeValue.substring(0, dotPos);
					}
					
					long sizeLong = Long.parseLong(sizeValue);
					String fileSize = Units.swithFileSize(sizeLong);
					
					String html = file.getName() + " ";
					html += "("+fileSize+")";
					ListItem li = new ListItem();
					li.setHTML(html);
					listPanel.add(li);
				}
			}
		});
		row.add(valueBox);
		row.add(keyBox);
		row.add(removeButton);
		row.add(listPanel);
		
		filesFormPanel.add(row);
		
		removeButton.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				int cnt = listPanel.getWidgetCount();
				allFilesCount -= cnt;
				filesTab.setText("Files (" + allFilesCount + ")");
				fileInputs.remove(valueBox);
				row.removeFromParent();
			}
		});
		fileFieldNumber ++;
		keyBox.selectAll();
		keyBox.getElement().focus();
	}
	
	@Override
	public String getText() {
		return payloadData;
	}

	@Override
	public void setText(String text) {
		this.payloadData = text;
		//propagate new value through widgets
		propagateCurrentPayload();
	}
	/**
	 * Set new value in raw text box and in form.
	 */
	void propagateCurrentPayload(){
		payloadRawInput.setValue(payloadData);
		updateForm();
	}
	/**
	 * Ensure that form has at least one row.
	 */
	void ensureFormHasRow(){
		if(payloadFormPanel.getWidgetCount() > 0) return;
		addNewFormRow(null, null);
	}
	
	void ensureFilesHasRow(){
		if(filesFormPanel.getWidgetCount() > 0) return;
		addNewFileRow(null);
	}
	/**
	 * Clear form values
	 */
	void clearForm(){
		payloadFormPanel.clear();
		formInputs.clear();
	}
	/**
	 * Get current payload value and fill up form.
	 */
	void updateForm(){
		clearForm();
		ArrayList<FormPayloadData> list = RequestPayloadParser.stringToFormArrayList(payloadData);
		for(FormPayloadData payload : list){
			addNewFormRow(payload.getKey(), payload.getValue());
		}
	}
	
	void updateRaw(){
		payloadData = "";
		ArrayList<FormPayloadData> list = new ArrayList<FormPayloadData>();
		for(FormInputs inputs : formInputs){
			list.add(new FormPayloadData(inputs.key.getValue(), inputs.value.getValue()));
		}
		payloadData = RequestPayloadParser.parseData(list);
		payloadRawInput.setValue(payloadData);
	}
	public ArrayList<FilesObject> getInputFiles() {
		ArrayList<FilesObject> fo = new ArrayList<FilesObject>();
		for(HTML5FileUpload file : fileInputs){
			if(file == null) continue;
			FileList files = file.getFiles();
			if(files == null || files.size() == 0) continue;
			InputElement ie = (InputElement)file.getElement().getNextSiblingElement();
			FilesObject fileObjet = new FilesObject(ie.getValue(), files);
			fo.add(fileObjet);
		}
		return fo;
	}
}

