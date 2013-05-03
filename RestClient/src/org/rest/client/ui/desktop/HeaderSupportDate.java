package org.rest.client.ui.desktop;

import java.util.Date;

import org.rest.client.headerssupport.HeaderSupport;
import org.rest.client.ui.html5.HTML5InputNumber;

import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.i18n.client.DateTimeFormat;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.datepicker.client.DatePicker;

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
	
	private Callback<String, String> callback;
	
	public HeaderSupportDate(){
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
		DateTimeFormat tmpFormat = DateTimeFormat.getFormat("HH");
		String manualFormat = "EEE, dd MMM yyyy HH:mm:ss z";
		DateTimeFormat format = DateTimeFormat.getFormat(manualFormat);//PredefinedFormat.DATE_TIME_FULL
		Date d = null;
		if( value == null ){
			d = new Date();
		} else {
			try{
				d = format.parse(value);
			} catch(IllegalArgumentException e){
				d = new Date();
			}
		}
		
		picker.setValue(d);
		picker.setCurrentMonth(d);
		String hrs = tmpFormat.format(d);
		hrsValue.setValue( hrs );
		tmpFormat = DateTimeFormat.getFormat("mm");
		minValue.setValue( tmpFormat.format(d) );
		tmpFormat = DateTimeFormat.getFormat("ss");
		secValue.setValue( tmpFormat.format(d) );
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
		d.setSeconds(getSecondsValue());
		d.setHours(getHoursValue());
		d.setMinutes(getMinutesValue());

//		DateTimeFormat tmpFormat = DateTimeFormat.getFormat("EEE, dd MMM yyyy HH:mm:ss z");
		if(callback != null){
			callback.onSuccess(d.toGMTString());
			//callback.onSuccess(tmpFormat.format(d)); //,TimeZone.createTimeZone(0)
		}
	}
	
	private int getSecondsValue(){
		String _secValue = secValue.getValue();
		if(_secValue == null || _secValue.equals("")){
			_secValue = "0";
		}
		int seconds;
		try{
			seconds = Integer.parseInt(_secValue);
		} catch (NumberFormatException e) {
			seconds = 0;
		}
		return seconds;
	}
	private int getMinutesValue(){
		String _minValue = minValue.getValue();
		if(_minValue == null || _minValue.equals("")){
			_minValue = "0";
		}
		int minutes;
		try{
			minutes = Integer.parseInt(_minValue);
		} catch (NumberFormatException e) {
			minutes = 0;
		}
		return minutes;
	}
	private int getHoursValue(){
		String _hrsValue = hrsValue.getValue();
		if(_hrsValue == null || _hrsValue.equals("")){
			_hrsValue = "0";
		}
		int hours;
		try{
			hours = Integer.parseInt(_hrsValue);
		} catch (NumberFormatException e) {
			hours = 0;
		}
		return hours;
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

	@Override
	public void setOnResultHandler(Callback<String, String> callback) {
		this.callback = callback;
	}
	
}
