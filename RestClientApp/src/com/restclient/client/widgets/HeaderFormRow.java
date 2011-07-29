package com.restclient.client.widgets;

import java.util.List;

import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.ListCallback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.MouseMoveEvent;
import com.google.gwt.event.dom.client.MouseMoveHandler;
import com.google.gwt.event.dom.client.MouseOutEvent;
import com.google.gwt.event.dom.client.MouseOutHandler;
import com.google.gwt.event.logical.shared.CloseEvent;
import com.google.gwt.event.logical.shared.CloseHandler;
import com.google.gwt.event.logical.shared.SelectionEvent;
import com.google.gwt.event.logical.shared.SelectionHandler;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.HandlerRegistration;
import com.google.gwt.resources.client.CssResource;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.Timer;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.DecoratedPopupPanel;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.PopupPanel;
import com.google.gwt.user.client.ui.SuggestBox;
import com.google.gwt.user.client.ui.SuggestOracle;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.Widget;
import com.google.gwt.user.client.ui.SuggestBox.DefaultSuggestionDisplay;
import com.google.gwt.user.client.ui.SuggestOracle.Suggestion;
import com.restclient.client.HeadersFillSupport;
import com.restclient.client.RestApp;
import com.restclient.client.event.HeaderChangeEvent;
import com.restclient.client.event.HeaderRowRemovedEvent;
import com.restclient.client.storage.HeaderRow;

public class HeaderFormRow extends Composite {

	interface Binder extends UiBinder<Widget, HeaderFormRow> {
	}
	
	interface HeaderStyle extends CssResource {
		String hasNoSupport();
		String headerDesc();
		String headerExample();
		String headersDescPopup();
	}
	
	private final EventBus eventBus;

	@UiField(provided = true)
	SuggestBox headerName;
	@UiField
	TextBox headerValue;
	@UiField
	Button removeBtn;
	@UiField HTML hintHandler;
	@UiField HeaderStyle style;
	
	private DefaultSuggestionDisplay suggestionsDisplay;
	private HeaderRow hintRow;
	Timer hintTimer = new Timer() {
		@Override
		public void run() {
			int left = hintHandler.getElement().getAbsoluteLeft() + 10;
			int top = hintHandler.getElement().getAbsoluteTop() + 10;
			showHintPopup(left, top);
		}
	};
	private boolean isHintShown = false;
	private HandlerRegistration handlerReg = null;
	
	public HeaderFormRow(EventBus eventBus, SuggestOracle oracle) {
		this.eventBus = eventBus;
		suggestionsDisplay = new DefaultSuggestionDisplay();
		suggestionsDisplay.setAnimationEnabled(true);
		
		headerName = new SuggestBox(oracle, new TextBox(), suggestionsDisplay);
		
		initWidget(GWT.<Binder> create(Binder.class).createAndBindUi(this));
		
		headerName.addValueChangeHandler(new ValueChangeHandler<String>() {
			@Override
			public void onValueChange(ValueChangeEvent<String> event) {
				if(suggestionsDisplay.isSuggestionListShowing()){
					return;
				}
				headerNameSuggestionCallback();
			}
		});
		headerName.addSelectionHandler(new SelectionHandler<SuggestOracle.Suggestion>() {
			@Override
			public void onSelection(SelectionEvent<Suggestion> event) {
				headerNameSuggestionCallback();
			}

		});
		headerValue.addValueChangeHandler(new ValueChangeHandler<String>() {
			@Override
			public void onValueChange(ValueChangeEvent<String> event) {
				HeaderFormRow.this.eventBus.fireEventFromSource(new HeaderChangeEvent(HeaderFormRow.this), HeaderFormRow.class);
			}
		});
		hintHandler.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				hintTimer.cancel();
			    int left = event.getClientX() + 10;
	            int top = event.getClientY() + 10;
				showHintPopup(left, top);
			}
		});
		hintHandler.addMouseMoveHandler( new MouseMoveHandler() {
			@Override
			public void onMouseMove(MouseMoveEvent event) {
				hintTimer.schedule(1500);
			}
		});
		hintHandler.addMouseOutHandler(new MouseOutHandler() {
			@Override
			public void onMouseOut(MouseOutEvent event) {
				hintTimer.cancel();
			}
		});
	}
	
	protected void headerNameSuggestionCallback() {
		HeaderFormRow.this.eventBus.fireEventFromSource(new HeaderChangeEvent(HeaderFormRow.this), HeaderFormRow.class);
		provideHeaderSupport();
	}
	
	private void provideHeaderSupport(){
		String value = headerName.getValue();
		hintRow = null;
		RestApp.HEADERS_SERVICE.getHeader(value, new ListCallback<HeaderRow>() {
			@Override
			public void onFailure(DataServiceException error) {
				headerName.getElement().getParentElement().addClassName( style.hasNoSupport() );
			}
			@Override
			public void onSuccess(List<HeaderRow> result) {
				if( result.size() == 0 ){
					headerName.getElement().getParentElement().addClassName( style.hasNoSupport() );
				} else {
					hintRow = result.get(0);
					headerName.getElement().getParentElement().removeClassName( style.hasNoSupport() );
					addHintClickHandler();
				}
			}
		});
		
		if(HeadersFillSupport.isSupported(value)){
			HeadersFillSupport support = new HeadersFillSupport(value, headerValue);
			support.addSupport(eventBus);
		} else {
			HeadersFillSupport.removeSupport(headerValue);
		}
	}
	
	private void addHintClickHandler(){
		if( hintRow == null ){
			return;
		}
		if( handlerReg != null ){
			handlerReg.removeHandler();
		}
		handlerReg = hintHandler.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
			    int left = event.getClientX() + 10;
	            int top = event.getClientY() + 10;
				showHintPopup(left, top);
			}
		});
	}
	
	private void showHintPopup(int left, int top){
		if( isHintShown ){
			return;
		}
		isHintShown = true;
		String expl = "<span class=\""+style.headerDesc()+"\">";
		expl += hintRow.getDesc();
		expl += "</span><br/><span class=\""+style.headerExample()+"\">";
		expl += hintRow.getExample()+"</span>";
		
		DecoratedPopupPanel simplePopup = new DecoratedPopupPanel(true);
	    simplePopup.setWidth("300px");
	    simplePopup.addStyleName( style.headersDescPopup() );
        simplePopup.setPopupPosition(left, top);
        simplePopup.add( new HTML(expl) );
        simplePopup.show();
        simplePopup.addCloseHandler(new CloseHandler<PopupPanel>() {
			@Override
			public void onClose(CloseEvent<PopupPanel> event) {
				isHintShown = false;
			}
		});
	}

	public void setHeaderName(String name){
		headerName.setValue(name);
		provideHeaderSupport();
	}
	public String getHeaderName(){
		return headerName.getValue();
	}
	public void setHeaderValue(String name){
		headerValue.setValue(name);
	}
	public String getHeaderValue(){
		return headerValue.getValue();
	}

	@UiHandler("removeBtn")
	void onClick(ClickEvent e) {
		removeRow();
	}

	private void removeRow() {
		this.removeFromParent();
		eventBus.fireEventFromSource(new HeaderRowRemovedEvent(HeaderFormRow.this), HeaderFormRow.class);
	}

	public void focusOnInput() {
		headerName.getElement().focus();
	}

}
