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

import org.rest.client.RestClient;
import org.rest.client.SyncAdapter;
import org.rest.client.analytics.GoogleAnalytics;
import org.rest.client.analytics.GoogleAnalyticsApp;
import org.rest.client.codemirror.CodeMirror;
import org.rest.client.codemirror.CodeMirrorChangeHandler;
import org.rest.client.codemirror.CodeMirrorImpl;
import org.rest.client.codemirror.CodeMirrorKeyMap;
import org.rest.client.codemirror.CodeMirrorOptions;
import org.rest.client.event.BoundaryChangeEvent;
import org.rest.client.event.HeaderBlurEvent;
import org.rest.client.event.HeaderRemoveEvent;
import org.rest.client.event.HeaderValueChangeEvent;
import org.rest.client.event.HttpEncodingChangeEvent;
import org.rest.client.log.Log;
import org.rest.client.request.RequestHeadersParser;
import org.rest.client.suggestion.HeadersSuggestOracle;
import org.rest.client.ui.html5.HTML5Element;

import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.Scheduler;
import com.google.gwt.core.client.Scheduler.ScheduledCommand;
import com.google.gwt.dom.client.DivElement;
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
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.HasText;
import com.google.gwt.user.client.ui.InlineLabel;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.TextArea;
import com.google.gwt.user.client.ui.Widget;
import com.google.gwt.xhr2.client.RequestHeader;
/**
 * Header widget provides two views for headers editor:
 * - raw - textarea with CodeMirror support
 * - form - a headers form where the user have additional headers fill support.
 * 
 * @author Pawel Psztyc
 *
 */
public class RequestHeadersWidget extends Composite implements HasText, HeaderValueChangeEvent.Handler {
	interface Binder extends UiBinder<Widget, RequestHeadersWidget> {
	}
	
	public enum TABS { RAW, FORM }
	
	@UiField InlineLabel rawTab; 
	@UiField InlineLabel formTab;
	@UiField DivElement tabContent;
	@UiField HTMLPanel headersFormPanel;
	@UiField TextArea headersRawInput;
	@UiField Label errorInfo;
	
	/**
	 * Currently opened tab.
	 */
	private TABS currentTab = TABS.RAW;
	/**
	 * Raw headers value.
	 */
	private String headersData = "";
	/**
	 * List of rows widgets attached to the view.
	 */
	private ArrayList<HeadersFormRow> rows = new ArrayList<HeadersFormRow>();
	/**
	 * Suggest oracle to provide suggestion support for 
	 * header name fields.
	 * It's created in parent widget so there won't be many instances of the same suggestion provider.
	 * Since user can only fill up one field theres no need to have many instances for every row.
	 */
	private HeadersSuggestOracle suggestOracle = null;
	/**
	 * CodeMirror library instance for headers raw editor.
	 */
	private CodeMirror headersCodeMirror = null;
	/**
	 * A category name for Google Analytics events.
	 * Event will measure how often tabs are switched by the user.
	 * It will help to decide if different editors are required.
	 */
	public final static String ANALYTICS_EVENT_CATEGORY = "Headers editor";
	
