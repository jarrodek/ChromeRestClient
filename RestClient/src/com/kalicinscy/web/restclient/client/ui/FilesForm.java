package com.kalicinscy.web.restclient.client.ui;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.event.dom.client.ChangeEvent;
import com.google.gwt.event.dom.client.ChangeHandler;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.HasVerticalAlignment;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.SimplePanel;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.google.gwt.xhr2.client.FileList;
import com.kalicinscy.web.restclient.client.RestClient;
import com.kalicinscy.web.restclient.client.api.HTML5FileUpload;

public class FilesForm extends Composite {
	private VerticalPanel rowsPanel;
	
	private List<FilesObject> filesList = new ArrayList<FilesObject>();
	
	public static class FilesObject {
		private String name;
		private FileList files;
		public FilesObject(String name, FileList files){
			this.name = name;
			this.files = files;
		}
		/**
		 * @param name the name to set
		 */
		public void setName(String name) {
			this.name = name;
		}
		/**
		 * @return the name
		 */
		public String getName() {
			return name;
		}
		/**
		 * @param files the files to set
		 */
		public void setFiles(FileList files) {
			this.files = files;
		}
		/**
		 * @return the files
		 */
		public FileList getFiles() {
			return files;
		}
		
		@Override
		public boolean equals(Object obj) {
			if( !(obj instanceof FilesObject) ){
				return false;
			}
			return this.getFiles().equals( (((FilesObject) obj).getName()) );
		}
	}
	
	public FilesForm() {
		
		VerticalPanel verticalPanel = new VerticalPanel();
		initWidget(verticalPanel);
		
		Label lblFileObjectsWill = new Label("File objects will be added to Form Data");
		verticalPanel.add(lblFileObjectsWill);
		verticalPanel.setCellHeight(lblFileObjectsWill, "30");
		
		rowsPanel = new VerticalPanel();
		verticalPanel.add(rowsPanel);
		rowsPanel.setWidth("100%");
		
		SimplePanel simplePanel = new SimplePanel();
		verticalPanel.add(simplePanel);
		verticalPanel.setCellVerticalAlignment(simplePanel, HasVerticalAlignment.ALIGN_BOTTOM);
		verticalPanel.setCellHeight(simplePanel, "35px");
		
		Button btnAddAnotherFile = new Button("Add another file field");
		btnAddAnotherFile.addClickHandler(new ClickHandler() {
			public void onClick(ClickEvent event) {
				addFileRow();
			}
		});
		simplePanel.setWidget(btnAddAnotherFile);
		btnAddAnotherFile.setSize("100%", "100%");
		
		HTML encodingInfo = new HTML("Sending files data always overwrite form encoding to <strong>\"multipart/form-data\"</strong>");
		verticalPanel.add(encodingInfo);
		
		HTML rersistantInfo = new HTML("Files data are not restored on form load. It can't open file object without user interaction.");
		verticalPanel.add(rersistantInfo);
		
		addFileRow();
	}
	
	private void addFileRow(){
		
		VerticalPanel mainRowPanel = new VerticalPanel();
		mainRowPanel.setStyleName("file-add-row-table");
		mainRowPanel.setSpacing(4);
		mainRowPanel.setWidth("100%");
		
		HorizontalPanel fileNamePanel = new HorizontalPanel();
		mainRowPanel.add(fileNamePanel);
		fileNamePanel.setWidth("100%");
		
		Label lbl = new Label("File field name");
		fileNamePanel.add(lbl);
		fileNamePanel.setCellWidth(lbl, "100px");
		fileNamePanel.setCellVerticalAlignment(lbl, HasVerticalAlignment.ALIGN_MIDDLE);
		
		TextBox fieldNameTxt = new TextBox();
		fieldNameTxt.addValueChangeHandler(inputValueChange);
		
		String defaultText = "fileUpload";
		int cnt = rowsPanel.getWidgetCount();
		if( cnt != 0 ){
			defaultText += cnt+"";
		}
		
		fieldNameTxt.setText(defaultText);
		fileNamePanel.add(fieldNameTxt);
		fieldNameTxt.setWidth("330px");
		
		HorizontalPanel fileFldRow = new HorizontalPanel();
		mainRowPanel.add(fileFldRow);
		fileFldRow.setWidth("100%");
		
		HTML5FileUpload fileUpload = new HTML5FileUpload();
		fileUpload.addChangeHandler(changeChandler);
		fileUpload.setMultiple(true);
		fileFldRow.add(fileUpload);
		
		rowsPanel.add(mainRowPanel);
	}
	
	private ValueChangeHandler<String> inputValueChange = new ValueChangeHandler<String>(){

		@Override
		public void onValueChange(ValueChangeEvent<String> event) {
			String newValue = event.getValue();
			
			if( newValue.equals("") ){
				newValue = "empty";
			}
			
			TextBox fieldNameTxt = (TextBox) event.getSource();
			VerticalPanel mainRowPanel = (VerticalPanel) ((HorizontalPanel)fieldNameTxt.getParent()).getParent();
			HTML5FileUpload fileUpload = (HTML5FileUpload) ( (HorizontalPanel) mainRowPanel.getWidget(1)).getWidget(0);
			int index = rowsPanel.getWidgetIndex( mainRowPanel );
			FileList list = fileUpload.getFiles();
			
			if( index < filesList.size() ){
				FilesObject data = filesList.get(index);
				data.setName(newValue);
				data.setFiles(list);
				filesList.remove(index);
				filesList.add(index, data);
			}
			RestClient.REST_PARAMS.setFilesList(filesList);
			//dump();
		}
		
	};
	
	private ChangeHandler changeChandler = new ChangeHandler(){

		@Override
		public void onChange(ChangeEvent event) {
			HTML5FileUpload fileUpload = (HTML5FileUpload) event.getSource();
			VerticalPanel mainRowPanel = (VerticalPanel) fileUpload.getParent().getParent();
			TextBox fileFieldName = (TextBox)((HorizontalPanel)mainRowPanel.getWidget(0)).getWidget(1);
			String fieldName = fileFieldName.getText();
			
			if( fieldName.equals("") ){
				fieldName = "empty";
			}
			
			int index = rowsPanel.getWidgetIndex( mainRowPanel );
			FileList list = fileUpload.getFiles();
			if( list.size() > 1 ){
				if( !fieldName.endsWith( "[]" ) ){
					fieldName += "[]";
					fileFieldName.setText(fieldName);
				}
			} else if( list.size() == 1 ) {
				if( fieldName.endsWith( "[]" ) ){
					fieldName = fieldName.substring(0, fieldName.lastIndexOf("[]"));
					fileFieldName.setText(fieldName);
				}
			}
			
			FilesObject obj = new FilesObject(fieldName,list);
			
			if( index >= filesList.size() ){
				filesList.add(obj);
			} else {
				filesList.remove(index);
				filesList.add(index, obj);
			}
			RestClient.REST_PARAMS.setFilesList(filesList);
			//dump();
		}
	};

//	private void dump(){
//		Iterator<FilesObject> it = filesList.iterator();
//		Log.debug("=== Files dump: ==");
//		while(it.hasNext()){
//			
//			FilesObject el = it.next();
//			FileList list = el.getFiles();
//			Log.debug(el.getName()+": "+list.size()+" pcs");
//			
//		}
//	}
}
