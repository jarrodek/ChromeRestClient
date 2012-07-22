/*******************************************************************************
 * Copyright 2012 Paweł Psztyć
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
package org.rest.client.ui.desktop;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.rest.client.RestClient;
import org.rest.client.storage.websql.HeaderRow;
import org.rest.client.storage.websql.StatusCodeRow;
import org.rest.client.ui.ResponseView;
import org.rest.client.ui.desktop.widget.ResponseHeaderLine;
import org.rest.client.ui.desktop.widget.StatusCodeInfo;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.Document;
import com.google.gwt.dom.client.SpanElement;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.resources.client.CssResource;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.Image;
import com.google.gwt.user.client.ui.Widget;
import com.google.gwt.xhr2.client.Header;
import com.google.gwt.xhr2.client.Response;

public class ResponseViewImpl extends Composite implements ResponseView {
	private static ResponseViewImplUiBinder uiBinder = GWT
			.create(ResponseViewImplUiBinder.class);

	interface ResponseViewImplUiBinder extends UiBinder<Widget, ResponseViewImpl> {
	}
	
	interface WidgetStyle extends CssResource{
		String error();
		String warning();
		String requestError();
	}
	
	private ClickHandler statusCodeHintHandler = new ClickHandler() {
		@Override
		public void onClick(ClickEvent event) {
			final int responseCode = response.getStatus(); 
			if (responseCode == 0) {
				StatusCodeInfo dialog = new StatusCodeInfo();
				dialog.setHTML("Status Code: " + responseCode);
				dialog.setInfoText("No response data.");
				dialog.center();
				dialog.show();
				return;
			}
			
			listener.getStatusCodeInfo(responseCode, new Callback<StatusCodeRow, Throwable>() {
				
				@Override
				public void onSuccess(StatusCodeRow code) {
					
					String message = response.getStatusText();
					String html = "<b>Status Code: " + responseCode;
					if(message != null){
						html += " - " + message + " ";
					}
					html += "</b><br/><br/>"+code.getDesc();
					StatusCodeInfo dialog = new StatusCodeInfo();
					dialog.setInfoText(html);
					dialog.center();
					dialog.show();
				}
				
				@Override
				public void onFailure(Throwable reason) {
					StatusCodeInfo dialog = new StatusCodeInfo();
					dialog.setHTML("Status Code: " + responseCode);
					dialog.setInfoText("Unable to find explanation");
					dialog.center();
					dialog.show();
				}
			});
		}
	};
	
	private ResponsePresenter listener;
	private boolean success = false;
	private Response response;
	private long requestTime;
	
	@UiField Image codeImage;
	@UiField SpanElement loadingTime;
	@UiField SpanElement codeContainer;
	@UiField HTMLPanel headersPanel;
	@UiField HTMLPanel bodyPanel;
	@UiField WidgetStyle style;
	
	public ResponseViewImpl() {
		initWidget(uiBinder.createAndBindUi(this));
	}	
	
	@Override
	public void setPresenter(ResponsePresenter listener) {
		this.listener = listener;
	}

	@Override
	public void setResponseData(boolean success, Response response,
			long requestTime) {
		this.requestTime = requestTime;
		this.success = success;
		this.response = response;
		fill();
	}

	private void fill(){
		if(!success){
			this.addStyleName(style.requestError());
		} else {
			this.removeStyleName(style.requestError());
		}
		
		
		setResponseStatus();
		setResponseHeaders();
		setResponseCookies();
		setResponseBody();
	}
	
	private void setResponseStatus() {
		//
		// Set status code
		//
		int code = response.getStatus();
		String msg = response.getStatusText();
		if(code >=500 || code == 0){
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
		codeImage.addClickHandler(statusCodeHintHandler);
		
		
		//
		// Set request time
		//
		loadingTime.setInnerText(String.valueOf(requestTime));
	}
	private void setResponseHeaders() {
		Header[] headers = response.getHeaders();
		final HashMap<String, ResponseHeaderLine> map = new HashMap<String, ResponseHeaderLine>();
		ArrayList<String> list = new ArrayList<String>();
		for(Header header : headers){
			String headerName = header.getName(); 
			ResponseHeaderLine rhl = new ResponseHeaderLine(header);
			map.put(headerName, rhl);
			list.add(headerName);
			headersPanel.add(rhl);
		}
		
		listener.getResponseHeadersInfo(list, new Callback<List<HeaderRow>, Throwable>() {
			
			@Override
			public void onSuccess(List<HeaderRow> result) {
				for(HeaderRow row : result){
					String name = row.getName();
					if(map.containsKey(name)){
						ResponseHeaderLine line = map.get(name);
						line.updateDesc(row.getDesc());
						line.updateExample(row.getExample());
						line.updateName(name);
					}
				}
			}
			@Override
			public void onFailure(Throwable reason) {
				if(RestClient.isDebug()){
					Log.debug("Unable to get response headers help.",reason);
				}
			}
		});
	}
	private void setResponseCookies() {
		// TODO Auto-generated method stub
		
	}
	private void setResponseBody() {
		if(!success || response.getStatus() == 0){
			return;
		}
		//Response does not contain any data.
		String body = response.getResponseText();
		Document xml = response.getResponseXML();
		boolean isXML = false, isJSON = false;
		
		
	}

	@Override
	public void clear() {
		
	}

}
