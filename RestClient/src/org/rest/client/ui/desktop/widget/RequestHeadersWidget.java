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
import java.util.List;

import org.rest.client.RestClient;
import org.rest.client.headerssupport.HeadersFillSupport;
import org.rest.client.request.RequestHeadersParser;
import org.rest.client.resources.AppCssResource;
import org.rest.client.resources.AppResources;
import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.store.HeadersStoreWebSql;
import org.rest.client.storage.websql.HeaderRow;
import org.rest.client.suggestion.HeadersSuggestOracle;
import org.rest.client.ui.html5.HTML5Element;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.KeyUpEvent;
import com.google.gwt.event.dom.client.KeyUpHandler;
import com.google.gwt.event.dom.client.MouseOutEvent;
import com.google.gwt.event.dom.client.MouseOutHandler;
import com.google.gwt.event.dom.client.MouseOverEvent;
import com.google.gwt.event.dom.client.MouseOverHandler;
import com.google.gwt.event.logical.shared.SelectionEvent;
import com.google.gwt.event.logical.shared.SelectionHandler;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.resources.client.CssResource;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.DecoratedPopupPanel;
import com.google.gwt.user.client.ui.FlowPanel;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.HasText;
import com.google.gwt.user.client.ui.InlineLabel;
import com.google.gwt.user.client.ui.SuggestBox;
import com.google.gwt.user.client.ui.SuggestBox.DefaultSuggestionDisplay;
import com.google.gwt.user.client.ui.SuggestOracle;
import com.google.gwt.user.client.ui.TextArea;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.Widget;
import com.google.gwt.xhr2.client.RequestHeader;

public class RequestHeadersWidget extends Composite implements HasText {
	interface Binder extends UiBinder<Widget, RequestHeadersWidget> {
	}
	
	interface HeaderStyle extends CssResource {
		String hasSupport();
		String headerDesc();
		String headerExample();
		String headersDescPopup();
		String keyBoxContainer();
		String headerSupportHint();
	}
	
	public enum TABS { RAW, FORM }
	
	private class FormInputs {
		public FormInputs(SuggestBox keyBox, TextBox valueBox) {
			this.key = keyBox;
			this.value = valueBox;
		}
		final SuggestBox key;
		final TextBox value;
	}
	
	
	@UiField InlineLabel rawTab; 
	@UiField InlineLabel formTab;
	@UiField DivElement tabContent;
	@UiField HTMLPanel headersFormPanel;
	@UiField TextArea headersRawInput;
	@UiField HeaderStyle style;
	
	private TABS currentTab = TABS.RAW;
	AppCssResource appStyle = AppResources.INSTANCE.appCss();
	private String headersData = "";
	private ArrayList<FormInputs> formInputs = new ArrayList<RequestHeadersWidget.FormInputs>();
	private HeadersSuggestOracle suggestOracle = null;
	final HeadersStoreWebSql store;
	
