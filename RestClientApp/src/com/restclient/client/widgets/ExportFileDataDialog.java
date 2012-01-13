package com.restclient.client.widgets;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.DragStartEvent;
import com.google.gwt.event.dom.client.DragStartHandler;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.KeyDownHandler;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.Anchor;
import com.google.gwt.user.client.ui.DialogBox;
import com.restclient.client.html5.HTML5Element;

public class ExportFileDataDialog {
	interface Binder extends UiBinder<DialogBox, ExportFileDataDialog> {
		Binder BINDER = GWT.create(Binder.class);
	}

	@UiField DialogBox dialog;
	@UiField Anchor anchorHandler;
	
	public ExportFileDataDialog() {
		Binder.BINDER.createAndBindUi(this);
		dialog.setAutoHideOnHistoryEventsEnabled(false);
		dialog.addDomHandler(new KeyDownHandler() {
			@Override
			public void onKeyDown(KeyDownEvent event) {
				int keyCode = event.getNativeKeyCode();
				if( keyCode == KeyCodes.KEY_ESCAPE ){
					onDismiss(null);
				}
			}
		}, KeyDownEvent.getType());
	}

	public void show(int left, int top) {
		dialog.show();
		dialog.setPopupPosition(left, top);
	}
	/**
	 * Sets data to download.
	 * This creates "data-downloadurl" attribute with passed data: "MIMETYPE:FILENAME:ABSOLUTE_URI_TO_FILE"
	 * @param mime
	 * @param fileName
	 * @param data
	 */
	public void setFileData(String mime, String fileName, String data){
		mime = "image/octet-stream";
		//final String downloadurl = mime + ":" + fileName + ":" + data;
		anchorHandler.setHref("#");
		HTML5Element el = ((HTML5Element)anchorHandler.getElement());
		//"data:image/octet-stream;"+
		final String downloadurl = data;
		el.putData("downloadurl", downloadurl);
		anchorHandler.addDragStartHandler(new DragStartHandler() {
			@Override
			public void onDragStart(DragStartEvent event) {
				//event.getDataTransfer().setData("DownloadURL", downloadurl);
				_test(downloadurl);
			}
		});
	}
	
	private final native void _test(String data)/*-{
		window.URL = window.URL || window.webkitURL;
	}-*/;
	
	@UiHandler("cancel")
	void onDismiss(ClickEvent event) {
		dialog.hide();
	}
}
