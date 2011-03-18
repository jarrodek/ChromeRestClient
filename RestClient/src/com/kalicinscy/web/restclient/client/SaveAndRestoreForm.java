package com.kalicinscy.web.restclient.client;

import java.util.Date;
import java.util.List;

import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.RowIdListCallback;
import com.google.gwt.event.logical.shared.CloseEvent;
import com.google.gwt.event.logical.shared.CloseHandler;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.PopupPanel;
import com.kalicinscy.web.restclient.client.events.SaveAndRestoreFormHandler;
import com.kalicinscy.web.restclient.client.storage.RestForm;
import com.kalicinscy.web.restclient.client.ui.RestoreFormDialog;
import com.kalicinscy.web.restclient.client.ui.RestoreTableAsync;
import com.kalicinscy.web.restclient.client.ui.SaveFormStateDialog;

public class SaveAndRestoreForm implements SaveAndRestoreFormHandler {

	@Override
	public void onSaveAction() {
		final String url = RestClient.REST_PARAMS.getUrl();
		if(url.length() == 0){
			return;
		}
		final SaveFormStateDialog dialog = new SaveFormStateDialog();
		dialog.center();
		dialog.show();
		dialog.addCloseHandler(new CloseHandler<PopupPanel>() {
			@Override
			public void onClose(CloseEvent<PopupPanel> event) {
				String value = dialog.getNameValue();
				if( !value.trim().equals("") ){
					String config = RestClient.REST_PARAMS.toString();
					ConfigInit.FORM_SERVICE.insertData(value, url, config, new Date(), new RowIdListCallback() {
						@Override
						public void onFailure(DataServiceException error) {
							Window.alert("An error occured :( \nCurrent state has not been saved.");
						}
						@Override
						public void onSuccess(List<Integer> rowIds) {}
					});
				}
			}
		});
				
	}

	@Override
	public void onRestoreAction() {
		final RestoreFormDialog dialog = new RestoreFormDialog();
		dialog.center();
		dialog.show();
		
		RestoreTableAsync form = new RestoreTableAsync();
		dialog.addTable( form );
		dialog.setAutoHideEnabled(false);
		dialog.setAutoHideOnHistoryEventsEnabled(true);
		form.addSelectionHandler(new RestoreTableAsync.SelectionHandler() {
			@Override
			public void onSelect(RestForm data) {
				RestClient.REST_PARAMS.restoreFromSavedState(data);
				dialog.hide();
			}
		});
	}

}
