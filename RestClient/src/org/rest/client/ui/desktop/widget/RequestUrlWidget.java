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
import java.util.Date;
import java.util.List;

import org.rest.client.RestClient;
import org.rest.client.event.RequestStartActionEvent;
import org.rest.client.event.URLFieldToggleEvent;
import org.rest.client.event.UrlValueChangeEvent;
import org.rest.client.request.URLParser;
import org.rest.client.request.URLParser.QueryParam;
import org.rest.client.resources.AppResources;
import org.rest.client.storage.store.UrlHistoryStoreWebSql;
import org.rest.client.suggestion.UrlsSuggestOracle;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.KeyDownHandler;
import com.google.gwt.event.logical.shared.AttachEvent;
import com.google.gwt.event.logical.shared.SelectionEvent;
import com.google.gwt.event.logical.shared.SelectionHandler;
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
import com.google.gwt.user.client.ui.SuggestBox;
import com.google.gwt.user.client.ui.SuggestBox.DefaultSuggestionDisplay;
import com.google.gwt.user.client.ui.SuggestOracle;
import com.google.gwt.user.client.ui.SuggestOracle.Suggestion;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.Widget;
import com.google.web.bindery.event.shared.EventBus;

/**
 * 
 * @author Paweł Psztyć
 *
 */
public class RequestUrlWidget extends Composite implements HasText {
	interface Binder extends UiBinder<Widget, RequestUrlWidget> {
	}
	interface WidgetStyle extends CssResource {
		
	}
	
	class UrlsSuggestionDisplay extends DefaultSuggestionDisplay {
		@Override
		public boolean isAnimationEnabled() {
			return false;
		}
	}
	
	@UiField(provided=true) SuggestBox urlField;
	@UiField TextBox detailedHostField;
	@UiField TextBox detailedPathField;
	@UiField TextBox detailedHashField;
	@UiField HTMLPanel paramsContainer;
	@UiField DivElement detailedPanel;
	@UiField InlineLabel toggleView;
	@UiField WidgetStyle style;
	
	final private EventBus eventBus;
	final private ArrayList<QueryDetailRow> queryParamsList = new ArrayList<QueryDetailRow>();
	private Date lastEnterTime;
	private UrlsSuggestionDisplay suggestionsDisplay;
	private UrlsSuggestOracle suggestOracle;
	
	public RequestUrlWidget(final EventBus eventBus) {
		this.eventBus = eventBus;
		
		UrlHistoryStoreWebSql historyStore = RestClient.getClientFactory().getUrlHistoryStore();
		
		//create URL simple field (suggestion box)
		suggestOracle = new UrlsSuggestOracle(historyStore);
		suggestionsDisplay = new UrlsSuggestionDisplay();
		suggestionsDisplay.setAnimationEnabled(false);
		urlField = new SuggestBox(suggestOracle, new TextBox(), suggestionsDisplay);
		urlField.getElement().setAttribute("placeholder", "URL");
		
		//init widget
		initWidget(GWT.<Binder> create(Binder.class).createAndBindUi(this));
		
		
		urlField.addValueChangeHandler(new ValueChangeHandler<String>() {
			@Override
			public void onValueChange(ValueChangeEvent<String> event) {
				if(suggestionsDisplay.isSuggestionListShowing()){
					return;
				}
				eventBus.fireEvent(new UrlValueChangeEvent(event.getValue()));
			}
		});
		urlField.addKeyDownHandler(anyValueKeyDownHandler);
		urlField.addSelectionHandler(new SelectionHandler<SuggestOracle.Suggestion>() {
			@Override
			public void onSelection(SelectionEvent<Suggestion> event) {
				suggestionCallback();
			}
		});
		
		detailedHostField.addKeyDownHandler(anyValueKeyDownHandler);
		detailedPathField.addKeyDownHandler(anyValueKeyDownHandler);
		detailedHashField.addKeyDownHandler(anyValueKeyDownHandler);
		
		detailedHostField.getElement().setAttribute("placeholder", "HOST");
		detailedPathField.getElement().setAttribute("placeholder", "PATH");
		detailedHashField.getElement().setAttribute("placeholder", "HASH");
		
		detailedHostField.addValueChangeHandler(anyValueChangeHandler);
		detailedPathField.addValueChangeHandler(anyValueChangeHandler);
		detailedHashField.addValueChangeHandler(anyValueChangeHandler);
	}
	
	
	private void suggestionCallback() {
		String url = urlField.getValue();
		eventBus.fireEvent(new UrlValueChangeEvent(url));
	}
	
	public void clearAll(){
		urlField.setValue(null);
		detailedHostField.setValue(null);
		detailedPathField.setValue(null);
		detailedHashField.setValue(null);
		clearForm();
		eventBus.fireEvent(new UrlValueChangeEvent(null));
	}
	
	@UiHandler("addParam")
	void onAddParam(ClickEvent e){
		e.preventDefault();
		addDetailedQueryParamRow(null, null);
	}
	
	@UiHandler("toggleView")
	void onToggleView(ClickEvent e){
		e.preventDefault();
		boolean isNowSimpleView = true;
		if(detailedPanel.getClassName().contains("hidden")){
			detailedPanel.removeClassName("hidden");
			urlField.setVisible(false);
			toggleView.removeStyleName(AppResources.INSTANCE.appCss().handlerImageClosed());
			toggleView.addStyleName(AppResources.INSTANCE.appCss().handlerImageOpened());
			
			updateQueryForm();
			ensureQueryFormHasRow();
			isNowSimpleView = false;
		} else {
			detailedPanel.addClassName("hidden");
			urlField.setVisible(true);
			toggleView.addStyleName(AppResources.INSTANCE.appCss().handlerImageClosed());
			toggleView.removeStyleName(AppResources.INSTANCE.appCss().handlerImageOpened());
		}
		
		eventBus.fireEvent(new URLFieldToggleEvent(isNowSimpleView));
	}
	
