/**
 * 
 */
package com.restclient.client.widgets;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.resources.client.CssResource;
import com.google.gwt.storage.client.Storage;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.CheckBox;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.Widget;
import com.restclient.client.CookieCapture;
import com.restclient.client.RestApp;
import com.restclient.client.html5.HTML5InputNumber;

/**
 * App options widget
 * @author Paweł Psztyć
 *
 */
public class OptionsWidget extends Composite {
	
	private static final Binder binder = GWT.create(Binder.class);
	interface Binder extends UiBinder<Widget, OptionsWidget>{}
	interface Style extends CssResource {
		String noLocalStorageLabel();
		String hidden();
	}
	
	@UiField CheckBox debug;
	@UiField CheckBox history;
	@UiField CheckBox cookie;
	
	@UiField HTMLPanel mainWidget;
	@UiField(provided=true) HTML5InputNumber historyCount;
	
	@UiField DivElement historyAmount;
	
	@UiField Style style;

	/**
	 * Constructor.
	 * @param eventBus 
	 */
	public OptionsWidget(EventBus eventBus) {
		
		historyCount = new HTML5InputNumber(0, 500, 1);
		initWidget(binder.createAndBindUi(this));
		
		final Storage storage = Storage.getLocalStorageIfSupported();
		if( storage == null ){
			Label info = new Label("Your browser does not support local storage. This options are unavailable.");
			info.setStyleName(style.noLocalStorageLabel());
			mainWidget.add(info);
			return;
		}
		String debugValue = storage.getItem( RestApp.StorageKeys.DEBUG_KEY );
		if( debugValue != null && debugValue.equals("true") ){
			debug.setValue(true);
		} else {
			debug.setValue(false);
		}
		debug.addValueChangeHandler( new ValueChangeHandler<Boolean>() {
			@Override
			public void onValueChange(ValueChangeEvent<Boolean> event) {
				String toSave = String.valueOf(event.getValue());
				storage.setItem(RestApp.StorageKeys.DEBUG_KEY, toSave);
				if( RestApp.isDebug() ){
					Log.debug( "Debug value changed. Current value is: " + toSave );
				}
			}
		});
		
		String historyValue = storage.getItem( RestApp.StorageKeys.HISTORY_KEY );
		String historyAmountValue = storage.getItem( RestApp.StorageKeys.HISTORY_AMOUNT );
		if( historyValue == null || historyValue.isEmpty() ){
			historyValue = "true";
		}
		if( historyAmountValue == null || historyAmountValue.isEmpty() ){
			historyAmountValue = "60";
		}
		int historyAmountIntValue = 60;
		try{
			historyAmountIntValue = Integer.parseInt( historyAmountValue );
		} catch( NumberFormatException e ){}
		
		if( historyValue.equals("true") ){
			historyAmount.removeClassName( style.hidden() );
			history.setValue(true);
		} else {
			historyAmount.addClassName( style.hidden() );
			history.setValue(false);
		}
		historyCount.setValue( historyAmountIntValue+"" );
		
		history.addValueChangeHandler( new ValueChangeHandler<Boolean>() {
			@Override
			public void onValueChange(ValueChangeEvent<Boolean> event) {
				boolean value = event.getValue();
				storage.setItem( RestApp.StorageKeys.HISTORY_KEY, String.valueOf(value) );
				if( RestApp.isDebug() ){
					Log.debug( "History value changed. Current value is: " + value );
				}
				if( value ){
					historyAmount.removeClassName( style.hidden() );
					history.setValue(true);
				} else {
					historyAmount.addClassName( style.hidden() );
					history.setValue(false);
				}
			}
		});
		historyCount.addValueChangeHandler( new ValueChangeHandler<String>() {
			@Override
			public void onValueChange(ValueChangeEvent<String> event) {
				storage.setItem( RestApp.StorageKeys.HISTORY_AMOUNT, event.getValue() );
				if( RestApp.isDebug() ){
					Log.debug( "History ammount value changed. Current value is: " + event.getValue() );
				}
			}
		});
		String cookiesValue = storage.getItem( RestApp.StorageKeys.COOKIES_CAPTURE );
		if( cookiesValue == null || cookiesValue.isEmpty() ){
			cookiesValue = "false";
		}
		if( cookiesValue.equals("true") ){
			cookie.setValue(true);
		}
		
		cookie.addValueChangeHandler(new ValueChangeHandler<Boolean>() {
			@Override
			public void onValueChange(ValueChangeEvent<Boolean> event) {
				boolean value = event.getValue();
				storage.setItem( RestApp.StorageKeys.COOKIES_CAPTURE, String.valueOf(value) );
				if( value ){
					CookieCapture.initialize();
				}
				if( RestApp.isDebug() ){
					Log.debug( "Cookies capture value changed. Current value is: " + value );
				}
			}
		});
	}
	
	@UiHandler("shortCutsButton")
	void onShortcutsButton(ClickEvent e){
		ShortcutsEditor dialog = new ShortcutsEditor();
		dialog.show();
	}
}