	/**
	 * Construct a new widget with headers editor.
	 * 
	 */
	public RequestHeadersWidget() {
		initWidget(GWT.<Binder> create(Binder.class).createAndBindUi(this));
		
		loadCodeMirrorForHeaders();
		
		//
		// Initialize Suggest Oracle for headers
		//
		suggestOracle = new HeadersSuggestOracle("request");
		headersRawInput.addKeyUpHandler(new KeyUpHandler() {
			@Override
			public void onKeyUp(KeyUpEvent event) {
				updateHeadersRawData(headersRawInput.getValue());
			}
		});
		
		headersRawInput.addValueChangeHandler(new ValueChangeHandler<String>() {
			
			@Override
			public void onValueChange(ValueChangeEvent<String> event) {
				String headers = event.getValue();
				if(!RequestHeadersParser.isValidHeaderString(headers)){
					errorInfo.setVisible(true);
				} else {
					errorInfo.setVisible(false);
				}
			}
		});
		
		
		rawTab.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				openRawTab();
			}
		});
		rawTab.addMouseOverHandler(new MouseOverHandler() {
			@Override
			public void onMouseOver(MouseOverEvent event) {
				HTML5Element tab = (HTML5Element) rawTab.getElement().cast();
				if(!tab.getClassList().contains("inlineButtonChecked"))
					tab.getClassList().add("inlineButtonHover");
			}
		});
		rawTab.addMouseOutHandler(new MouseOutHandler() {
			@Override
			public void onMouseOut(MouseOutEvent event) {
				HTML5Element tab = (HTML5Element) rawTab.getElement().cast();
				if(!tab.getClassList().contains("inlineButtonHover"))
					tab.getClassList().remove("inlineButtonHover");
			}
		});
		formTab.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				openFormTab();
			}

			
		});
		formTab.addMouseOverHandler(new MouseOverHandler() {
			@Override
			public void onMouseOver(MouseOverEvent event) {
				HTML5Element tab = (HTML5Element) formTab.getElement().cast();
				if(!tab.getClassList().contains("inlineButtonChecked"))
					tab.getClassList().add("inlineButtonHover");
			}
		});
		formTab.addMouseOutHandler(new MouseOutHandler() {
			@Override
			public void onMouseOut(MouseOutEvent event) {
				HTML5Element tab = (HTML5Element) formTab.getElement().cast();
				if(tab.getClassList().contains("inlineButtonHover"))
					tab.getClassList().remove("inlineButtonHover");
			}
		});
		
		
		
		BoundaryChangeEvent.register(RestClient.getClientFactory().getEventBus(), new BoundaryChangeEvent.Handler() {
			@Override
			public void onChange(String boundary) {
				ArrayList<RequestHeader> list = RequestHeadersParser.stringToHeaders(headersData);
				boolean found = false;
				for(RequestHeader header : list){
					if(header.getName().toLowerCase().equals("content-type")){
						header.setValue("multipart/form-data; boundary="+boundary);
						found = true;
						break;
					}
				}
				if(!found){
					list.add(new RequestHeader("Content-Type", "multipart/form-data; boundary="+boundary));
				}
				updateHeadersRawData(RequestHeadersParser.headersListToString(list));
				headersRawInput.setValue(headersData, true);
				
				if(currentTab.equals(TABS.FORM)){
					updateForm();
				}
			}
		});
	}
	
	private void openRawTab() {
		if(currentTab.equals(TABS.RAW)) return;
		
		String tabHandlercurrent = "inlineButtonChecked";
		String tabsContent = "tabsContent";
		String cssTabContent = "tabContent";
		String tabContentCurrent = "tabContentCurrent";
		
		HTML5Element tab = (HTML5Element) rawTab.getElement().cast();
		((HTML5Element)tab.getParentElement()).querySelector("."+tabHandlercurrent).getClassList().remove(tabHandlercurrent);
		tab.getClassList().add(tabHandlercurrent);
		
		HTML5Element contentParent = (HTML5Element) tabContent.getParentElement();
		contentParent.querySelector("." + tabsContent + " ." + cssTabContent + "." + tabContentCurrent).getClassList().remove(tabContentCurrent);
		contentParent.querySelector("." + tabsContent + " ." + cssTabContent + "[data-tab=\"raw\"]").getClassList().add(tabContentCurrent);
		
		currentTab = TABS.RAW;
		
		if(headersCodeMirror != null){
			headersCodeMirror.refresh();
		}
		GoogleAnalytics.sendEvent(ANALYTICS_EVENT_CATEGORY, "Tab switched", "Raw tab");
		GoogleAnalyticsApp.sendEvent(ANALYTICS_EVENT_CATEGORY, "Tab switched", "Raw tab");
	}
	
	private void openFormTab() {
		if(currentTab.equals(TABS.FORM)) return;
		
		updateForm();
		ensureFormHasRow();
		
		String tabHandlercurrent = "inlineButtonChecked";
		String tabsContent = "tabsContent";
		String cssTabContent = "tabContent";
		String tabContentCurrent = "tabContentCurrent";
		
		HTML5Element tab = (HTML5Element) formTab.getElement().cast();
		((HTML5Element)tab.getParentElement()).querySelector("."+tabHandlercurrent).getClassList().remove(tabHandlercurrent);
		tab.getClassList().add(tabHandlercurrent);
		
		HTML5Element contentParent = (HTML5Element) tabContent.getParentElement();
		contentParent.querySelector("." + tabsContent + " ." + cssTabContent + "." + tabContentCurrent).getClassList().remove(tabContentCurrent);
		contentParent.querySelector("." + tabsContent + " ." + cssTabContent + "[data-tab=\"form\"]").getClassList().add(tabContentCurrent);
        
		currentTab = TABS.FORM;
		GoogleAnalytics.sendEvent(ANALYTICS_EVENT_CATEGORY, "Tab switched", "Form tab");
		GoogleAnalyticsApp.sendEvent(ANALYTICS_EVENT_CATEGORY, "Tab switched", "Form tab");
	}
	
	
	public void setTabOpened(TABS tab){
		if(tab == null) return;
		if(tab.equals(TABS.FORM)){
			openFormTab();
		} else {
			openRawTab();
		}
	}
	
	/**
	 * Clear form editor with all data.
	 */
	public void clear(){
		//clear form panel
		headersFormPanel.clear();
		//clear form inputs list
		rows.clear();
		//clear current value
		updateHeadersRawData("");
		//clear raw input
		headersRawInput.setValue(null, true);
		
		if(headersCodeMirror != null){
			headersCodeMirror.setValue("");
		}
		loadCodeMirrorForHeaders();
	}
	
	/**
	 * Set raw headers data into textarea.
	 * If CodeMirror is running refresh it's instance.
	 * @param data
	 */
	private void updateHeadersRawData(final String data){
		headersData = data;
		
		if(headersCodeMirror != null){
			headersCodeMirror.setValue(data);
			Scheduler.get().scheduleDeferred(new ScheduledCommand() {
				@Override
				public void execute() {
					headersCodeMirror.refresh();
					if(RestClient.isDebug()){
						Log.info("Updated headers value: " + data);
					}
				}
			});
		}
		headersRawInput.setValue(headersData, true);
		rawEditorChanged(headersData);
	}
	
	/**
	 * A handler for add new row button click.
	 * @param e
	 */
	@UiHandler("addHeader")
	void onAddHeader(ClickEvent e){
		e.preventDefault();
		addRow(null, null);
	}
	
	/**
	 * Ad a new row with header name and header value fields.
	 * Header name is supported by GWT's suggestion mechanism. 
	 * Header values may have additional support while filling up the form.
	 * 
	 * @see {@link HeadersFormRow} form more details.
	 * 
	 * @param name
	 * @param value
	 */
	private void addRow(String name, String value){
		HeadersFormRow row = new HeadersFormRow(suggestOracle, name, value);
		headersFormPanel.add(row.asWidget());
		row.addChangeHandler(this);
		row.addRemoveHandler(removeHeaderRowHandler);
		row.addBlurHandler(headerBlurHandler);
		rows.add(row);
	}
	
	/**
	 * Get current headers value.
	 */
	@Override
	public String getText() {
		return headersData;
	}
	
	/**
	 * Set headers value for current editor.
	 */
	@Override
	public void setText(String text) {
		if(text == null) text = "";
		headersData = text;
		//propagate new value through widgets
		propagateCurrentHeaders();
	}
	/**
	 * Set new value in raw text box and in form at the same time.
	 * 
	 */
	void propagateCurrentHeaders(){
		updateHeadersRawData(headersData);
		updateForm();
	}
	/**
	 * Ensure that form has at least one row.
	 */
	void ensureFormHasRow(){
		if(headersFormPanel.getWidgetCount() > 0) {
			HeadersFormRow row = rows.get(rows.size()-1);
			String name = row.nameBox.getValue();
			String value = row.valueBox.getValue();
			if(!name.equals("") || !value.equals("")){
				addRow(null, null);				
			}
			return;
		}
		addRow(null, null);
	}
	/**
	 * Clear form values
	 */
	void clearForm(){
		headersFormPanel.clear();
		rows.clear();
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
			addRow(header.getName(), header.getValue());
		}
	}
	/**
	 * Update raw data after change in for editor.
	 */
	void updateRaw(){
		updateHeadersRawData("");
		ArrayList<RequestHeader> list = new ArrayList<RequestHeader>();
		for(HeadersFormRow row : rows){
			list.add(new RequestHeader(row.nameBox.getValue(), row.valueBox.getValue()));
		}
		updateHeadersRawData(RequestHeadersParser.headersListToString(list));
		headersRawInput.setValue(headersData, true);
	}
	
	/**
	 * Load CodeMirror library into editor.
	 * TODO: Switching off CodeMirror support will be removed in Q2 2016. Targeting for R8.
	 */
	private void loadCodeMirrorForHeaders() {
		if(SyncAdapter.codeMirrorHeaders){
			tabContent.addClassName("codeMirror");
			
			if(headersCodeMirror != null) {
				headersCodeMirror.refresh();
				return;
			}
			
			CodeMirrorOptions opt = CodeMirrorOptions.create();
			opt.setMode("message/http");
//			opt.setTheme("headers");
			opt.setAutoClearEmptyLines(true);
			opt.setLineWrapping(true);
			
			CodeMirrorKeyMap extraKey = CodeMirrorKeyMap.create();
			extraKey.add("Ctrl-Space", "autocompleteHeaders");
			opt.setExtraKeys(extraKey);
			
			setHeadersEditor();
			
			if(!(headersData == null || headersData.isEmpty())){
				opt.setValue(headersData);
			}
			headersCodeMirror = CodeMirror.fromTextArea(headersRawInput.getElement(), opt, new CodeMirrorChangeHandler() {
				@Override
				public void onChage() {
					headersData = headersCodeMirror.getValue();
					headersRawInput.setValue(headersData);
					Log.info("Code mirror change fired actually now::" + headersData);
				}
			});
			setHeadersEditorCallback(headersCodeMirror.getInstance());
			headersCodeMirror.refresh();
			//RestClient.fixChromeLayout();
		} else {
			if(headersCodeMirror != null){
				headersCodeMirror.toTextArea();
				headersCodeMirror = null;
			}
			tabContent.removeClassName("codeMirror");
		}
	}
	/**
	 * Replace textarea with CodeMirror instance.
	 */
	private final native void setHeadersEditor() /*-{
		$wnd.CodeMirror.commands = $wnd.CodeMirror.commands || {};
		$wnd.CodeMirror.commands.autocompleteHeaders = function(cm) {
			try{
            	$wnd.CodeMirror.showHint(cm, $wnd.CodeMirror.headersHint);
			} catch(e){}
        };
	}-*/;
	/**
	 * Attach change handler to CodeMirror instance and show hints.
	 * @param headersCodeMirror
	 */
	private final native void setHeadersEditorCallback(CodeMirrorImpl headersCodeMirror) /*-{
		var context = this;
		headersCodeMirror.on("change", function(cm, changeObj) {
			context.@org.rest.client.ui.desktop.widget.RequestHeadersWidget::rawEditorChanged(Ljava/lang/String;)(cm.getValue());
            if(changeObj.origin === "setValue" || changeObj.origin === undefined || (changeObj.origin === "+input" && changeObj.text[0] === "")){
                //do not show proposition on ENTER.
                return;
            }
            $wnd.CodeMirror.showHint(cm, $wnd.CodeMirror.headersHint, {
            	completeSingle: false
        	});
        });
        headersCodeMirror.on("header-key-selected", function(e){
        	var cat = @org.rest.client.ui.desktop.widget.RequestHeadersWidget::ANALYTICS_EVENT_CATEGORY;
        	@org.rest.client.analytics.GoogleAnalytics::sendEvent(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)(cat, "Code mirror", "Suggestion header name picked");
        	@org.rest.client.analytics.GoogleAnalyticsApp::sendEvent(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)(cat, "Code mirror", "Suggestion header name picked");
		});
		headersCodeMirror.on("header-value-selected", function(e){
        	var cat = @org.rest.client.ui.desktop.widget.RequestHeadersWidget::ANALYTICS_EVENT_CATEGORY;
        	@org.rest.client.analytics.GoogleAnalytics::sendEvent(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)(cat, "Code mirror", "Suggestion header value picked");
        	@org.rest.client.analytics.GoogleAnalyticsApp::sendEvent(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)(cat, "Code mirror", "Suggestion header value picked");
		});
	}-*/;
	
	/**
	 * A handler called when in form tab any form field value change.
	 * This should only update "raw" headers.
	 */
	@Override
	public void onHeaderValueChange(HeaderValueChangeEvent event) {
		updateRaw();
	}
	/**
	 * A handler called when child element want to be removed.
	 */
	HeaderRemoveEvent.Handler removeHeaderRowHandler = new HeaderRemoveEvent.Handler() {
		@Override
		public void onHeaderRemove(HeaderRemoveEvent event) {
			HeadersFormRow row = (HeadersFormRow)event.getSource();
			int index = rows.indexOf(row);
			if(index == -1) return;
			rows.remove(index);
			row.removeFromParent();
			updateRaw();
		}
	};
	/**
	 * A handler called when form field blur event fire.
	 * This should add additional empty field if last row is not empty.
	 */
	HeaderBlurEvent.Handler headerBlurHandler = new HeaderBlurEvent.Handler() {
		@Override
		public void onHeaderBlur(HeaderBlurEvent event) {
			ensureFormHasRow();
		}
	};
	String lastSendContentTypeChangeValue = null;
	/**
	 * A function to be called when any header change.
	 * This function should look for "Content-Type" header and fire content type change event when changed.
	 * @param key Header name
	 * @param value Header value
	 */
	void onHeaderChange(String key, String value) {
		if(key == null || key.isEmpty()){
			return;
		}
		if(key.trim().toLowerCase().equals("content-type")){
			if(value == null){
				value = "";
			}
			String ct = value;
			if(ct.indexOf(";") != -1) {
				ct = ct.substring(0, ct.indexOf(";"));
			}
			if((lastSendContentTypeChangeValue == null || lastSendContentTypeChangeValue.equals("null")) || 
					(lastSendContentTypeChangeValue != null && !lastSendContentTypeChangeValue.equals(ct))) {
				lastSendContentTypeChangeValue = ct;
				if(RestClient.isDebug()) {
					Log.info("Content-type changed to: ", ct);
				}
				RestClient.getClientFactory().getEventBus().fireEvent(
						new HttpEncodingChangeEvent(ct));
			}
		}
	}
	
	
	void rawEditorChanged(String value) {
		ArrayList<RequestHeader> list = RequestHeadersParser.stringToHeaders(value);
		for(RequestHeader header : list){
			onHeaderChange(header.getName(), header.getValue());
		}
	}
}
