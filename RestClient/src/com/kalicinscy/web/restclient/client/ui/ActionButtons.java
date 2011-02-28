package com.kalicinscy.web.restclient.client.ui;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.HandlerManager;
import com.google.gwt.event.shared.HandlerRegistration;
import com.google.gwt.event.shared.HasHandlers;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.HasHorizontalAlignment;
import com.google.gwt.user.client.ui.HasVerticalAlignment;
import com.google.gwt.user.client.ui.SimplePanel;
import com.kalicinscy.web.restclient.client.events.FormStateEvent;
import com.kalicinscy.web.restclient.client.events.FormStateEventHandler;

public class ActionButtons extends Composite implements HasHandlers {
	private HandlerManager handlerManager = new HandlerManager(this);
	private final Progress progress;
	private final Button btnClearForm;
	private final Button btnSendRequest;
	
	public ActionButtons() {
		
		HorizontalPanel horizontalPanel = new HorizontalPanel();
		initWidget(horizontalPanel);
		horizontalPanel.setWidth("100%");
		
		SimplePanel simplePanel = new SimplePanel();
		horizontalPanel.add(simplePanel);
		horizontalPanel.setCellVerticalAlignment(simplePanel, HasVerticalAlignment.ALIGN_MIDDLE);
		horizontalPanel.setCellHorizontalAlignment(simplePanel, HasHorizontalAlignment.ALIGN_RIGHT);
		
		progress = new Progress();
		simplePanel.setWidget(progress);
		horizontalPanel.setCellVerticalAlignment(progress, HasVerticalAlignment.ALIGN_MIDDLE);
		horizontalPanel.setCellHorizontalAlignment(progress, HasHorizontalAlignment.ALIGN_RIGHT);
		progress.setSize("130px", "20px");
		
		progress.setVisible(false);
		
		btnClearForm = new Button("Clear form");
		horizontalPanel.add(btnClearForm);
		horizontalPanel.setCellHorizontalAlignment(btnClearForm, HasHorizontalAlignment.ALIGN_RIGHT);
		horizontalPanel.setCellWidth(btnClearForm, "90");
		btnClearForm.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				notyfiResetClicked();
			}
		});
		btnSendRequest = new Button("Send request");
		horizontalPanel.add(btnSendRequest);
		horizontalPanel.setCellHorizontalAlignment(btnSendRequest, HasHorizontalAlignment.ALIGN_RIGHT);
		horizontalPanel.setCellWidth(btnSendRequest, "100");
		
		btnSendRequest.addClickHandler(new ClickHandler() {
			
			@Override
			public void onClick(ClickEvent event) {
				notyfiSendClicked();
			}
		});
		
	}
	
	
	@Override
	public void fireEvent(GwtEvent<?> event) {
		handlerManager.fireEvent(event);
	}
	
	HandlerRegistration addFormStateHandler(FormStateEventHandler handler){
		return handlerManager.addHandler( FormStateEvent.getType(), handler );
	}
	
	private void notyfiSendClicked(){
		FormStateEvent event = new FormStateEvent( FormStateEvent.EventType.ON_SEND );
		fireEvent(event);
	}
	private void notyfiResetClicked(){
		FormStateEvent event = new FormStateEvent( FormStateEvent.EventType.ON_RESET );
		fireEvent(event);
	}
	
	public void restoreButtonsState(){
		progress.setVisible(false);
		btnClearForm.setEnabled(true);
		btnSendRequest.setEnabled(true);
	}
	public void disableButtons(){
		progress.setVisible(true);
		btnClearForm.setEnabled(false);
		btnSendRequest.setEnabled(false);
	}
}
