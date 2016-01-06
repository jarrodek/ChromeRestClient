package org.rest.client.ui.desktop.widget;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.Element;
import com.google.gwt.http.client.URL;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.Widget;

public class QueryDetailRow extends Composite {

	private static QueryDetailRowUiBinder uiBinder = GWT
			.create(QueryDetailRowUiBinder.class);

	interface QueryDetailRowUiBinder extends UiBinder<Widget, QueryDetailRow> {
	}
	
	@UiField Element removeButton;
	@UiField Element encodeButton;
	@UiField Element decodeButton;
	
	@UiField TextBox nameBox;
	@UiField TextBox valueBox;

	public QueryDetailRow(String paramnName, String paramValue) {
		initWidget(uiBinder.createAndBindUi(this));
		
		if(paramnName != null){
			nameBox.setValue(paramnName, false);
		}
		if(paramValue != null){
			valueBox.setValue(paramValue, false);
		}
		
		nameBox.getElement().setAttribute("placeholder", "name");
		valueBox.getElement().setAttribute("placeholder", "value");
		removeButton.setAttribute("data-remove-row", "true");
		encodeButton.setAttribute("data-encode-row", "true");
		decodeButton.setAttribute("data-decode-row", "true");
		
		nameBox.getElement().focus();
		
		observeButtons(this);
	}
	
	public String getKeyValue(){
		return nameBox.getValue();
	}
	
	public String getValue(){
		return valueBox.getValue();
	}
	
	void removeWidget(){
		this.removeFromParent();
	}
	
	void encodeValue(boolean isCtrl){
		String value = getValue();
		if(value.trim().isEmpty()) return;
		
		if(isCtrl){
			value = URL.encodePathSegment(value);
		} else {
			value = URL.encodeQueryString(value);
		}
		valueBox.setValue(value, true);
	}
	
	void decodeValue(boolean isCtrl){
		String value = getValue();
		if(value.trim().isEmpty()) return;
		
		if(isCtrl){
			value = URL.decodePathSegment(value);
		} else {
			value = URL.decodeQueryString(value);
		}
		valueBox.setValue(value, true);
	}
	
	@Override
	protected void onDetach() {
		super.onDetach();
		nativeDetach(this);
	}
	
	/**
	 * Detach all function that has been attached to the DOM objects via JSNI.
	 * @param context
	 */
	private final native void nativeDetach(QueryDetailRow context) /*-{
		var listeners = context._detachListeners;
		if (!listeners) {
			return;
		}
		listeners.forEach(function(value) {
			value.element.removeEventListener(value.event, value.fn);
		});
		context._detachListeners = null;
	}-*/;
	
	private final native void observeButtons(QueryDetailRow context) /*-{
		var button = this.@org.rest.client.ui.desktop.widget.QueryDetailRow::removeButton;
		var enc = this.@org.rest.client.ui.desktop.widget.QueryDetailRow::encodeButton;
		var dec = this.@org.rest.client.ui.desktop.widget.QueryDetailRow::decodeButton;
		var remFn = $entry(function(e){
			context.@org.rest.client.ui.desktop.widget.QueryDetailRow::removeWidget()();
		});
		var encFn = $entry(function(e){
			var ctrl = e.ctrlKey || false;
			context.@org.rest.client.ui.desktop.widget.QueryDetailRow::encodeValue(Z)(ctrl);
		});
		var decFn = $entry(function(e){
			var ctrl = e.ctrlKey || false;
			context.@org.rest.client.ui.desktop.widget.QueryDetailRow::decodeValue(Z)(ctrl);
		});
		
		button.addEventListener('tap', remFn);
		enc.addEventListener('tap', encFn);
		dec.addEventListener('tap', decFn);
		
		var listeners = context._detachListeners;
		if (!listeners) {
			listeners = new Map();
		}
		listeners.set('remove', {
			element : button,
			fn : remFn,
			event : 'tap'
		});
		listeners.set('encode', {
			element : enc,
			fn : encFn,
			event : 'tap'
		});
		listeners.set('decode', {
			element : dec,
			fn : decFn,
			event : 'tap'
		});
		context._detachListeners = listeners;
	}-*/;
}
