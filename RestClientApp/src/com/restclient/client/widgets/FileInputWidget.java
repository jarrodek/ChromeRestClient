package com.restclient.client.widgets;

import java.util.ArrayList;
import java.util.List;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.Widget;
import com.restclient.client.event.FileRowChangeEvent;
import com.restclient.client.event.FileRowRemovedEvent;
import com.restclient.client.event.FilesChangeEvent;
import com.restclient.client.storage.FilesObject;
/**
 * Request file input form.
 * @author Paweł Psztyć
 *
 */
public class FileInputWidget extends Composite {

	interface Binder extends UiBinder<Widget, FileInputWidget> {
	}

	private final EventBus eventBus;

	@UiField HTMLPanel addPanel;
	@UiField HTMLPanel buttonPanel;
	@UiField Button addRow;
	private List<FileInputRow> files = new ArrayList<FileInputRow>();
	
	public FileInputWidget(EventBus eventBus) {
		this.eventBus = eventBus;
		initWidget(GWT.<Binder> create(Binder.class).createAndBindUi(this));
		
		addRow.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				addRow();
			}
		});
		addRow();		
		FileRowChangeEvent.register(eventBus, new FileRowChangeEvent.Handler() {
			@Override
			public void onChange(FileInputRow row, Object source) {
				List<FilesObject> filesList = new ArrayList<FilesObject>();
				for( FileInputRow r : files ){
					if( r.equals(row) ){
						r = row;
					}
					FilesObject fo = new FilesObject(r.getFileName(), r.getFiles());
					filesList.add(fo);
				}
				FileInputWidget.this.eventBus.fireEventFromSource(new FilesChangeEvent(filesList), FileInputWidget.class);
			}
		});
		FileRowRemovedEvent.register(eventBus, new FileRowRemovedEvent.Handler() {
			@Override
			public void onRemove(FileInputRow row) {
				
				for(FileInputRow _row : files){
					if(_row.equals(row)){
						files.remove(_row);
						break;
					}
				}
				
				addPanel.remove(row);
				
				//notify about changes
				List<FilesObject> filesList = new ArrayList<FilesObject>();
				for(FileInputRow r : files){
					Log.debug("Has file object to notify: "+r.getFileName());
					FilesObject fo = new FilesObject(r.getFileName(), r.getFiles());
					filesList.add(fo);
				}
				FileInputWidget.this.eventBus.fireEventFromSource(new FilesChangeEvent(filesList), FileInputWidget.class);
			}
		});
	}

	private void addRow(){
		FileInputRow row = new FileInputRow(eventBus);
		if(files.size() > 0){
			row.setText(files.size()+"");
		}
		addPanel.add(row);
		files.add(row);
	}
}
