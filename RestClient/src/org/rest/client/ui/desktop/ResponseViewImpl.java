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
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.rest.client.RestClient;
import org.rest.client.dom.worker.WebWorkerError;
import org.rest.client.dom.worker.Worker;
import org.rest.client.dom.worker.WorkerMessageHandler;
import org.rest.client.event.OverwriteUrlEvent;
import org.rest.client.request.RedirectData;
import org.rest.client.storage.store.objects.RequestObject;
import org.rest.client.storage.websql.HeaderRow;
import org.rest.client.ui.ResponseView;
import org.rest.client.ui.desktop.widget.JSONViewer;
import org.rest.client.ui.desktop.widget.RedirectView;
import org.rest.client.ui.desktop.widget.ResponseHeaderLine;
import org.rest.client.ui.desktop.widget.StatusCodeImage;
import org.rest.client.ui.desktop.widget.XMLViewer;
import org.rest.client.ui.html5.HTML5Element;
import org.rest.client.util.JSONHeadersUtils;
import org.rest.client.util.Utils;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JavaScriptException;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.Scheduler;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.dom.client.Document;
import com.google.gwt.dom.client.PreElement;
import com.google.gwt.dom.client.Style.Unit;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.MouseOutEvent;
import com.google.gwt.event.dom.client.MouseOutHandler;
import com.google.gwt.event.dom.client.MouseOverEvent;
import com.google.gwt.event.dom.client.MouseOverHandler;
import com.google.gwt.i18n.client.DateTimeFormat;
import com.google.gwt.i18n.client.DateTimeFormat.PredefinedFormat;
import com.google.gwt.safehtml.shared.SafeHtmlUtils;
import com.google.gwt.storage.client.Storage;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.Command;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.Timer;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.Window.ScrollEvent;
import com.google.gwt.user.client.Window.ScrollHandler;
import com.google.gwt.user.client.ui.Anchor;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.FlowPanel;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.InlineLabel;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.SimplePanel;
import com.google.gwt.user.client.ui.Widget;
import com.google.gwt.xhr2.client.Header;
import com.google.gwt.xhr2.client.Response;
import com.google.gwt.xhr2.client.XMLHttpRequest2;

public class ResponseViewImpl extends Composite implements ResponseView {
	private static ResponseViewImplUiBinder uiBinder = GWT
			.create(ResponseViewImplUiBinder.class);

	interface ResponseViewImplUiBinder extends UiBinder<Widget, ResponseViewImpl> {
	}
	
	class WidgetStyle {
		String error = "Response_View_error";
		String warning = "Response_View_warning";
		String requestError = "Response_View_requestError";
		String responseRow = "Response_View_responseRow";
		String label = "Response_View_label";
		String result = "Response_View_result";
		String onTop = "Response_View_onTop";
		String collapseButton = "androidNavigationCollapse";
		String expandButton = "androidNavigationExpand";
	}
	
	private ResponsePresenter listener;
	private boolean success = false;
	private Response response;
	private long requestTime;
	private final static String COLLAPSED_REQUEST_HEADERS_KEY = "resp_panel_crqhk";
	private final static String COLLAPSED_RESPONSE_HEADERS_KEY = "resp_panel_crshk";
	
