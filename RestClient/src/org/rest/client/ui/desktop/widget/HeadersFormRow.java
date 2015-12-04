/*******************************************************************************
 * Copyright 2015 Pawel Psztyc
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
/**
 *
 * RestClient 
 */
package org.rest.client.ui.desktop.widget;

import org.rest.client.event.HeaderBlurEvent;
import org.rest.client.event.HeaderRemoveEvent;
import org.rest.client.event.HeaderValueChangeEvent;
import org.rest.client.headerssupport.HeadersFillSupport;
import org.rest.client.suggestion.HeadersSuggestOracle;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.Element;
import com.google.gwt.event.dom.client.BlurEvent;
import com.google.gwt.event.dom.client.BlurHandler;
import com.google.gwt.event.logical.shared.SelectionEvent;
import com.google.gwt.event.logical.shared.SelectionHandler;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.HandlerManager;
import com.google.gwt.event.shared.HandlerRegistration;
import com.google.gwt.event.shared.HasHandlers;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.SuggestBox;
import com.google.gwt.user.client.ui.SuggestBox.DefaultSuggestionDisplay;
import com.google.gwt.user.client.ui.SuggestOracle;
import com.google.gwt.user.client.ui.SuggestOracle.Suggestion;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.Widget;

/**
 * HeadersFormRow is a wrapper for single headers form row.
 * Each headers line is consisted with two input fields: header name and header value.
 * Header name has GWT's suggestion support with standard and common header names.
 * Value fields - depending on header name - may have additional support for 
 * providing a value. See {@link HeadersFillSupport} for additional information. 
 * 
 * 
 * @author Pawel Psztyc
 *
 */
public class HeadersFormRow extends Composite implements SelectionHandler<SuggestOracle.Suggestion>, HasHandlers, ValueChangeHandler<String> {

	private static HeadersFormRowUiBinder uiBinder = GWT.create(HeadersFormRowUiBinder.class);

	interface HeadersFormRowUiBinder extends UiBinder<Widget, HeadersFormRow> {
	}
	
	/**
	 * Manage event handlers attached to this event.
	 * It's internal GWT event handling system.
	 */
	private HandlerManager handlerManager;
	/**
	 * Suggestions oracle.
	 */
	final HeadersSuggestOracle suggestOracle;
	
	/**
	 * Header value text box
	 */
	@UiField
	public TextBox valueBox;
	/**
	 * Header name text box.
	 */
	public SuggestBox nameBox;
	/**
	 * A panel where the header name text box will be placed after initialization.
	 */
	@UiField 
	HTMLPanel headerNamePanel;
	/**
	 * Button for handling remove action.
	 */
	@UiField
	Element removeButton;
	
	/**
	 * Construct headers form inputs row.
	 * 
	 * @param suggestOracle An oracle to provide headers name suggestions.
	 */
	public HeadersFormRow(HeadersSuggestOracle suggestOracle) {
		this(suggestOracle, null, null);
	}
	
	/**
	 * Construct headers form inputs row.
	 *  
	 * @param suggestOracle An oracle to provide headers name suggestions.
	 * @param name Default name for header. May be null.
	 * @param name Default value for header. May be null.
	 * @param value
	 */
	public HeadersFormRow(HeadersSuggestOracle suggestOracle, String name, String value) {
		initWidget(uiBinder.createAndBindUi(this));
		
		this.suggestOracle = suggestOracle;
		handlerManager = new HandlerManager(this);
		
		//TODO: make it initialize in next event loop
		nameBox = getSuggestBox();
		nameBox.addSelectionHandler(this);
		headerNamePanel.add(nameBox);
		
		if(name != null){
			nameBox.setValue(name);
		}
		if(value != null){
			valueBox.setValue(value);
		}
		
		nameBox.getElement().setAttribute("placeholder", "name");
		valueBox.getElement().setAttribute("placeholder", "value");
		
		if(name != null && !name.isEmpty()){
			provideHeadersSupport();
		}
		nameBox.addValueChangeHandler(this);
		valueBox.addValueChangeHandler(this);
		valueBox.addBlurHandler(headerInputBlurHandler);
		nameBox.addDomHandler(headerInputBlurHandler, BlurEvent.getType());
	}
	/**
	 * Generate suggestion box - a text field with suggestions.
	 * @return SuggestBox with headers autocomplete support.
	 */
	private SuggestBox getSuggestBox(){
		SuggestBox suggestBox = null;
		//depends if DB has initialized successfully 
		if(suggestOracle != null){
			try{
				DefaultSuggestionDisplay suggestionsDisplay = new DefaultSuggestionDisplay();
				suggestionsDisplay.setAnimationEnabled(true);
				suggestBox = new SuggestBox(suggestOracle, new TextBox(), suggestionsDisplay);
			} catch(Exception e){
				suggestBox = new SuggestBox();
			}
		} else {
			suggestBox = new SuggestBox();
		}
		return suggestBox;
	}
	
