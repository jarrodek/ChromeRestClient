package com.kalicinscy.web.restclient.client.ui;

import java.util.LinkedHashMap;

import com.google.gwt.event.logical.shared.SelectionEvent;
import com.google.gwt.event.logical.shared.SelectionHandler;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.DecoratedTabPanel;
import com.google.gwt.user.client.ui.SimplePanel;
import com.google.gwt.user.client.ui.TextArea;
import com.kalicinscy.web.restclient.client.ConfigInit;
import com.kalicinscy.web.restclient.client.RestClient;
import com.kalicinscy.web.restclient.client.request.RequestDataFormatter;
import com.kalicinscy.web.restclient.client.storage.DatabaseSuggestOracle;

public class HeadersRow extends Composite {

	private final DynamicRequestForm dynamicRequestForm;
	private final TextArea autoResizeTextBox;

	public HeadersRow() {
		
		LinkedHashMap<String, String> currentHeaders = RestClient.REST_PARAMS.getHeaders();
		String rawHeaders = RestClient.REST_PARAMS.headersAsString();
		DecoratedTabPanel decoratedTabPanel = new DecoratedTabPanel();
		initWidget(decoratedTabPanel);
		decoratedTabPanel.setSize("100%", "");
		
		SimplePanel rawInputPanel = new SimplePanel();
		decoratedTabPanel.add(rawInputPanel, "Raw input", false);
		rawInputPanel.setSize("100%", "");
		
		autoResizeTextBox = new TextArea();
		autoResizeTextBox.setVisibleLines(5);
		rawInputPanel.setWidget(autoResizeTextBox);
		autoResizeTextBox.setSize("100%", "100%");
		
		if(rawHeaders!=null) {
			autoResizeTextBox.setText(rawHeaders);
		}
		
		SimplePanel formPanel = new SimplePanel();
		decoratedTabPanel.add(formPanel, "Form", false);
		formPanel.setSize("100%", "100%");
		
		DatabaseSuggestOracle oracle = new DatabaseSuggestOracle(ConfigInit.HEADERS_SERVICE,"HeadersNames");
		dynamicRequestForm = new DynamicRequestForm(oracle);
		if( currentHeaders != null && currentHeaders.size() > 0 ){
			dynamicRequestForm.setData(currentHeaders);
		}
		dynamicRequestForm.addRows(1);
		formPanel.setWidget(dynamicRequestForm);
		dynamicRequestForm.setSize("100%", "100%");
		
		dynamicRequestForm.addValueChangeHandler(new ValueChangeHandler<LinkedHashMap<String,String>>() {
			
			@Override
			public void onValueChange(ValueChangeEvent<LinkedHashMap<String, String>> event) {
				//
				// Update TextArea
				//
				String str = RequestDataFormatter.headersToString(event.getValue());
				autoResizeTextBox.setText(str);
				
				RestClient.REST_PARAMS.setHeaders( event.getValue(), false );
				RestClient.REST_PARAMS.store();
			}
			
		});
		
		autoResizeTextBox.addValueChangeHandler(new ValueChangeHandler<String>() {
			
			@Override
			public void onValueChange(ValueChangeEvent<String> event) {
				String str = event.getValue();
				LinkedHashMap<String, String> headers = RequestDataFormatter.parseHeaders(str);
				dynamicRequestForm.reset(headers);
				
				RestClient.REST_PARAMS.setHeaders( headers, false );
				RestClient.REST_PARAMS.store();
			}
			
		});
		
		int opened = RestClient.VIEW_PARAMS.getHeadersOpenedTab();
		decoratedTabPanel.selectTab(opened);
		decoratedTabPanel.addSelectionHandler(new SelectionHandler<Integer>() {
			
			@Override
			public void onSelection(SelectionEvent<Integer> event) {
				int opened = event.getSelectedItem();
				RestClient.VIEW_PARAMS.setHeadersOpenedTab(opened, true);
			}
		});
	}

	public void setHeaders(LinkedHashMap<String, String> headers) {
		dynamicRequestForm.reset(headers);
		String str = RequestDataFormatter.headersToString(headers);
		autoResizeTextBox.setText(str);
	}

}
