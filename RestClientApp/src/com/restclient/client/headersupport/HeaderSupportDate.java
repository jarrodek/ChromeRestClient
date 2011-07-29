package com.restclient.client.headersupport;

import java.util.Date;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.i18n.client.DateTimeFormat;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.datepicker.client.DatePicker;
import com.restclient.client.HeaderSupport;
import com.restclient.client.event.HeaderSupportSubmitEvent;
import com.restclient.client.html5.HTML5InputNumber;

public class HeaderSupportDate implements HeaderSupport {
	
	interface Binder extends UiBinder<DialogBox, HeaderSupportDate> {
		Binder BINDER = GWT.create(Binder.class);
	}
	@UiField DatePicker picker;
	
	@UiField HTML5InputNumber hrsValue;
	@UiField HTML5InputNumber minValue;
	@UiField HTML5InputNumber secValue;
	@UiField DialogBox dialog;
	@UiField Button okButton;
	@UiField Button cancelButton;
	@UiField Button setCurrent;
	
	private EventBus eventBus;
	
	public HeaderSupportDate(EventBus eventBus){
		
		this.eventBus = eventBus;
		Binder.BINDER.createAndBindUi(this);
		hrsValue.setMax(23);
		hrsValue.setMin(0);
		minValue.setMax(59);
		minValue.setMin(0);
		secValue.setMax(59);
		secValue.setMin(0);
		
		hrsValue.setValueBoundCheckerActive();
		minValue.setValueBoundCheckerActive();
		secValue.setValueBoundCheckerActive();
		
		
	}
	
	@Override
	public void setValue(String value) {
		
		if( value == null ){
			return;
		}
		String manualFormat = "EEE, dd MMM yyyy HH:mm:ss z";
		DateTimeFormat format = DateTimeFormat.getFormat( manualFormat );//PredefinedFormat.DATE_TIME_FULL
		try{
			Date d = format.parse(value);
			DateTimeFormat tmpFormat = DateTimeFormat.getFormat("HH");
			picker.setValue(d);
			picker.setCurrentMonth(d);
			
			String hrs = tmpFormat.format(d);
			hrsValue.setValue( hrs );
			tmpFormat = DateTimeFormat.getFormat("mm");
			minValue.setValue( tmpFormat.format(d) );
			tmpFormat = DateTimeFormat.getFormat("ss");
			secValue.setValue( tmpFormat.format(d) );
		} catch(IllegalArgumentException e){
			//e.printStackTrace();
		}
	}

	@Override
	public void openDialog() {
		dialog.show();
		dialog.center();
	}
	
	@UiHandler("cancelButton")
	void onDismiss(ClickEvent event) {
		dialog.hide();
	}
	@SuppressWarnings("deprecation")
	@UiHandler("okButton")
	void onAccept(ClickEvent event) {
		dialog.hide();
		
		
		Date d = picker.getValue();
		if( d == null ){
			return;
		}
		DateTimeFormat tmpFormat = DateTimeFormat.getFormat("EEE, dd MMM yyyy HH:mm:ss z");
		d.setHours( Integer.parseInt(hrsValue.getValue()) );
		d.setMinutes( Integer.parseInt(minValue.getValue()) );
		d.setSeconds( Integer.parseInt(secValue.getValue()) );
		
		eventBus.fireEventFromSource( new HeaderSupportSubmitEvent( tmpFormat.format(d) ), HeaderSupportDate.this );
	}
	@UiHandler("setCurrent")
	void onSetCurrent(ClickEvent event) {
		DateTimeFormat tmpFormat = DateTimeFormat.getFormat("HH");
		Date d = new Date();
		picker.setValue( d );
		picker.setCurrentMonth( d );
		hrsValue.setValue( tmpFormat.format(d) );
		tmpFormat = DateTimeFormat.getFormat("mm");
		minValue.setValue( tmpFormat.format(d) );
		tmpFormat = DateTimeFormat.getFormat("ss");
		secValue.setValue( tmpFormat.format(d) );
	}
	
}
