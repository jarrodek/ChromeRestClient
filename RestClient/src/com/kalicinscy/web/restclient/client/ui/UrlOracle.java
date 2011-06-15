package com.kalicinscy.web.restclient.client.ui;

import com.google.gwt.event.logical.shared.SelectionEvent;
import com.google.gwt.event.logical.shared.SelectionHandler;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.SuggestBox;
import com.google.gwt.user.client.ui.SuggestOracle;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.google.gwt.user.client.ui.SuggestOracle.Suggestion;
import com.kalicinscy.web.restclient.client.ConfigInit;
import com.kalicinscy.web.restclient.client.RestClient;
import com.kalicinscy.web.restclient.client.storage.DatabaseSuggestOracle;

public class UrlOracle extends Composite {
	/**
	 * URL field - main widget.
	 */
	private final SuggestBox urlField;
	private VerticalPanel panel;
	
	public UrlOracle() {
		
		DatabaseSuggestOracle formOracle = new DatabaseSuggestOracle(
				ConfigInit.URLS_SERVICE, "URLindex");
		urlField = new SuggestBox( formOracle );
		panel = new VerticalPanel();
		panel.add(urlField);
		
		String url = RestClient.REST_PARAMS.getUrl();
		if( url != null && !url.equals("null") ){
			urlField.setText( url );
		}
		
		this.urlField.addSelectionHandler( new SelectionHandler<SuggestOracle.Suggestion>() {

			@Override
			public void onSelection(SelectionEvent<Suggestion> event) {
				suggestionCallback();
			}
			
		});
		
		this.urlField.addValueChangeHandler(new ValueChangeHandler<String>() {
			@Override
			public void onValueChange(ValueChangeEvent<String> event) {
				suggestionCallback();
			}
		});
		
		initWidget(panel);
	}
	
	private void suggestionCallback(){
		if( getStyleName().contains("validate-error") ){
			removeStyleName("validate-error");
		}
		String value = urlField.getValue();
		RestClient.REST_PARAMS.setUrl(value, true);
	}
	
	
	public void setText(String txt){
		urlField.setText(txt);
	}
	
	public String getUrl(){
		return this.urlField.getText();
	}
	
	public void addValueChangeHandler(ValueChangeHandler<String> handler){
		this.urlField.addValueChangeHandler(handler);
	}
	@Override
	public void setWidth(String width){
		this.urlField.setWidth(width);
	}
	public void setParentWidth(String width){
		this.panel.setWidth(width);
	}
}
