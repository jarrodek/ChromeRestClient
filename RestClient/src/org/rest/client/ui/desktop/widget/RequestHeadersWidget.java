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

import org.rest.client.request.RequestHeadersParser;
import org.rest.client.resources.AppCssResource;
import org.rest.client.resources.AppResources;
import org.rest.client.ui.html5.HTML5Element;
import org.rest.client.ui.html5.SpanElement;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.KeyUpEvent;
import com.google.gwt.event.dom.client.KeyUpHandler;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
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

import com.google.gwt.xhr2.client.RequestHeader;

public class RequestHeadersWidget extends Composite implements HasText {
	interface Binder extends UiBinder<Widget, RequestHeadersWidget> {
	}
		
	public enum TABS { RAW, FORM }
	
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
	@UiField DivElement tabContent;
	@UiField HTMLPanel headersFormPanel;
	@UiField TextArea headersRawInput;
	
	private TABS currentTab = TABS.RAW;
	AppCssResource style = AppResources.INSTANCE.appCss();
	private String headersData = "";
	private ArrayList<FormInputs> formInputs = new ArrayList<RequestHeadersWidget.FormInputs>();
	
	public RequestHeadersWidget() {
		initWidget(GWT.<Binder> create(Binder.class).createAndBindUi(this));
		
		headersRawInput.addKeyUpHandler(new KeyUpHandler() {
			@Override
			public void onKeyUp(KeyUpEvent event) {
				headersData = headersRawInput.getValue();
			}
		});
		
		rawTab.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				if(currentTab.equals(TABS.RAW)) return;
				
				SpanElement tab = (SpanElement) rawTab.getElement();
				((SpanElement)tab.getParentElement()).querySelector("."+style.tabHandlercurrent()).getClassList().remove(style.tabHandlercurrent());
				tab.getClassList().add(style.tabHandlercurrent());
				
				HTML5Element contentParent = (HTML5Element) tabContent.getParentElement();
				contentParent.querySelector("." + style.tabsContent() + " ." + style.tabContent() + "." + style.tabContentCurrent()).getClassList().remove(style.tabContentCurrent());
				contentParent.querySelector("." + style.tabsContent() + " ." + style.tabContent() + "[data-tab=\"raw\"]").getClassList().add(style.tabContentCurrent());
		        
				currentTab = TABS.RAW;
			}
		});
		formTab.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				if(currentTab.equals(TABS.FORM)) return;
				
				updateForm();
				ensureFormHasRow();
				
				SpanElement tab = (SpanElement) formTab.getElement();
				((SpanElement)tab.getParentElement()).querySelector("."+style.tabHandlercurrent()).getClassList().remove(style.tabHandlercurrent());
				tab.getClassList().add(style.tabHandlercurrent());
				
				HTML5Element contentParent = (HTML5Element) tabContent.getParentElement();
				contentParent.querySelector("." + style.tabsContent() + " ." + style.tabContent() + "." + style.tabContentCurrent()).getClassList().remove(style.tabContentCurrent());
				contentParent.querySelector("." + style.tabsContent() + " ." + style.tabContent() + "[data-tab=\"form\"]").getClassList().add(style.tabContentCurrent());
		        
				currentTab = TABS.FORM;
			}
		});
	}
	
	public void clear(){
		//clear form panel
		headersFormPanel.clear();
		//clear form inputs list
		formInputs.clear();
		//clear current value
		headersData = null;
		//clear raw input
		headersRawInput.setValue(null);
	}
	
	@UiHandler("addHeader")
	void onAddHeader(ClickEvent e){
		e.preventDefault();
		addNewFormRow(null, null);
	}
	
	ValueChangeHandler<String> formRowChange = new ValueChangeHandler<String>() {
		@Override
		public void onValueChange(ValueChangeEvent<String> event) {
			updateRaw();
		}
	};
	
	
	private void addNewFormRow(String key, String value){
		final HTMLPanel row = new HTMLPanel("");
		row.setStyleName(style.formRow());
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
		
		keyBox.addStyleName(style.formKeyInput());
		valueBox.addStyleName(style.formValueInput());
		removeButton.addStyleName(style.removeButton());
		
		removeButton.setTitle("Remove");
		
		
		keyBox.addValueChangeHandler(formRowChange);
		valueBox.addValueChangeHandler(formRowChange);
		
		row.add(keyBox);
		row.add(valueBox);
		row.add(removeButton);
		
		headersFormPanel.add(row);
		
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

	@Override
	public String getText() {
		return headersData;
	}

	@Override
	public void setText(String text) {
		this.headersData = text;
		//propagate new value through widgets
		propagateCurrentHeaders();
	}
	/**
	 * Set new value in raw text box and in form.
	 */
	void propagateCurrentHeaders(){
		headersRawInput.setValue(headersData);
		updateForm();
	}
	/**
	 * Ensure that form has at least one row.
	 */
	void ensureFormHasRow(){
		if(headersFormPanel.getWidgetCount() > 0) return;
		addNewFormRow(null, null);
	}
	/**
	 * Clear form values
	 */
	void clearForm(){
		headersFormPanel.clear();
		formInputs.clear();
	}
	/**
	 * Get current headers value and fill up form.
	 */
	void updateForm(){
		clearForm();
		if(headersData == null){
			return;
		}
		ArrayList<RequestHeader> list = RequestHeadersParser.stringToHeaders(headersData);
		for(RequestHeader header : list){
			addNewFormRow(header.getName(), header.getValue());
		}
	}
	
	void updateRaw(){
		headersData = "";
		ArrayList<RequestHeader> list = new ArrayList<RequestHeader>();
		for(FormInputs inputs : formInputs){
			list.add(new RequestHeader(inputs.key.getValue(), inputs.value.getValue()));
		}
		headersData = RequestHeadersParser.headersListToString(list);
		headersRawInput.setValue(headersData);
	}
}