	ValueChangeHandler<String> anyValueChangeHandler = new ValueChangeHandler<String>() {
		@Override
		public void onValueChange(ValueChangeEvent<String> event) {
			updateURL();
		}
	};
	KeyDownHandler anyValueKeyDownHandler = new KeyDownHandler() {
		@Override
		public void onKeyDown(KeyDownEvent event) {
			if (event.getNativeKeyCode() == KeyCodes.KEY_ENTER) {
				performEnterKeyAction();
			}
		}
	};
	
	/**
	 * Perform action when ENTER key is pressed
	 */
	private void performEnterKeyAction(){
		if (suggestionsDisplay.isSuggestionListShowing()){
			return;
		}
		if( lastEnterTime != null ){
			Date c = new Date();
			long delta = c.getTime()-lastEnterTime.getTime();
			if( delta < 1000 ){
				return;
			}
		}
		
		lastEnterTime = new Date();
		RequestStartActionEvent e = new RequestStartActionEvent(lastEnterTime);
		eventBus.fireEvent(e);
	}
	
	
	/**
	 * Add new key-value pair for query parameters
	 */
	private void addDetailedQueryParamRow(String key, String value){
		
		TextBox keyBox = new TextBox();
		TextBox valueBox = new TextBox();
		
		keyBox.addValueChangeHandler(anyValueChangeHandler);
		valueBox.addValueChangeHandler(anyValueChangeHandler);
		keyBox.addKeyDownHandler(anyValueKeyDownHandler);
		valueBox.addKeyDownHandler(anyValueKeyDownHandler);
		
		final QueryDetailRow row = new QueryDetailRow(keyBox, valueBox, new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				updateURL();
			}
		});
		paramsContainer.add(row);
		
		if(key != null){
			keyBox.setValue(key);
		}
		if(value != null){
			valueBox.setValue(value);
		}
		queryParamsList.add(row);
		row.asWidget().addAttachHandler(new AttachEvent.Handler() {
			@Override
			public void onAttachOrDetach(AttachEvent event) {
				queryParamsList.remove(row);
			}
		});
	}
	
	/**
	 * Ensure that form has at least one row.
	 */
	void ensureQueryFormHasRow(){
		if(paramsContainer.getWidgetCount() > 0) return;
		addDetailedQueryParamRow(null, null);
	}
	/**
	 * Clear form values
	 */
	void clearForm(){
		paramsContainer.clear();
		queryParamsList.clear();
		detailedHostField.setValue(null);
		detailedPathField.setValue(null);
		detailedHashField.setValue(null);
	}
	/**
	 * Get current headers value and fill up form.
	 */
	void updateQueryForm(){
		clearForm();
		
		//parse given path and place it to proper fields
		URLParser data = new URLParser().parse(urlField.getValue());
		String protocol = data.getProtocol();
		String authority = data.getAuthority();
		String hostField = "";
		if(!(protocol == null || authority == null || protocol.isEmpty() && authority.isEmpty())){
			if(!protocol.isEmpty()){
				hostField = data.getProtocol() + "://";
			}
			hostField += data.getAuthority();
		}
		detailedHostField.setValue(hostField);
		detailedPathField.setValue(data.getPath());
		detailedHashField.setValue(data.getAnchor());
		
		List<QueryParam> params = data.getParamsList();
		int paramsSize = params.size();
		for(int i=0; i<paramsSize; i++){
			QueryParam param = params.get(i);
			String key = param.getKey();
			if(key == null || key.trim().isEmpty()){
				continue;
			}
			addDetailedQueryParamRow(param.getKey(), param.getValue());
		}
	}
	
	void updateURL(){
		String url = getDetailedAsValue();
		urlField.setValue(url);
		eventBus.fireEvent(new UrlValueChangeEvent(url));
	}
	
	
	private String getDetailedAsValue() {
		String url = detailedHostField.getValue();
		if(url.endsWith("/")){ //trim last "/"
			url = url.substring(0, url.length()-1);
		}
		
		String path = detailedPathField.getValue();
		if(!path.trim().isEmpty() && !path.startsWith("/")){
			path = "/"+path;
		}
		
		url += path;
		int paramsSize = queryParamsList.size();
		if(paramsSize > 0){
			url += "?";
		}
		for(int i=0; i<paramsSize; i++){
			if(i>0){
				url += "&";
			}
			QueryDetailRow fi = queryParamsList.get(i);
			url += fi.getKeyValue() + "="+ fi.getValue(); 
		}
		
		String hash = detailedHashField.getValue();
		if(hash != null && !hash.trim().isEmpty()){
			url += "#"+hash;
		}
		
		return url;
	}
	/**
	 * @return current URL value
	 */
	@Override
	public String getText() {
		return urlField.getValue();
	}
	/**
	 * Sets URL value
	 */
	@Override
	public void setText(String text) {
		urlField.setValue(text);
		eventBus.fireEvent(new UrlValueChangeEvent(text));
		updateQueryForm();
	}
}
