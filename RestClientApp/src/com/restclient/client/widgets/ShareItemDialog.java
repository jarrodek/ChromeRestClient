package com.restclient.client.widgets;

import java.util.List;

import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.ListCallback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.dom.client.Style.Display;
import com.google.gwt.uibinder.client.LazyDomElement;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.DecoratedPopupPanel;
import com.google.gwt.user.client.ui.TextBox;
import com.restclient.client.DataExport;
import com.restclient.client.DataExportImpl;
import com.restclient.client.RestApp;
import com.restclient.client.StatusNotification;
import com.restclient.client.request.ApplicationSession;
import com.restclient.client.request.ApplicationSessionCallback;
import com.restclient.client.request.PingRequest;
import com.restclient.client.storage.ExportedDataInsertItem;
import com.restclient.client.storage.ExportedDataItem;
import com.restclient.client.storage.RestForm;
/**
 * TODO: event when user click "cancel" button
 * @author Paweł Psztyć
 *
 */
public class ShareItemDialog {

	interface Binder extends UiBinder<DecoratedPopupPanel, ShareItemDialog> {
		Binder BINDER = GWT.create(Binder.class);
	}

	@UiField DecoratedPopupPanel dialog;
	@UiField LazyDomElement<DivElement> loader;
	@UiField LazyDomElement<DivElement> data;
	@UiField TextBox link;

	private final RestForm item;
	
	public ShareItemDialog(RestForm item) {
		this.item = item;
		Binder.BINDER.createAndBindUi(this);
		processData();
	}

	private void processData(){
		RestApp.EXPORT_DATA_SERVICE.findFormByReferenceId(item.getId(), new ListCallback<ExportedDataItem>() {
			@Override
			public void onFailure(DataServiceException error) {
				dialog.hide();
				StatusNotification.notify("An error occured :( " + error.getMessage(),StatusNotification.TYPE_ERROR, StatusNotification.TIME_MEDIUM);
			}
			@Override
			public void onSuccess(final List<ExportedDataItem> result) {
				if(result.size() == 0){
					//create new item on server side.
					//First check if user is connected to application.
					requestForSessionAndCreateItem();
				} else {
					//item is already on server.
					//don't need session. create url based on item key
					ExportedDataItem item = result.get(0);
					createAndShowUrl(item.getAppEngineKey());
				}
			}
		});
	}
	
	private void createAndShowUrl(String gaeKey){
		link.setValue(gaeKey);
		loader.get().removeFromParent();
		data.get().getStyle().setDisplay(Display.BLOCK);
		dialog.center();
		link.selectAll();
	}
	
	private void requestForSessionAndCreateItem(){
		PingRequest.getSession(new ApplicationSessionCallback() {
			
			@Override
			public void onSuccess(ApplicationSession session) {
				if(session.getState() == ApplicationSession.CONNECTED){
					exportItemAndShow(session.getUserId());
				} else {
					StatusNotification.notify("You are not connected to application server. Go to Options -> Import/export and connect to application.",StatusNotification.TYPE_ERROR, StatusNotification.TIME_MEDIUM);
				}
			}
			
			@Override
			public void onFailure(String message, Throwable exception) {
				dialog.hide();
				StatusNotification.notify("An error occured while checking application service connection :( " + (exception != null ? exception.getMessage() : "" ),StatusNotification.TYPE_ERROR, StatusNotification.TIME_MEDIUM);
			}
		});
	}
	
	private void exportItemAndShow(String userId){
		DataExportImpl impl = new DataExportImpl();
		impl.exportItem(item, new DataExport.ExportItemCallback() {
			
			@Override
			public void onSuccess(ExportedDataInsertItem item) {
				createAndShowUrl(item.getGaeKey());
			}
			
			@Override
			public void onFailure(String message) {
				dialog.hide();
				StatusNotification.notify(message,StatusNotification.TYPE_ERROR, StatusNotification.TIME_MEDIUM);
			}
		});
	}
	
	public void show() {
		dialog.show();
		dialog.center();
	}
	/**
	 * Set popup position
	 * @param left
	 * @param top
	 */
	public void setPopupPosition(int left, int top) {
		dialog.setPopupPosition(left, top);
	}
}
