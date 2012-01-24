package com.restclient.client.widgets;

import java.util.List;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.HandlerRegistration;
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
import com.restclient.client.Utils;

/**
 * Request POST/PUT entity body form row.
 * 
 * @author jarrod
 *
 */
public class JSONHeadersOptions extends Composite {
	/**
	 * Event fired on widget close.
	 * @author Paweł Psztyć
	 */
	public static class CloseJsonHeadersOptionsWidgetEvent extends GwtEvent<CloseJsonHeadersOptionsWidgetEvent.Handler>{
		public static final Type<Handler> TYPE = new Type<Handler>();
		/**
		 * Handles {@link CloseJsonHeadersOptionsWidgetEvent}.
		 */
		public interface Handler extends EventHandler {
			void onClose();
		}
		/**
		 * Register an handler for this event.
		 * @param eventBus
		 * @param handler
		 * @return
		 */
		public static HandlerRegistration register(EventBus eventBus,
				Handler handler) {
			return eventBus.addHandler(TYPE, handler);
		}
		@Override
		public com.google.gwt.event.shared.GwtEvent.Type<Handler> getAssociatedType() {
			return TYPE;
		}
		@Override
		protected void dispatch(CloseJsonHeadersOptionsWidgetEvent.Handler handler) {
			handler.onClose();
		}
	}
	
	
	interface Binder extends UiBinder<Widget, JSONHeadersOptions> {
	}

	private final EventBus eventBus;
	
	@UiField Grid jsonHeadersList;
	@UiField Button addJSONHeader;
	@UiField Button closeButton;
	@UiField TextBox newHeaderValue;
	
	public JSONHeadersOptions(EventBus eventBus) {
		this.eventBus = eventBus;
		initWidget(GWT.<Binder> create(Binder.class).createAndBindUi(this));
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
				List<String> headers = Utils.getJSONHeadersList();
				if(headers.contains(header)){
					headers.remove(header);
				}
				Utils.saveJSONHeadersList(headers);
				break;
			}
		}
	}
	
	@UiHandler("addJSONHeader")
	void onAddJsonHeaderButton(ClickEvent e){
		String value = newHeaderValue.getText();
		if(value == null || value.trim().equals("")){
			newHeaderValue.getElement().focus();
			return;
		}
		value = value.toLowerCase();
		addJsonHeader(value);
		List<String> headers = Utils.getJSONHeadersList();
		headers.add(value);
		Utils.saveJSONHeadersList(headers);
		newHeaderValue.setValue("");
	}
	
	@UiHandler("closeButton")
	void onClose(ClickEvent e){
		eventBus.fireEvent(new CloseJsonHeadersOptionsWidgetEvent());
	}

	public void onShow() {
		jsonHeadersList.clear();
		List<String> headers = Utils.getJSONHeadersList();
		jsonHeadersList.resizeColumns(2);
		jsonHeadersList.getCellFormatter().setWidth(0, 0, "200px");
		
		for(final String header : headers){
			addJsonHeader(header);
		}
	}
}
