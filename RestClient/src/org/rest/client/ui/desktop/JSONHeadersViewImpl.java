package org.rest.client.ui.desktop;

import org.rest.client.place.SettingsPlace;
import org.rest.client.ui.JSONHeadersView;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.KeyDownHandler;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.Anchor;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Grid;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.Widget;

public class JSONHeadersViewImpl extends Composite implements JSONHeadersView {
	
	private static AboutViewImplUiBinder uiBinder = GWT
			.create(AboutViewImplUiBinder.class);

	interface AboutViewImplUiBinder extends UiBinder<Widget, JSONHeadersViewImpl> {
	}
	
	
	@UiField Grid jsonHeadersList;
	@UiField Button addJSONHeader;
	@UiField TextBox newHeaderValue;
	private Presenter listener;
	
	public JSONHeadersViewImpl(){
		initWidget(uiBinder.createAndBindUi(this));
		newHeaderValue.addKeyDownHandler(new KeyDownHandler() {
			
			@Override
			public void onKeyDown(KeyDownEvent event) {
				if(event.getNativeKeyCode() == KeyCodes.KEY_ENTER){
					addJSONHeaderFromImput();
				}
			}
		});
	}
	
	@Override
	public void setPresenter(Presenter listener) {
		this.listener = listener;
	}

	@Override
	public void setHeadersList(String[] list) {
		jsonHeadersList.clear();
		jsonHeadersList.resizeColumns(2);
		jsonHeadersList.getCellFormatter().setWidth(0, 0, "200px");
		
		for(final String header : list){
			addJsonHeader(header);
		}
	}
	
	private void addJsonHeader(final String header){
		int i = jsonHeadersList.getRowCount();
		jsonHeadersList.resizeRows(i+1);
		
		Label headerLabel = new Label(header);
		Anchor a = new Anchor("remove");
		headerLabel.getElement().setAttribute("data-header", header);
		
		jsonHeadersList.setWidget(i, 0, headerLabel);
		jsonHeadersList.setWidget(i, 1, a);
		a.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				removeJsonHeader(header);
			}
		});
	}
	
	private void removeJsonHeader(final String header){
		int l = jsonHeadersList.getRowCount();
		for(int i=1; i<l; i++){
			Widget headerWidget = jsonHeadersList.getWidget(i, 0);
			String headerValue = headerWidget.getElement().getAttribute("data-header");
			if(headerValue == null || headerValue.trim().equals("")){
				continue;
			}
			if(headerValue.equals(header)){
				jsonHeadersList.removeRow(i);
				listener.removeHeader(headerValue);
				break;
			}
		}
	}
	
	
	private void addJSONHeaderFromImput(){
		String value = newHeaderValue.getText();
		if(value == null || value.trim().equals("")){
			newHeaderValue.getElement().focus();
			return;
		}
		value = value.toLowerCase();
		addJsonHeader(value);
		listener.addHeader(value);
		
	}
	
	
	@UiHandler("addJSONHeader")
	void onAddJsonHeaderButton(ClickEvent e){
		addJSONHeaderFromImput();
	}

	@Override
	public void onSavedHeader(String header) {
		String value = newHeaderValue.getText();
		if(value == null || value.trim().equals("")){
			return;
		}
		Log.debug("value: "+value+", header: "+header);
		value = value.toLowerCase();
		if(value.equals(header)){
			newHeaderValue.setValue(null);
		}
	}
	@UiHandler("backLink")
	void onBackToSettings(ClickEvent e){
		listener.goTo(new SettingsPlace("view"));
	}
}
