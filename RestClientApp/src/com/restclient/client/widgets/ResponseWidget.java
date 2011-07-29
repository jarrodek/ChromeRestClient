package com.restclient.client.widgets;

import java.util.List;

import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.ListCallback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.dom.client.Document;
import com.google.gwt.dom.client.SpanElement;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.HandlerRegistration;
import com.google.gwt.resources.client.CssResource;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.Image;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.Widget;
import com.google.gwt.xhr2.client.Header;
import com.google.gwt.xhr2.client.Response;
import com.restclient.client.RestApp;
import com.restclient.client.event.RequestEndEvent;
import com.restclient.client.event.RequestStartEvent;
import com.restclient.client.storage.HeaderRow;
import com.restclient.client.storage.StatusCodeRow;

public class ResponseWidget extends Composite {

	interface Binder extends UiBinder<Widget, ResponseWidget> {}
	interface ResponseStyle extends CssResource {
		String error();
		String warning();
		String requestError();
	}
	private boolean success;
	private Response response;
	private long requestTime;
	
	@UiField SpanElement codeContainer;
	@UiField Image codeImage;
	@UiField SpanElement loadingTime;
	@UiField DivElement bodyContainer;
	@UiField HTMLPanel headersPanel;
	@UiField ResponseBody bodyResponse;
	@UiField ResponseStyle style;
	private HandlerRegistration codeTipImageHandler;
	
	public ResponseWidget(EventBus eventBus) {
		
		initWidget(GWT.<Binder> create(Binder.class).createAndBindUi(this));
		RequestStartEvent.register(eventBus, new RequestStartEvent.Handler() {
			@Override
			public void onRequestStart() {
				
				resetView();
			}
		});
		
		RequestEndEvent.register(eventBus, new RequestEndEvent.Handler() {
			@Override
			public void onResponse(boolean success, Response response, long requestTime) {
				ResponseWidget.this.success = success;
				ResponseWidget.this.response = response;
				ResponseWidget.this.requestTime = requestTime;
				loadResponse();
			}
		});		
	}
	
	private void resetView(){
		codeContainer.removeClassName( style.error() );
		codeContainer.removeClassName( style.warning() );
		headersPanel.clear();
		codeContainer.setInnerHTML("loading");
		codeImage.setVisible(false);
		if( codeTipImageHandler != null ){
			codeTipImageHandler.removeHandler();
		}
		loadingTime.setInnerText("---");
		bodyResponse.clearData();
	}
	
	private void loadResponse(){
		
		if( !success ){
			this.addStyleName(style.requestError());
		} else {
			this.removeStyleName( style.requestError() );
		}
		
		this.setVisible(true);
		
		//
		// Set status code
		//
		int code = response.getStatus();
		String msg = response.getStatusText();
		if( code >=500 || code == 0){
			codeContainer.addClassName(style.error());
		} else if( code >= 400 && code < 500 ){
			codeContainer.addClassName(style.warning());
		}
		String txt = "<strong>" + code + "</strong>";
		if (msg != null && !msg.equals("")) {
			txt += " " + msg;
		} else if (code == 0) {
			txt += " NO RESPONSE";
		}
		codeContainer.setInnerHTML(txt);
		codeImage.setVisible(true);
		codeTipImageHandler = codeImage.addClickHandler(statusCodeHintHandler);
		
		//
		// Set request time
		//
		loadingTime.setInnerText( String.valueOf( requestTime ) );
		
		//
		// Set headers
		//
		Header[] headers = response.getHeaders();
		if (headers == null || headers.length == 0 || code == 0) {
			Label info = new Label("Response does not contain any headers.");
			headersPanel.add(info);
		} else {
			fillHeders(headers);
		}
		//
		// Set response body
		//
		if(!success || code == 0){
			bodyResponse.setNoResponse();
		} else {
			String body = response.getResponseText();
			Document xml = response.getResponseXML();
			boolean isXML = false, isJSON = false;
			bodyResponse.setBody(body);
			
			if( xml != null ){
				isXML = true;
				bodyResponse.setXML(xml);
			}
			if( !isXML ){
				//check if response has JSON header:
				if( isJSONHeader(headers) ){
					bodyResponse.setJSON(true);
					isJSON = true;
				}
			}
			if( !isJSON && !isXML ){
				//just HTML
				bodyResponse.setParse(true);
			}
		}
		bodyResponse.createResponse();
	}
	
	private boolean isJSONHeader(Header[] headers){
		for (Header header : headers) {
			if (header == null) {
				continue;
			}
			String name = header.getName();
			if( name.toLowerCase().equals("content-type") ){
				String value = header.getValue().toLowerCase();
				if( value.contains("application/json") //RFC 4627
					|| value.contains("text/json") //historical
						)
				return true;
			}
		}
		return false;
	}
	
	private void fillHeders(Header[] headers){
		for (Header header : headers) {
			if (header == null) {
				continue;
			}
			String head = "", desc = "";
			
			if (header.getName() != null) {
				head += header.getName();
			}
			if (header.getValue() != null) {
				head += ": " + header.getValue();
			}
			
			desc = "<i>no info</i>";
			final HeaderLine line = new HeaderLine(head, null, desc, null);
			headersPanel.add(line);
			
			RestApp.HEADERS_SERVICE.getHeader(header.getName(), new ListCallback<HeaderRow>() {
				@Override
				public void onFailure(DataServiceException error) {}
				
				@Override
				public void onSuccess(List<HeaderRow> result) {
					if( result == null || result.size() == 0 ){
						return;
					}
					HeaderRow row = result.get(0);
					line.updateDesc( row.getDesc() );
					line.updateExample( row.getExample() );
					line.updateName( row.getName() );
				}
			});
		}
	}
	
	private ClickHandler statusCodeHintHandler = new ClickHandler() {
		@Override
		public void onClick(ClickEvent event) {
			final int responseCode = response.getStatus(); 
			if ( responseCode == 0) {
				StatusCodeInfo dialog = new StatusCodeInfo();
				dialog.setHTML("Status Code: " + responseCode);
				dialog.setInfoText("No response data.");
				dialog.center();
				dialog.show();
				return;
			}
			RestApp.STATUSES_SERVICE.getCode(responseCode,
					new ListCallback<StatusCodeRow>() {
						@Override
						public void onFailure(DataServiceException error) {}
						@Override
						public void onSuccess(List<StatusCodeRow> result) {
							if (result.size() == 0) {
								return;
							}
							StatusCodeRow code = result.get(0);
							StatusCodeInfo dialog = new StatusCodeInfo();
							dialog.setHTML("Status Code: " + responseCode);
							dialog.setInfoText(code.getDesc());
							dialog.center();
							dialog.show();
						}
					});
		}
	};
}