	public RequestHeadersWidget() {
		initWidget(GWT.<Binder> create(Binder.class).createAndBindUi(this));
		
		//
		// Initialize Suggest Oracle for headers
		//
		store = RestClient.getClientFactory().getHeadersStore();
		suggestOracle = new HeadersSuggestOracle(store, "request");
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
				
				String tabHandlercurrent = appStyle.inlineButtonChecked();
				String tabsContent = appStyle.tabsContent();
				String cssTabContent = appStyle.tabContent();
				String tabContentCurrent = appStyle.tabContentCurrent();
				
				HTML5Element tab = (HTML5Element) rawTab.getElement();
				((HTML5Element)tab.getParentElement()).querySelector("."+tabHandlercurrent).getClassList().remove(tabHandlercurrent);
				tab.getClassList().add(tabHandlercurrent);
				
				HTML5Element contentParent = (HTML5Element) tabContent.getParentElement();
				contentParent.querySelector("." + tabsContent + " ." + cssTabContent + "." + tabContentCurrent).getClassList().remove(tabContentCurrent);
				contentParent.querySelector("." + tabsContent + " ." + cssTabContent + "[data-tab=\"raw\"]").getClassList().add(tabContentCurrent);
		        
				currentTab = TABS.RAW;
			}
		});
		rawTab.addMouseOverHandler(new MouseOverHandler() {
			@Override
			public void onMouseOver(MouseOverEvent event) {
				HTML5Element tab = (HTML5Element) rawTab.getElement();
				if(!tab.getClassList().contains(appStyle.inlineButtonChecked()))
					tab.getClassList().add(appStyle.inlineButtonHover());
			}
		});
		rawTab.addMouseOutHandler(new MouseOutHandler() {
			@Override
			public void onMouseOut(MouseOutEvent event) {
				HTML5Element tab = (HTML5Element) rawTab.getElement();
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
				String tabsContent = appStyle.tabsContent();
				String cssTabContent = appStyle.tabContent();
				String tabContentCurrent = appStyle.tabContentCurrent();
				
				HTML5Element tab = (HTML5Element) formTab.getElement();
				((HTML5Element)tab.getParentElement()).querySelector("."+tabHandlercurrent).getClassList().remove(tabHandlercurrent);
				tab.getClassList().add(tabHandlercurrent);
				
				HTML5Element contentParent = (HTML5Element) tabContent.getParentElement();
				contentParent.querySelector("." + tabsContent + " ." + cssTabContent + "." + tabContentCurrent).getClassList().remove(tabContentCurrent);
				contentParent.querySelector("." + tabsContent + " ." + cssTabContent + "[data-tab=\"form\"]").getClassList().add(tabContentCurrent);
		        
				currentTab = TABS.FORM;
			}
		});
		formTab.addMouseOverHandler(new MouseOverHandler() {
			@Override
			public void onMouseOver(MouseOverEvent event) {
				HTML5Element tab = (HTML5Element) formTab.getElement();
				if(!tab.getClassList().contains(appStyle.inlineButtonChecked()))
					tab.getClassList().add(appStyle.inlineButtonHover());
			}
		});
		formTab.addMouseOutHandler(new MouseOutHandler() {
			@Override
			public void onMouseOut(MouseOutEvent event) {
				HTML5Element tab = (HTML5Element) formTab.getElement();
				if(tab.getClassList().contains(appStyle.inlineButtonHover()))
					tab.getClassList().remove(appStyle.inlineButtonHover());
			}
		});
	}
	
	public void clear(){
		//clear form panel
		headersFormPanel.clear();
		//clear form inputs list
		formInputs.clear();
		//clear current value
		headersData = "";
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
			if (event.getSource() instanceof SuggestBox) {
				SuggestBox sb = (SuggestBox) event.getSource();
				if(((DefaultSuggestionDisplay)sb.getSuggestionDisplay()).isSuggestionListShowing()){
					return;
				}
				SuggestBox key = (SuggestBox) event.getSource();
				for(FormInputs fi : formInputs){
					if(fi.key.equals(key)){
						provideHeaderSupport(sb, fi.value);
						break;
					}
				}
			}
			updateRaw();
		}
	};
	
	
	private void addNewFormRow(String key, String value){
		
		final HTMLPanel row = new HTMLPanel("");
		row.setStyleName(appStyle.formRow());
		final TextBox valueBox = new TextBox();
		
		SuggestBox _tmpKeySuggestBox = null;
		//depends if DB has initialized successfully 
		if(suggestOracle != null){
			TextBox keyBox = new TextBox();
			DefaultSuggestionDisplay suggestionsDisplay = new DefaultSuggestionDisplay();
			suggestionsDisplay.setAnimationEnabled(true);
			_tmpKeySuggestBox = new SuggestBox(suggestOracle, keyBox, suggestionsDisplay);
		} else {
			_tmpKeySuggestBox = new SuggestBox();
		}
		final SuggestBox keySuggestBox = _tmpKeySuggestBox;
		
		keySuggestBox.addSelectionHandler(new SelectionHandler<SuggestOracle.Suggestion>() {
			@Override
			public void onSelection(SelectionEvent<SuggestOracle.Suggestion> event) {
				provideHeaderSupport(keySuggestBox, valueBox);
				updateRaw();
			}
		});
		
		InlineLabel removeButton = new InlineLabel("x");
		final FormInputs inputsListItem = new FormInputs(keySuggestBox,valueBox);
		formInputs.add(inputsListItem);
		
		if(key != null){
			keySuggestBox.setValue(key);
		}
		if(value != null){
			valueBox.setValue(value);
		}
		
		keySuggestBox.getElement().setAttribute("placeholder", "key");
		valueBox.getElement().setAttribute("placeholder", "value");
		
		keySuggestBox.addStyleName(appStyle.formKeyInput());
		valueBox.addStyleName(appStyle.formValueInput());
		removeButton.addStyleName(appStyle.removeButton());
		
		removeButton.setTitle("Remove");
		
		
		keySuggestBox.addValueChangeHandler(formRowChange);
		valueBox.addValueChangeHandler(formRowChange);
		
		InlineLabel hint = new InlineLabel();
		hint.addStyleName(style.headerSupportHint());
		final FlowPanel keyContainer = new FlowPanel();
		keyContainer.add(keySuggestBox);
		keyContainer.add(hint);
		keyContainer.addStyleName(style.keyBoxContainer());
		
		row.add(keyContainer);
		row.add(valueBox);
		row.add(removeButton);
		headersFormPanel.add(row);
		
		hint.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				final int left = event.getClientX() + 10;
	            final int top = event.getClientY() + 10;
	            showHint(left, top, keySuggestBox.getValue());
			}
		});
		
		removeButton.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				formInputs.remove(inputsListItem);
				row.removeFromParent();
				updateRaw();
			}
		});
		
		if(key != null && !key.isEmpty()){
			provideHeaderSupport(keySuggestBox, valueBox);
		}
		
		keySuggestBox.getElement().focus();
	}
	
	
	private void showHint(final int left, final int top, final String forValue){
		store.getHeaders(forValue, "request" , new StoreResultCallback<List<HeaderRow>>() {
			@Override
			public void onSuccess(List<HeaderRow> result) {
				if(result == null || result.size() == 0){
					return;
				} else {
					HeaderRow v = null;
					for(HeaderRow row : result){
						if(row.getName().equals(forValue)){
							v = row;
							break;
						}
					}
					if(v == null){
						return;
					}
					String expl = "<span class=\""+style.headerDesc()+"\">";
					expl += v.getDesc();
					expl += "</span><br/><span class=\""+style.headerExample()+"\">";
					expl += v.getExample()+"</span>";
					
					DecoratedPopupPanel simplePopup = new DecoratedPopupPanel(true);
				    simplePopup.setWidth("300px");
				    simplePopup.addStyleName( style.headersDescPopup() );
			        simplePopup.setPopupPosition(left, top);
			        simplePopup.add( new HTML(expl) );
			        simplePopup.show();
				}
			}
			
			@Override
			public void onError(Throwable e) {
				
			}
		});
	}
	
	/**
	 * Add fill headers support if current header is supported.
	 * @param box 
	 */
	private void provideHeaderSupport(final SuggestBox value, TextBox box){
		store.getHeaders(value.getValue(), "request", new StoreResultCallback<List<HeaderRow>>() {

			@Override
			public void onSuccess(List<HeaderRow> result) {
				if(result == null || result.size() == 0){
					value.getElement().getParentElement().removeClassName(style.hasSupport()); //no support
				} else {
					for(HeaderRow row : result){
						if(row.getName().equals(value.getValue())){
							value.getElement().getParentElement().addClassName(style.hasSupport()); //has support
							//addHintClickHandler();
							break;
						}
					}
				}
			}

			@Override
			public void onError(Throwable e) {
				value.getElement().getParentElement().removeClassName(style.hasSupport()); //no support
			}
			
		});
		
		if(HeadersFillSupport.isSupported(value.getValue())){
			new HeadersFillSupport(value.getValue(), box);
		} else {
			HeadersFillSupport.removeSupport(box);
		}
		
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