	/**
	 * Handler for selecting a value in headerName selection box.
	 * Two things should happen when selection is made:
	 * - it should attach headers support (autocomplete)
	 * - parent widget should update "raw" headers string.
	 * To handle last case it will need to send an event to inform about change.
	 *  
	 * @param event
	 */
	@Override
	public void onSelection(SelectionEvent<Suggestion> event) {
		provideHeadersSupport();
		fireChangeEvent();
	}
	/**
	 * Called when any text field value changed.
	 * It should send an event to event listeners to inform 
	 * about the change.
	 */
	@Override
	public void onValueChange(ValueChangeEvent<String> event) {
		fireChangeEvent();
	}
	/**
	 * Fire change event to the listeners when any value has changed. 
	 */
	private void fireChangeEvent(){
		HeaderValueChangeEvent event = new HeaderValueChangeEvent();
		fireEvent(event);
	}
	
	/**
	 * Fire an event to the listeners when this widget should be removed.
	 */
	private void fireRemoveEvent(){
		HeaderRemoveEvent event = new HeaderRemoveEvent();
		fireEvent(event);
	}
	
	/**
	 * Attach headers fill support helper if this header have additional support.
	 * For example Authorization header has additional support for providing 
	 * basic and OAuth v1 values and all headers which require date value will 
	 * have calendar helper.
	 * 
	 * @see {@link HeadersFillSupport} for more information.
	 */
	private void provideHeadersSupport(){
		String currentValue = nameBox.getValue();
		if(HeadersFillSupport.isSupported(currentValue)){
			new HeadersFillSupport(currentValue, valueBox);
		} else {
			HeadersFillSupport.removeSupport(valueBox);
		}
	}
	
	@Override
	public void fireEvent(GwtEvent<?> event) {
		handlerManager.fireEvent(event);
	}
	
	/**
	 * Attach change handler to this widget.
	 * It will be called every time when form values change.
	 * @param handler A function to be called.
	 * @return Hendler registration.
	 */
	public HandlerRegistration addChangeHandler(HeaderValueChangeEvent.Handler handler){
		return handlerManager.addHandler(HeaderValueChangeEvent.TYPE, handler);
	}
	/**
	 * Attach remove handler to this widget.
	 * Widget will not remove itself. Need to be removed by it's parent.
	 * @param handler A function to be called.
	 * @return 
	 */
	public HandlerRegistration addRemoveHandler(HeaderRemoveEvent.Handler handler){
		return handlerManager.addHandler(HeaderRemoveEvent.TYPE, handler);
	}
	/**
	 * Attach blur handler to this widget.
	 * Blur will be fired when input control loose focus.
	 * 
	 * @param headerBlurHandler
	 */
	public HandlerRegistration addBlurHandler(HeaderBlurEvent.Handler handler) {
		return handlerManager.addHandler(HeaderBlurEvent.TYPE, handler);
	}
	
	/**
	 * Delete button is now paper-button. There's no support for paper-elements in GWT.
	 * Event handlers must be attached via JSNI.
	 */
	private final native void observeDelete(HeadersFormRow context) /*-{
		var button = this.@org.rest.client.ui.desktop.widget.HeadersFormRow::removeButton;
		if(!button) {
			return;
		}
		this._observeFn = $entry(function(e){
			context.@org.rest.client.ui.desktop.widget.HeadersFormRow::fireRemoveEvent()();
		});
		button.addEventListener('tap', this._observeFn);
	}-*/;
	
	/**
	 * Detach click listeners from widgets.
	 */
	private final native void deleteObservers() /*-{
		var button = this.@org.rest.client.ui.desktop.widget.HeadersFormRow::removeButton;
		if(!this._observeFn || !button){
			return;
		}
		button.removeEventListener('tap', this._observeFn);
	}-*/;
	
	/**
	 * This handler will be called when registered input fields loose focus.
	 * It should send an event to parent widget to inform about this so
	 * it may auto add next form row if necessary.  
	 */
	BlurHandler headerInputBlurHandler = new BlurHandler() {
		
		@Override
		public void onBlur(BlurEvent event) {
			HeaderBlurEvent e = new HeaderBlurEvent();
			fireEvent(e);
		}
	};
	
	
	
	@Override
	protected void onAttach() {
		super.onAttach();
		observeDelete(this);
	}
	
	@Override
	protected void onDetach() {
		super.onDetach();
		deleteObservers();
	}

	
}