	@UiField StatusCodeImage codeImage;
	@UiField InlineLabel loadingTime;
	@UiField InlineLabel codeContainer;
	@UiField HTMLPanel headersPanel;
	@UiField HTMLPanel requestHeadersPanel;
	@UiField HTMLPanel responsePayloadContainer;
	@UiField HTMLPanel requestHeadersContainer;
	@UiField HTMLPanel responseHeadersContainer;
	@UiField InlineLabel rawTab;
	@UiField InlineLabel xmlTab;
	@UiField InlineLabel jsonTab;
	@UiField InlineLabel imageTab;
	@UiField InlineLabel parsedTab;
	@UiField DivElement tabContent;
	@UiField HTML plainBody;
	@UiField Anchor parsedOpen;
	@UiField Anchor forceOpenAsJSON;
	@UiField Anchor collapseRequestHeaders;
	@UiField Anchor collapseResponseHeaders;
	@UiField Anchor forceOpenAsXML;
	@UiField PreElement parsedBody;
	@UiField HTMLPanel xmlPanel;
	@UiField HTMLPanel imagePanel;
	@UiField HTMLPanel jsonPanel;
	@UiField HTMLPanel redirects;
	@UiField DivElement scrollContainer;
	WidgetStyle style = new WidgetStyle();
	
	
	public ResponseViewImpl() {
		initWidget(uiBinder.createAndBindUi(this));
		setHeadersPanelCollapsable();
	}
	
	
	private void setHeadersPanelCollapsable(){
		requestHeadersContainer.addDomHandler(new MouseOverHandler() {
			@Override
			public void onMouseOver(MouseOverEvent event) {
				if(collapseRequestHeaders.getStyleName().contains(" visible")){
					return;
				}
				collapseRequestHeaders.addStyleName("visible");
			}
		}, MouseOverEvent.getType());
		
		requestHeadersContainer.addDomHandler(new MouseOutHandler() {
			@Override
			public void onMouseOut(MouseOutEvent event) {
				collapseRequestHeaders.removeStyleName("visible");
			}
		}, MouseOutEvent.getType());
		
		responseHeadersContainer.addDomHandler(new MouseOverHandler() {
			@Override
			public void onMouseOver(MouseOverEvent event) {
				if(collapseResponseHeaders.getStyleName().contains(" visible")){
					return;
				}
				collapseResponseHeaders.addStyleName("visible");
			}
		}, MouseOverEvent.getType());
		
		responseHeadersContainer.addDomHandler(new MouseOutHandler() {
			@Override
			public void onMouseOut(MouseOutEvent event) {
				collapseResponseHeaders.removeStyleName("visible");
			}
		}, MouseOutEvent.getType());
		
		
		Storage sessionStore = Storage.getSessionStorageIfSupported();
		String rqhk = sessionStore.getItem(COLLAPSED_REQUEST_HEADERS_KEY);
		String rshk = sessionStore.getItem(COLLAPSED_RESPONSE_HEADERS_KEY);
		if(rqhk != null && rqhk.equals("1")){
			requestHeadersContainer.addStyleName("headersCollapsed");
			collapseRequestHeaders.removeStyleName(style.collapseButton);
			collapseRequestHeaders.addStyleName(style.expandButton);
		}
		if(rshk != null && rshk.equals("1")){
			responseHeadersContainer.addStyleName("headersCollapsed");
			collapseResponseHeaders.removeStyleName(style.collapseButton);
			collapseResponseHeaders.addStyleName(style.expandButton);
		}
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
		handleTabsChange();
		fill();
		
	}

	private void fill(){
		if(!success || response == null){
			this.addStyleName(style.requestError);
		} else {
			this.removeStyleName(style.requestError);
		}
		if(response == null) {
			cleanupErrorResponse();
			return;
		}
		setResponseStatus();
		setResponseBody();
	}
	
	void cleanupErrorResponse(){
		codeContainer.getElement().setInnerHTML("An error occured during the request.");
		codeContainer.getElement().addClassName(style.error);
		loadingTime.setText("0");
		responsePayloadContainer.setVisible(false);
		responseHeadersContainer.setVisible(false);
		requestHeadersContainer.setVisible(false);
		scrollContainer.addClassName(style.onTop);
	}
	
	private void setResponseStatus() {
		//
		// Set status code
		//
		int code = response.getStatus();
		String msg = response.getStatusText();
		if(code >=500 || code == 0){
			codeContainer.getElement().addClassName(style.error);
		} else if( code >= 400 && code < 500 ){
			codeContainer.getElement().addClassName(style.warning);
		}
		String txt = "<strong>" + code + "</strong>";
		if (msg != null && !msg.equals("")) {
			txt += " " + msg;
		} else if (code == 0) {
			txt += " NO RESPONSE";
		}
		codeContainer.getElement().setInnerHTML(txt);
		codeImage.setCode(code);
		
		
		//
		// Set request time
		//
		loadingTime.getElement().setInnerText(String.valueOf(requestTime));
	}
	
	
	
