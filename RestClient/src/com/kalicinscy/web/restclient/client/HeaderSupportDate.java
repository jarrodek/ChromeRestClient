package com.kalicinscy.web.restclient.client;

import com.google.gwt.event.logical.shared.CloseEvent;
import com.google.gwt.event.logical.shared.CloseHandler;
import com.google.gwt.event.logical.shared.HasValueChangeHandlers;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.HandlerManager;
import com.google.gwt.event.shared.HandlerRegistration;
import com.google.gwt.event.shared.HasHandlers;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.PopupPanel;
import com.kalicinscy.web.restclient.client.ui.FillDateTimeHelper;

public class HeaderSupportDate implements HeaderSupport, HasHandlers,
		HasValueChangeHandlers<String> {
	DialogBox dialog = new DialogBox();
	private HandlerManager handlerManager = new HandlerManager(this);
	private String value = null;
	
	public HeaderSupportDate(){
		this.value = null;
	}
	
	@Override
	public void fireEvent(GwtEvent<?> event) {
		handlerManager.fireEvent(event);
	}

	@Override
	public void setValue(String value) {
		this.value = value;
	}

	@Override
	public void openDialog() {
		dialog.setHTML("Set HTTP-date header value");
		
		final FillDateTimeHelper view = new FillDateTimeHelper(dialog);
		view.setDateTime(value);
		
		dialog.addCloseHandler( new CloseHandler<PopupPanel>() {
			@Override
			public void onClose(CloseEvent<PopupPanel> event) {
				if( !event.isAutoClosed() ){
					value = view.getResult();
					notyfiValueChanged();
				}
			}
		});
		
		dialog.setWidget( view );
		dialog.center();
		dialog.show();
	}
	
	private void notyfiValueChanged(){
		ValueChangeEvent.fire(this, value);
	}

	@Override
	public HandlerRegistration addValueChangeHandler(
			ValueChangeHandler<String> handler) {
		return handlerManager.addHandler( ValueChangeEvent.getType(), handler );
	}

}
