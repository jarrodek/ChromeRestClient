package com.kalicinscy.web.restclient.client.ui;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.dom.client.SpanElement;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.HandlerManager;
import com.google.gwt.event.shared.HandlerRegistration;
import com.google.gwt.event.shared.HasHandlers;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;
import com.kalicinscy.web.restclient.client.events.FormStateEvent;
import com.kalicinscy.web.restclient.client.events.FormStateEventHandler;

public class ActionButtons extends Composite implements HasHandlers {
	private HandlerManager handlerManager = new HandlerManager(this);
	
	interface ActionButtonsBinder extends UiBinder<Widget, ActionButtons> {}
	private static ActionButtonsBinder uiBinder = GWT.create(ActionButtonsBinder.class);
	@UiField Progress requestProgress;
	@UiField Button clearForm;
	@UiField Button sendRequest;
	@UiField Progress uploadProgress;
	@UiField DivElement sendingDiv;
	@UiField DivElement receivingDiv;
	@UiField SpanElement sizeCounter;
	
	public ActionButtons() {
		initWidget(uiBinder.createAndBindUi(this));
		
		sendingDiv.addClassName( "hidden" );
		receivingDiv.addClassName( "hidden" );
		
		clearForm.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				notyfiResetClicked();
			}
		});
	}
	
	public void setUploadMax(long max){
		uploadProgress.setMax((int) max);
	}
	
	public void setUploadCurrent(long current){
		String value = roundUnits(current);
		sizeCounter.setInnerHTML( "(" + value + ")" );
		uploadProgress.setValue( (int) current );
	}
	
	private String roundUnits( long value /*bytes*/){
		float parse = (float) value;
		String[] units = new String[5];
		units[0] = "B";
		units[1] = "kB";
		units[2] = "MB";
		units[3] = "GB";
		units[4] = "TB";
		String result = "";
		int i = 0;
		while( true ){
			if( parse < 1024 ){
				String parsed = String.valueOf( parse );
				int dotPos = parsed.indexOf( "." );
				if( dotPos != -1 && dotPos+3 < parsed.length() ){
					parsed = parsed.substring(0,dotPos+3);
				}
				result = parsed + " " + units[i];
				break;
			}
			parse = parse/1024;
			i++;
		}
		return result;		
	}
	
	public void showUpload(){
		if(sendingDiv.getClassName().contains( "hidden" ))
			sendingDiv.removeClassName( "hidden" );
	}
	public void hideUpload(){
		if(!sendingDiv.getClassName().contains( "hidden" )){
			sendingDiv.addClassName( "hidden" );
		}
	}
	public void hideProgress(){
		if(!receivingDiv.getClassName().contains( "hidden" ))
			receivingDiv.addClassName( "hidden" );
	}
	public void showProgress(){
		if(receivingDiv.getClassName().contains( "hidden" ))
			receivingDiv.removeClassName( "hidden" );
	}
	
	@UiHandler("sendRequest")
	void handleClick(ClickEvent e) {
		notyfiSendClicked();
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
		sendingDiv.addClassName( "hidden" );
		receivingDiv.addClassName( "hidden" );
		clearForm.setEnabled(true);
		sendRequest.setEnabled(true);
	}
	public void disableButtons(){
		clearForm.setEnabled(false);
		sendRequest.setEnabled(false);
	}
}
