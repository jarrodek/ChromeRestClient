package com.restclient.client.widgets;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ChangeEvent;
import com.google.gwt.event.dom.client.ChangeHandler;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HasText;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.Widget;
import com.google.gwt.xhr2.client.FileList;
import com.restclient.client.event.FileRowChangeEvent;
import com.restclient.client.html5.HTML5FileUpload;
/**
 * Single input file field.
 * Each change to file or name filed will fire {@link FileRowChangeEvent} to notify about change.
 * @author Paweł Psztyć
 *
 */
public class FileInputRow extends Composite implements HasText, ChangeHandler {

	private static FileInputRowUiBinder uiBinder = GWT
			.create(FileInputRowUiBinder.class);

	interface FileInputRowUiBinder extends UiBinder<Widget, FileInputRow> {
	}

	@UiField TextBox formName;
	@UiField HTML5FileUpload fileObject;
	
	private final EventBus eventBus;
	/**
	 * Construct file form control.
	 * @param eventBus
	 */
	public FileInputRow(EventBus eventBus) {
		this.eventBus = eventBus;
		initWidget(uiBinder.createAndBindUi(this));
		this.setText(null);
		fileObject.addChangeHandler(this);
		formName.addChangeHandler(this);
	}
	/**
	 * Get files list from this filed
	 * @return
	 */
	public FileList getFiles(){
		return fileObject.getFiles();
	}
	/**
	 * Get file form name (entered by user)
	 * @return
	 */
	public String getFileName(){
		return formName.getValue();
	}
	
	
	@Override
	public String getText() {
		return this.formName.getText().substring(10);
	}

	@Override
	public void setText(String text) {
		if( text == null ){
			text = "";
		}
		this.formName.setValue("fileUpload"+text);
	}
	@Override
	public boolean equals(Object obj) {
		return formName.equals( ( (FileInputRow)obj ).getFileName() );
	}
	@Override
	public void onChange(ChangeEvent event) {
		eventBus.fireEvent(new FileRowChangeEvent(FileInputRow.this));
	}
}