	@Override
	public void setRequestHeadersExternal(ArrayList<Header> headers) {
		final HashMap<String, ResponseHeaderLine> map = new HashMap<String, ResponseHeaderLine>();
		ArrayList<String> list = new ArrayList<String>();
		if(headers != null){
			for(Header header : headers){
				String headerName = header.getName(); 
				ResponseHeaderLine rhl = new ResponseHeaderLine(header);
				map.put(headerName, rhl);
				list.add(headerName);
				requestHeadersPanel.add(rhl);
			}
		}
		listener.getRequestHeadersInfo(list, new Callback<List<HeaderRow>, Throwable>() {
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
					Log.debug("Unable to get request headers help.",reason);
				}
			}
		});
	}

	@Override
	public void setResponseHeadersExternal(ArrayList<Header> headers) {
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
	
	@Override
	public void setRedirectData(ArrayList<RedirectData> redirectData) {
		if(redirectData == null) return;
		boolean addNumber = false;
		int size = redirectData.size();
		if(size > 1) addNumber = true;
		
		for(int i=0; i<size; i++){
			RedirectData data = redirectData.get(i);
			
			FlowPanel wrapper = new FlowPanel();
			wrapper.setStyleName(style.responseRow);
			Label redirectLabel = new Label("Redirect" + ( addNumber ? " #"+(i+1) : "" ));
			redirectLabel.setStyleName(style.label);
			wrapper.add(redirectLabel);
			SimplePanel result = new SimplePanel();
			result.setStyleName(style.result);
			wrapper.add(result);
			RedirectView view = new RedirectView(data, listener);
			result.add(view);
			redirects.add(wrapper);
		}
	}
	
	private void setResponseBody() {
		if(!success || response.getStatus() == 0){
			return;
		}
		//Response does not contain any data.
		final String body = response.getResponseText();
		Document xml = response.getResponseXML();
		boolean isXML = false, isJSON = false, isImage = false;
		
		String escaped = SafeHtmlUtils.htmlEscape(body);
		boolean useCodeMirror = false;
		
		if(xml != null){
			isXML = true;
		}
		Header[] headers = response.getHeaders();
		if(!isXML){
			//check if response has JSON header:
			if(isJSONHeader(headers)){
				isJSON = true;
			}
		}
		if(!isJSON && !isXML){
			//just HTML
			useCodeMirror = true;
		}
		
		isImage = isImageHeader(headers);
		if(isImage){
			useCodeMirror = false;
			isJSON = false;
			isXML = false;
		}
		
		if(escaped.equals("")){
			xml = null;
			isXML = false;
			Element info = DOM.createSpan();
			info.setInnerText("Response does not contain any data.");
			info.addClassName("note italic");
			plainBody.getElement().appendChild(info);
			setTabOpened(TABS.RAW, rawTab);
			return;
		} else {
			plainBody.setHTML(escaped);
		}
		
		if(useCodeMirror){
			setTabOpened(TABS.PARSED, parsedTab);
			//show this tab
			setTabVisible(TABS.PARSED, parsedTab);
			
			if(RestClient.isDebug()){
				Log.debug("Initialize code mirror...");
			}
			String _encoding = getRequestContentType("text/html");
			if(_encoding.contains("javascript")){
				_encoding = "text/javascript";
			}
			final String encoding = _encoding;
			
			try{
				getRequestDomainAndPath(new Callback<String, Throwable>() {
					@Override
					public void onSuccess(String result) {
						loadCodeMirror(body, encoding, result);
					}
					@Override
					public void onFailure(Throwable reason) {
						
					}
				});
				
			} catch(Exception e){
				if(RestClient.isDebug()){
					Log.warn("Unable to load CodeMirror.",e );
				}
			}
			
//			if(isJavaScriptHeader(headers)){
				forceOpenAsJSON.removeStyleName("hidden");
//			}
		}
		if(isJSON){
			setTabOpened(TABS.JSON, jsonTab);
			new JSONViewer(body, jsonPanel);
			setTabVisible(TABS.JSON, jsonTab);
		}
		if(isXML){
			setTabOpened(TABS.XML, xmlTab);
			new XMLViewer(body, xmlPanel, xml);
			setTabVisible(TABS.XML, xmlTab);
		}
		if(isImage){
			
//			setTabOpened(TABS.IMAGE, imageTab);
//			setTabVisible(TABS.IMAGE, imageTab);
//			final Image img = new Image();
//			img.addLoadHandler(new LoadHandler() {
//				@Override
//				public void onLoad(LoadEvent event) {
//					revokeImageUrl(img.getUrl());
//				}
//			});
//			img.setUrl(createImageUrl(response.getRequest(),"image/png"));
//			imagePanel.add(img);
		}
		if(RestClient.isDebug()){
			Log.debug("Response panel has been filled with new data");
		}
	}
	
	private final native String createImageUrl(XMLHttpRequest2 xhr, String mime) /*-{
		var blob = new $wnd.Blob([xhr.response], {type: mime});
		return $wnd.URL.createObjectURL(blob);
	}-*/;
	
	private final native void revokeImageUrl(String url) /*-{
		$wnd.URL.revokeObjectURL(url);
	}-*/;
	/**
	 * Check if in response headers is some header defined as JSON header.
	 * @param headers
	 * @return
	 */
	private boolean isJSONHeader(Header[] headers){
		String[] jsonHeadersDefinitions = JSONHeadersUtils.getJSONHeadersListSynch();
		for (Header header : headers) {
			if (header == null) {
				continue;
			}
			String name = header.getName().toLowerCase();
			if(name.equals("content-type")){
				String value = header.getValue().toLowerCase();
				if(value.contains("+json")){
					return true;
				}
				for(String headerDef : jsonHeadersDefinitions){
					if(value.contains(headerDef)){
						return true;
					}
				}
				return false;
			}
		}
		return false;
	}
	
	private boolean isImageHeader(Header[] headers){
		boolean result = false;
		for (Header header : headers) {
			if(!header.getName().toLowerCase().equals("content-type")) continue;
			if(header.getValue().startsWith("image/")){
				result = true;
			}
		}
		return result;
	}
	
	
	private boolean isJavaScriptHeader(Header[] headers){
		boolean result = false;
		for (Header header : headers) {
			if(!header.getName().toLowerCase().equals("content-type")) continue;
			if(header.getValue().contains("javascript")){
				result = true;
			}
		}
		return result;
	}
	
	/**
	 * Load code mirror library.
	 * @param text
	 * @param encoding 
	 * @throws JavaScriptException
	 */
	final native void loadCodeMirror(String text, String encoding, String baseUrl) throws JavaScriptException /*-{
		var elements = [];
		var context = this;
		var clb = $entry(function(a,b) {
			elements.push({string:a,style:b});
		});
		var ready = $entry(function() {
			var result = {
				html: elements,
				url: baseUrl 
			}
			context.@org.rest.client.ui.desktop.ResponseViewImpl::codeMirrorCallback(Lcom/google/gwt/core/client/JavaScriptObject;)(result);
		});
		try{
			$wnd.CodeMirror.runMode(text, encoding, clb, ready);
		} catch(e){
			$wnd.alert("Unable to initialize CodeMirror :( " + e.message);
		}
	}-*/;
	
	void codeMirrorCallback(JavaScriptObject html){
		Worker worker =  new Worker("/workers/htmlviewer.js");
		worker.onMessage(new WorkerMessageHandler() {
			@Override
			public void onMessage(String message) {
				parsedBody.setInnerHTML(message);
				addNativeControls(parsedBody);
			}

			@Override
			public void onError(WebWorkerError err) {
				parsedBody.setInnerHTML(err.getMessage());
			}
		});
		worker.postMessage(html);
	}
	
	private void getRequestDomainAndPath(final Callback<String, Throwable> callback){
		
		RestClient.collectRequestData(new Callback<RequestObject, Throwable>() {
			
			@Override
			public void onSuccess(RequestObject result) {
				String url = result.getURL();
				if(!url.contains("://")){ //not FQDN - local (debug?)
					String root = Window.Location.getProtocol() + "//" + Window.Location.getHost();
					if(url.startsWith("/")){
						url = root + "" + url;
					} else {
						url = root + Window.Location.getPath() + url;
					}
				}
				if(url.contains("?")){
					//remove query parameters
					url = url.substring(0, url.indexOf("?"));
				}
				if(url.contains("#")){
					//remove history tokens
					url = url.substring(0, url.indexOf("#"));
				}
				//remove last path segment
				int lastSlash = url.lastIndexOf("/");
				if(lastSlash > 0){
					if(!url.substring(lastSlash-1,lastSlash).equals("/")){
						url = url.substring(0, lastSlash+1);
					}
				}
				if(!url.endsWith("/")){
					url += "/";
				}
				callback.onSuccess(url);
			}
			
			@Override
			public void onFailure(Throwable reason) {
				callback.onFailure(reason);
			}
		});
	}
	
	
	final void fireUrlChangeEvent(String url){
		RestClient.getClientFactory().getEventBus().fireEvent(new OverwriteUrlEvent(url));
	}
	
	private final native void addNativeControls(com.google.gwt.dom.client.Element element)/*-{
		var context = this;
		element.addEventListener('click', function(e){
			if(!e.target) return;
			if(e.target.nodeName == "A"){
				e.preventDefault();
				var url = e.target.getAttribute('href');
				context.@org.rest.client.ui.desktop.ResponseViewImpl::fireUrlChangeEvent(Ljava/lang/String;)(url);
				$wnd.scrollTo(0,0);
				return;
			}
		}, true);
	}-*/;
	
	public enum TABS { 
		RAW("raw"), 
		XML("xml"), 
		JSON("json"), 
		PARSED("parsed"),
		IMAGE("image");
		
		private final String type;
		TABS(String type){
			this.type = type;
		}
		public String toString(){
			return this.type;
		}
	}
	private TABS currentTab = TABS.RAW;
	
	private void handleTabsChange(){
		
		//RAW RESPONSE
		rawTab.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				if(currentTab.equals(TABS.RAW)) return;
				setTabOpened(TABS.RAW, rawTab);
			}

			
		});
		rawTab.addMouseOverHandler(new MouseOverHandler() {
			@Override
			public void onMouseOver(MouseOverEvent event) {
				HTML5Element tab = (HTML5Element) rawTab.getElement();
				if(!tab.getClassList().contains("inlineButtonChecked"))
					tab.getClassList().add("inlineButtonHover");
			}
		});
		rawTab.addMouseOutHandler(new MouseOutHandler() {
			@Override
			public void onMouseOut(MouseOutEvent event) {
				HTML5Element tab = (HTML5Element) rawTab.getElement();
				if(!tab.getClassList().contains("inlineButtonHover"))
					tab.getClassList().remove("inlineButtonHover");
			}
		});
		
		//PARSED RESPONSE
		
		parsedTab.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				if(currentTab.equals(TABS.PARSED)) return;
				setTabOpened(TABS.PARSED, parsedTab);
			}
		});
		parsedTab.addMouseOverHandler(new MouseOverHandler() {
			@Override
			public void onMouseOver(MouseOverEvent event) {
				HTML5Element tab = (HTML5Element) parsedTab.getElement();
				if(!tab.getClassList().contains("inlineButtonChecked"))
					tab.getClassList().add("inlineButtonHover");
			}
		});
		parsedTab.addMouseOutHandler(new MouseOutHandler() {
			@Override
			public void onMouseOut(MouseOutEvent event) {
				HTML5Element tab = (HTML5Element) parsedTab.getElement();
				if(!tab.getClassList().contains("inlineButtonHover"))
					tab.getClassList().remove("inlineButtonHover");
			}
		});
		
		
		//XML RESPONSE
		xmlTab.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				if(currentTab.equals(TABS.XML)) return;
				setTabOpened(TABS.XML, xmlTab);
			}
		});
		xmlTab.addMouseOverHandler(new MouseOverHandler() {
			@Override
			public void onMouseOver(MouseOverEvent event) {
				HTML5Element tab = (HTML5Element) xmlTab.getElement();
				if(!tab.getClassList().contains("inlineButtonChecked"))
					tab.getClassList().add("inlineButtonHover");
			}
		});
		xmlTab.addMouseOutHandler(new MouseOutHandler() {
			@Override
			public void onMouseOut(MouseOutEvent event) {
				HTML5Element tab = (HTML5Element) xmlTab.getElement();
				if(tab.getClassList().contains("inlineButtonHover"))
					tab.getClassList().remove("inlineButtonHover");
			}
		});
		
		//JSON RESPONSE
		jsonTab.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				if(currentTab.equals(TABS.JSON)) return;
				setTabOpened(TABS.JSON, jsonTab);
			}
		});
		jsonTab.addMouseOverHandler(new MouseOverHandler() {
			@Override
			public void onMouseOver(MouseOverEvent event) {
				HTML5Element tab = (HTML5Element) jsonTab.getElement();
					tab.getClassList().add("inlineButtonHover");
			}
		});
		jsonTab.addMouseOutHandler(new MouseOutHandler() {
			@Override
			public void onMouseOut(MouseOutEvent event) {
				HTML5Element tab = (HTML5Element) jsonTab.getElement();
				if(tab.getClassList().contains("inlineButtonHover"))
					tab.getClassList().remove("inlineButtonHover");
			}
		});
		
		
		//IMAGE RESPONSE
		imageTab.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				if(currentTab.equals(TABS.IMAGE)) return;
				setTabOpened(TABS.IMAGE, imageTab);
			}
		});
		imageTab.addMouseOverHandler(new MouseOverHandler() {
			@Override
			public void onMouseOver(MouseOverEvent event) {
				HTML5Element tab = (HTML5Element) imageTab.getElement();
					tab.getClassList().add("inlineButtonHover");
			}
		});
		imageTab.addMouseOutHandler(new MouseOutHandler() {
			@Override
			public void onMouseOut(MouseOutEvent event) {
				HTML5Element tab = (HTML5Element) imageTab.getElement();
				if(tab.getClassList().contains("inlineButtonHover"))
					tab.getClassList().remove("inlineButtonHover");
			}
		});
	}
	
	private void setTabOpened(TABS type, InlineLabel tabHandler) {
		String tabHandlercurrent = "inlineButtonChecked";
		HTML5Element tab = (HTML5Element) tabHandler.getElement();
		((HTML5Element)tab.getParentElement()).querySelector("."+tabHandlercurrent).getClassList().remove(tabHandlercurrent);
		tab.getClassList().add(tabHandlercurrent);
		
		HTML5Element contentParent = (HTML5Element) tabContent.getParentElement();
		contentParent.querySelector(".tabsContent .tabContent.tabContentCurrent").getClassList().remove("tabContentCurrent");
		contentParent.querySelector(".tabsContent .tabContent[data-tab=\""+type.toString()+"\"]").getClassList().add("tabContentCurrent");
        
		currentTab = type;
	}
	
	private void setTabVisible(TABS type, InlineLabel tabHandler){
		HTML5Element tab = (HTML5Element) tabHandler.getElement();
		tab.getClassList().remove("hidden");
		HTML5Element contentParent = (HTML5Element) tabContent.getParentElement();
		contentParent.querySelector(".tabsContent .tabContent[data-tab=\""+type.toString()+"\"]").getClassList().remove("hidden");
	}
	
	@UiHandler("parsedOpen")
	public void onOpen(ClickEvent event){
		event.preventDefault();
		writeRawBody(response.getResponseText());
	}
	private final native void writeRawBody(String body)/*-{
		var wnd = $wnd.open();
		wnd.document.body.innerHTML = body;
	}-*/;
	
	private String requestEncoding = null;
	private String getRequestContentType(String defaultEncodeing){
		if(requestEncoding != null){
			return requestEncoding;
		}
		Header[] headers = response.getHeaders();
		for(Header header : headers){
			if(header.getName().toLowerCase().equals("content-type")){
				defaultEncodeing = header.getValue().split(";")[0];
				break;
			}
		}
		requestEncoding = defaultEncodeing;
		return defaultEncodeing;
	}
	
	private int initialScrollTop = -1;
	private int initialOffsetTop = -1;
	private final int marginOffset = 25;
	private int lastEndPosition = -1;
	@Override
	public void scrollToView() {
		_scrollIntoView(this.getElement());
		Window.addWindowScrollHandler(new ScrollHandler() {
			@Override
			public void onWindowScroll(ScrollEvent event) {
				int top = event.getScrollTop();
				
				if(Math.abs(top) < 20){
					scrollContainer.addClassName(style.onTop);
				} else {
					scrollContainer.removeClassName(style.onTop);
				}
				
				
				int scrollTop = scrollContainer.getAbsoluteTop();
				
				int nextPos = initialOffsetTop+marginOffset+(top-initialScrollTop);
				boolean canMove = false;
				if(top+marginOffset > scrollTop){
					if(initialOffsetTop == -1){
						initialOffsetTop = scrollContainer.getOffsetTop();
						initialScrollTop = scrollTop;
						nextPos = initialOffsetTop+marginOffset+(top-initialScrollTop);
					}
					canMove = true;
				} else if(nextPos<lastEndPosition){
					if(top > initialScrollTop){
						canMove = true;
					} else {
						if(scrollTop != initialScrollTop){
							nextPos = initialOffsetTop;
							canMove = true;
						}
					}
				}
				if(canMove){
					lastEndPosition = nextPos;
					scrollContainer.getStyle().setTop(nextPos, Unit.PX);
				}
				
			}
		});
	}
	@UiHandler("scrollButton")
	void onscrollButton(ClickEvent e){
		e.preventDefault();
		_scrollToStart();
	}
	
	private final native void _scrollToStart() /*-{
		$wnd.scrollTo(0,0);
	}-*/;
	
	private final native void _scrollIntoView(Element element) /*-{
		element.scrollIntoView();
//		element.scrollIntoViewIfNeeded();
	}-*/;
	
	@UiHandler("wrapContentButton")
	void onWrapContent(ClickEvent e){
		e.preventDefault();
		Anchor el = (Anchor)e.getSource();
		String whiteSpace = plainBody.getElement().getStyle().getProperty("whiteSpace");
		boolean isWrapped = true;
		if(!whiteSpace.isEmpty()){
			isWrapped = whiteSpace.equals("pre");
		}
		
		if(!isWrapped){
			plainBody.getElement().getStyle().setProperty("whiteSpace", "pre");
			el.setText("Word unwrap");
		} else {
			plainBody.getElement().getStyle().setProperty("whiteSpace", "nowrap");
			el.setText("Word wrap");
		}
	}
	@UiHandler({"copyClipboardButton","copyClipboardButton2","copyClipboardButton3","copyClipboardButton4"})
	void onCopy(ClickEvent e){
		e.preventDefault();
		String body = response.getResponseText();
		RestClient.getClientFactory().getChromeMessagePassing().postMessage("copyToClipboard",body);
	}
	@UiHandler({"saveAsFileButton1","saveAsFileButton2","saveAsFileButton3","saveAsFileButton4"})
	void onSaveAsFileClick(ClickEvent e){
		final Anchor anchor = (Anchor)e.getSource();
		final Element anchorElement = anchor.getElement();
		String download = anchorElement.getAttribute("download");
		if(download != null && !download.isEmpty()){
			//already have download.
			if(!anchorElement.getAttribute("disabled").isEmpty()){
				return;
			}
			anchorElement.setAttribute("disabled", "true");
			Timer t = new Timer() {
				@Override
				public void run() {
					anchor.setHref("about:blank");
					anchor.setText("Save as file");
					anchorElement.removeAttribute("download");
					anchorElement.removeAttribute("data-downloadurl");
					anchorElement.removeAttribute("disabled");
					listener.revokeDownloadData();
				}
			};
			t.schedule(1500);
			return;
		}
		e.preventDefault();
		
		final String body = response.getResponseText();
		final String encoding = getRequestContentType("text/html");
		
		Scheduler.get().scheduleDeferred(new Command() {
			public void execute() {
				String ext = Utils.guessFileExtension(encoding);
				String fileObjectUrl = listener.createDownloadData(body,encoding);
				anchor.setHref(fileObjectUrl);
				String date = DateTimeFormat.getFormat(PredefinedFormat.DATE_TIME_MEDIUM).format(new Date());
				String fileName = "arc-response-"+date+"."+ext;
				anchorElement.setAttribute("download", fileName);
				anchorElement.setAttribute("data-downloadurl", encoding+":"+fileName+":"+fileObjectUrl);
				anchor.setText("Download");
			}
		});
	}
	@UiHandler("forceOpenAsJSON")
	void onForceOpenAsJSON(ClickEvent e){
		e.preventDefault();
		forceOpenAsJSON.addStyleName("hidden");
		final String body = response.getResponseText();
		setTabOpened(TABS.JSON, jsonTab);
		new JSONViewer(body, jsonPanel);
		setTabVisible(TABS.JSON, jsonTab);
	}

	
	@UiHandler("collapseResponseHeaders")
	void onCollapseResponseHeaders(ClickEvent e){
		e.preventDefault();
		Storage sessionStore = Storage.getSessionStorageIfSupported();
		if(responseHeadersContainer.getStyleName().contains("headersCollapsed")){
			responseHeadersContainer.removeStyleName("headersCollapsed");
			collapseResponseHeaders.removeStyleName(style.expandButton);
			collapseResponseHeaders.addStyleName(style.collapseButton);
			sessionStore.setItem(COLLAPSED_RESPONSE_HEADERS_KEY, "0");
		} else {
			responseHeadersContainer.addStyleName("headersCollapsed");
			collapseResponseHeaders.removeStyleName(style.collapseButton);
			collapseResponseHeaders.addStyleName(style.expandButton);
			sessionStore.setItem(COLLAPSED_RESPONSE_HEADERS_KEY, "1");
		}
	}
	@UiHandler("collapseRequestHeaders")
	void onCollapseRequestHeaders(ClickEvent e){
		e.preventDefault();
		Storage sessionStore = Storage.getSessionStorageIfSupported();
		if(requestHeadersContainer.getStyleName().contains("headersCollapsed")){
			requestHeadersContainer.removeStyleName("headersCollapsed");
			collapseRequestHeaders.removeStyleName(style.expandButton);
			collapseRequestHeaders.addStyleName(style.collapseButton);
			sessionStore.setItem(COLLAPSED_REQUEST_HEADERS_KEY, "0");
		} else {
			requestHeadersContainer.addStyleName("headersCollapsed");
			collapseRequestHeaders.removeStyleName(style.collapseButton);
			collapseRequestHeaders.addStyleName(style.expandButton);
			sessionStore.setItem(COLLAPSED_REQUEST_HEADERS_KEY, "1");
		}
		
	}
	
	@UiHandler("forceOpenAsXML")
	void onForceOpenAsXML(ClickEvent e){
		e.preventDefault();
		forceOpenAsXML.addStyleName("hidden");
		final String body = response.getResponseText();
		setTabOpened(TABS.JSON, xmlTab);
		new XMLViewer(body, xmlPanel, response.getResponseXML());
		setTabVisible(TABS.JSON, xmlTab);
	}
}
