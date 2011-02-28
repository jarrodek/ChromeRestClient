package com.kalicinscy.web.restclient.client.ui;

import java.util.LinkedHashMap;

import com.google.gwt.event.dom.client.ChangeEvent;
import com.google.gwt.event.dom.client.ChangeHandler;
import com.google.gwt.event.logical.shared.SelectionEvent;
import com.google.gwt.event.logical.shared.SelectionHandler;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.DecoratedTabPanel;
import com.google.gwt.user.client.ui.SimplePanel;
import com.google.gwt.user.client.ui.TextArea;
import com.kalicinscy.web.restclient.client.RestClient;
import com.kalicinscy.web.restclient.client.api.HTML5FileUpload;
import com.kalicinscy.web.restclient.client.request.RequestDataFormatter;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.xhr2.client.FileList;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.HasVerticalAlignment;

public class PostDataRow extends Composite {
	private HTML5FileUpload fileUpload;
	private TextBox fileFieldName;
	private TextArea autoResizeTextBox;

	public PostDataRow() {
		
		String currentData = RestClient.REST_PARAMS.getData();
		LinkedHashMap<String, String> hashData = RequestDataFormatter.parseDataToHashMap(currentData);
		
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
		
		if(currentData!=null) {
			autoResizeTextBox.setText(currentData);
		}
		
		SimplePanel formPanel = new SimplePanel();
		decoratedTabPanel.add(formPanel, "Form", false);
		formPanel.setSize("100%", "100%");
		
		final DynamicRequestForm dynamicRequestForm = new DynamicRequestForm();
		if( hashData != null && hashData.size() > 0 ){
			dynamicRequestForm.setData(hashData);
		}
		dynamicRequestForm.addRows(1);
		formPanel.setWidget(dynamicRequestForm);
		dynamicRequestForm.setSize("100%", "100%");
		
		SimplePanel simplePanel = new SimplePanel();
		decoratedTabPanel.add(simplePanel, "File", false);
		simplePanel.setSize("100%", "100%");
		
		VerticalPanel verticalPanel = new VerticalPanel();
		simplePanel.setWidget(verticalPanel);
		verticalPanel.setSize("100%", "100%");
		
		Label lblFileObjectsWill = new Label("File objects will be added to Form Data");
		verticalPanel.add(lblFileObjectsWill);
		verticalPanel.setCellHeight(lblFileObjectsWill, "40");
		
		fileUpload = new HTML5FileUpload();
		fileUpload.setMultiple(true);
		fileUpload.addChangeHandler( new ChangeHandler() {
			@Override
			public void onChange(ChangeEvent event) {
				FileList list = fileUpload.getFiles();
				String fieldName = fileFieldName.getText();
				if( list.size() > 1 ){
					fieldName += "[]";
					fileFieldName.setText(fieldName);
				} else if( list.size() == 1 ) {
					if( fieldName.endsWith( "[]" ) ){
						fieldName = fieldName.substring(0, fieldName.lastIndexOf("[]"));
						fileFieldName.setText(fieldName);
					}
				}
				
				RestClient.REST_PARAMS.setFormFiles(list);
				RestClient.REST_PARAMS.setFileFieldName(fieldName);
			}
		});
		
		
		
		
		HorizontalPanel horizontalPanel = new HorizontalPanel();
		verticalPanel.add(horizontalPanel);
		horizontalPanel.setWidth("");
		
		Label lblFileFieldName = new Label("File field name");
		horizontalPanel.add(lblFileFieldName);
		horizontalPanel.setCellVerticalAlignment(lblFileFieldName, HasVerticalAlignment.ALIGN_MIDDLE);
		horizontalPanel.setCellWidth(lblFileFieldName, "120");
		
		fileFieldName = new TextBox();
		fileFieldName.setText("fileUpload");
		horizontalPanel.add(fileFieldName);
		fileFieldName.setWidth("220px");
		verticalPanel.add(fileUpload);
		
		
		fileFieldName.addValueChangeHandler( new ValueChangeHandler<String>() {
			@Override
			public void onValueChange(ValueChangeEvent<String> event) {
				RestClient.REST_PARAMS.setFileFieldName(fileFieldName.getText());
				RestClient.REST_PARAMS.store();
			}
		});
		
		dynamicRequestForm.addValueChangeHandler(new ValueChangeHandler<LinkedHashMap<String,String>>() {
			@Override
			public void onValueChange(ValueChangeEvent<LinkedHashMap<String, String>> event) {
				//
				// Update TextArea
				//
				String str = RequestDataFormatter.parseData(event.getValue());
				autoResizeTextBox.setText(str);
				
				RestClient.REST_PARAMS.setData(str, false);
				RestClient.REST_PARAMS.store();
			}
			
		});
		
		autoResizeTextBox.addValueChangeHandler(new ValueChangeHandler<String>() {
			
			@Override
			public void onValueChange(ValueChangeEvent<String> event) {
				String str = event.getValue();
				LinkedHashMap<String, String> data = RequestDataFormatter.parseDataToHashMap(str);
				dynamicRequestForm.reset(data);
				
				RestClient.REST_PARAMS.setData(str, false);
				RestClient.REST_PARAMS.store();
			}
			
		});
		
		int opened = RestClient.VIEW_PARAMS.getDataOpenedTab();
		decoratedTabPanel.selectTab(opened);
		decoratedTabPanel.addSelectionHandler(new SelectionHandler<Integer>() {
			
			@Override
			public void onSelection(SelectionEvent<Integer> event) {
				int opened = event.getSelectedItem();
				RestClient.VIEW_PARAMS.setDataOpenedTab(opened,true);
			}
			
		});
	}
	
	public void setPostData(String postData){
		autoResizeTextBox.setText( postData );
	}
	
}
