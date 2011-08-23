package com.restclient.client.widgets;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.KeyDownHandler;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.http.client.URL;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.restclient.client.event.UrlChangeEvent;

public class GETParamsEditorDialog {
	interface Binder extends UiBinder<DialogBox, GETParamsEditorDialog> {
		Binder BINDER = GWT.create(Binder.class);
	}

	@UiField DialogBox dialog;
	@UiField Button addRow;
	@UiField HTMLPanel addPanel;
	private final EventBus eventBus;
	private List<GETParamFormRow> params = new ArrayList<GETParamFormRow>();
	private String rootURL = "";
	
	public GETParamsEditorDialog(EventBus eventBus, String initialValue) {
		this.eventBus = eventBus;
		Binder.BINDER.createAndBindUi(this);
		
		if( initialValue == null || initialValue.equals("") ){
			appendRow(null, null, false);
		} else {
			setParams(initialValue);
		}
		
		
		dialog.addDomHandler(new KeyDownHandler() {
			@Override
			public void onKeyDown(KeyDownEvent event) {
				int keyCode = event.getNativeKeyCode();
				if(keyCode == KeyCodes.KEY_ENTER){
					onSave(null);
				} else if( keyCode == KeyCodes.KEY_ESCAPE ){
					onDismiss(null);
				}
			}
		}, KeyDownEvent.getType());
	}
	
	/**
	 * Show dialog
	 */
	public void show() {
		dialog.show();
		dialog.center();
	}
	
	@UiHandler("addRow")
	void handleAppend(ClickEvent e) {
		appendRow(null, null, true);
	}
	/**
	 * Set current for value to new from string
	 * @param paramsString
	 */
	public void setParams(String paramsString) {
		params.clear();
		int cnt = addPanel.getWidgetCount();
		for( int i = 0; i < cnt; i++ ){
			addPanel.getWidget(i).removeFromParent();
		}
		
		if( paramsString == null || paramsString.equals("") ){
			appendRow(null, null, false);
			return;
		}
		
		int questionMarkPosition = paramsString.indexOf("?"); 
		if( questionMarkPosition == -1 ){
			rootURL = paramsString;
			appendRow(null, null, false);
			return;
		}
		rootURL = paramsString.substring(0, questionMarkPosition);
		paramsString = paramsString.substring(questionMarkPosition + 1);
		
		String[] chunk = paramsString.split("&");
		for( String param : chunk ){
			if( param == null || param.isEmpty() ){
				continue;
			}
			String[] paramAttr = param.split("=");
			if( paramAttr ==  null || paramAttr.length == 0 ){
				continue;
			}
			String key = paramAttr[0];
			String value = "";
			if( paramAttr.length > 1 ){
				value = paramAttr[1];
			}
			appendRow(key, value, false);
		}
	}
	
	private void appendRow(String key, String value, boolean focus){
		GETParamFormRow row = new GETParamFormRow();
		if( key != null ){
			row.setParamName(key);
		}
		if( value != null ){
			row.setParamValue(value);
		}
		addPanel.add(row);
		params.add(row);
		if( focus ){
			row.focusOnInput();
		}
	}
	
	@UiHandler("cancel")
	void onDismiss(ClickEvent event) {
		dialog.hide();
	}
	
	@UiHandler("save")
	void onSave(ClickEvent event) {
		int cnt = addPanel.getWidgetCount();
		String result = rootURL + "?";
		for( int i = 0; i < cnt; i++ ){
			GETParamFormRow row = (GETParamFormRow)addPanel.getWidget(i);
			String name = row.getParamName();
			String value = row.getParamValue();
			result += name + "=" + value;
			if( i + 1 != cnt)
				result += "&";
		}
		eventBus.fireEventFromSource(new UrlChangeEvent(result),
				GETParamsEditorDialog.class);

		dialog.hide();
	}
	@UiHandler("decode")
	void onDecode(ClickEvent event) {
		int cnt = addPanel.getWidgetCount();
		for( int i = 0; i < cnt; i++ ){
			GETParamFormRow row = (GETParamFormRow)addPanel.getWidget(i);
			String value = row.getParamValue();
			if( value != null && !value.isEmpty() ){
				value = URL.decodeQueryString(value);
			} else {
				value = "";
			}
			row.setParamValue(value);
			row.setEncoded(false);
		}
	}
	@UiHandler("encode")
	void onEncode(ClickEvent event) {
		int cnt = addPanel.getWidgetCount();
		for( int i = 0; i < cnt; i++ ){
			GETParamFormRow row = (GETParamFormRow)addPanel.getWidget(i);
			if( row.isEncoded() ){
				continue;
			}
			String value = row.getParamValue();
			if( value != null && !value.isEmpty() ){
				value = URL.encodeQueryString(value);
			} else {
				value = "";
			}
			row.setParamValue(value);
			row.setEncoded(true);
		}
	}
}
