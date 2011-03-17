package com.kalicinscy.web.restclient.client.ui;

import java.util.Date;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.i18n.client.DateTimeFormat;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.Widget;
import com.google.gwt.user.datepicker.client.DatePicker;
import com.kalicinscy.web.restclient.client.api.HTML5InputNumber;
import com.google.gwt.user.client.ui.Button;


public class FillDateTimeHelper extends Composite {

	interface FillDateTimeHelperBinder extends UiBinder<Widget, FillDateTimeHelper> {}
	private static FillDateTimeHelperBinder uiBinder = GWT.create(FillDateTimeHelperBinder.class);
	
	@UiField DatePicker picker;
	
	@UiField HTML5InputNumber hrsValue;
	@UiField HTML5InputNumber minValue;
	@UiField HTML5InputNumber secValue;
	@UiField Button okButton;
	@UiField Button cancelButton;
	@UiField Button setCurrent;
	
	DialogBox dialog;
	
	public FillDateTimeHelper(final DialogBox dialog) {
		this.dialog = dialog;
		initWidget(uiBinder.createAndBindUi(this));
		hrsValue.setMax(23);
		hrsValue.setMin(0);
		minValue.setMax(59);
		minValue.setMin(0);
		secValue.setMax(59);
		secValue.setMin(0);
		
		hrsValue.setValueBoundCheckerActive();
		minValue.setValueBoundCheckerActive();
		secValue.setValueBoundCheckerActive();
		
		cancelButton.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				dialog.hide(true);
			}
		});
		
		okButton.addClickHandler( new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				dialog.hide(false);
			}
		});
		
		setCurrent.addClickHandler( new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
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
		});
	}
	
	public void setDateTime(String value){
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

	@SuppressWarnings("deprecation")
	public String getResult() {
		Date d = picker.getValue();
		if( d == null ){
			return null;
		}
		DateTimeFormat tmpFormat = DateTimeFormat.getFormat("EEE, dd MMM yyyy HH:mm:ss z");
		d.setHours( Integer.parseInt(hrsValue.getValue()) );
		d.setMinutes( Integer.parseInt(minValue.getValue()) );
		d.setSeconds( Integer.parseInt(secValue.getValue()) );
		return tmpFormat.format(d);
	}
}
