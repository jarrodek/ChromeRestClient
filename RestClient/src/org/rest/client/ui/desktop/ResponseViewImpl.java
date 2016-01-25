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

import java.util.Date;

import org.rest.client.RestClient;
import org.rest.client.dom.worker.WebWorkerError;
import org.rest.client.dom.worker.Worker;
import org.rest.client.dom.worker.WorkerMessageHandler;
import org.rest.client.event.OverwriteUrlEvent;
import org.rest.client.jso.RequestObject;
import org.rest.client.jso.ResponseStatusData;
import org.rest.client.log.Log;
import org.rest.client.ui.ResponseView;
import org.rest.client.ui.desktop.widget.JSONViewer;
import org.rest.client.ui.desktop.widget.XMLViewer;
import org.rest.client.ui.html5.HTML5Element;
import org.rest.client.util.Utils;

import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JavaScriptException;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.Scheduler;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.dom.client.Document;
import com.google.gwt.dom.client.Element;
import com.google.gwt.dom.client.PreElement;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.MouseOutEvent;
import com.google.gwt.event.dom.client.MouseOutHandler;
import com.google.gwt.event.dom.client.MouseOverEvent;
import com.google.gwt.event.dom.client.MouseOverHandler;
import com.google.gwt.i18n.client.DateTimeFormat;
import com.google.gwt.i18n.client.DateTimeFormat.PredefinedFormat;
import com.google.gwt.safehtml.shared.SafeHtmlUtils;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.Command;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Timer;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.Anchor;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.InlineLabel;
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
	
	@UiField HTMLPanel responsePayloadContainer;
	@UiField InlineLabel rawTab;
	@UiField InlineLabel xmlTab;
	@UiField InlineLabel jsonTab;
	@UiField InlineLabel imageTab;
	@UiField InlineLabel parsedTab;
	@UiField DivElement tabContent;
	@UiField HTML plainBody;
	@UiField Anchor parsedOpen;
	@UiField Anchor forceOpenAsJSON;
	@UiField Anchor forceOpenAsXML;
	@UiField PreElement parsedBody;
	@UiField HTMLPanel xmlPanel;
	@UiField HTMLPanel imagePanel;
	@UiField HTMLPanel jsonPanel;
	@UiField Element statusComponent;
	WidgetStyle style = new WidgetStyle();
	
	
	public ResponseViewImpl() {
		initWidget(uiBinder.createAndBindUi(this));
		setResponseStatusHandlers(this);
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
		responsePayloadContainer.setVisible(false);
	}
	
	private void setResponseStatus() {
		int code = response.getStatus();
		String msg = response.getStatusText();

		statusComponent.setAttribute("status-code", String.valueOf(code));
		statusComponent.setAttribute("status-message", msg);
		statusComponent.setAttribute("loading-time", String.valueOf(requestTime));
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
			forceOpenAsJSON.removeStyleName("hidden");
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
		String[] defs = new String[]{"application/json","text/json","text/x-json"};

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
				for(String headerDef : defs){
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
				HTML5Element tab = (HTML5Element) rawTab.getElement().cast();
				if(!tab.getClassList().contains("inlineButtonChecked"))
					tab.getClassList().add("inlineButtonHover");
			}
		});
		rawTab.addMouseOutHandler(new MouseOutHandler() {
			@Override
			public void onMouseOut(MouseOutEvent event) {
				HTML5Element tab = (HTML5Element) rawTab.getElement().cast();
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
				HTML5Element tab = (HTML5Element) parsedTab.getElement().cast();
				if(!tab.getClassList().contains("inlineButtonChecked"))
					tab.getClassList().add("inlineButtonHover");
			}
		});
		parsedTab.addMouseOutHandler(new MouseOutHandler() {
			@Override
			public void onMouseOut(MouseOutEvent event) {
				HTML5Element tab = (HTML5Element) parsedTab.getElement().cast();
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
				HTML5Element tab = (HTML5Element) xmlTab.getElement().cast();
				if(!tab.getClassList().contains("inlineButtonChecked"))
					tab.getClassList().add("inlineButtonHover");
			}
		});
		xmlTab.addMouseOutHandler(new MouseOutHandler() {
			@Override
			public void onMouseOut(MouseOutEvent event) {
				HTML5Element tab = (HTML5Element) xmlTab.getElement().cast();
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
				HTML5Element tab = (HTML5Element) jsonTab.getElement().cast();
					tab.getClassList().add("inlineButtonHover");
			}
		});
		jsonTab.addMouseOutHandler(new MouseOutHandler() {
			@Override
			public void onMouseOut(MouseOutEvent event) {
				HTML5Element tab = (HTML5Element) jsonTab.getElement().cast();
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
				HTML5Element tab = (HTML5Element) imageTab.getElement().cast();
					tab.getClassList().add("inlineButtonHover");
			}
		});
		imageTab.addMouseOutHandler(new MouseOutHandler() {
			@Override
			public void onMouseOut(MouseOutEvent event) {
				HTML5Element tab = (HTML5Element) imageTab.getElement().cast();
				if(tab.getClassList().contains("inlineButtonHover"))
					tab.getClassList().remove("inlineButtonHover");
			}
		});
	}
	
	private void setTabOpened(TABS type, InlineLabel tabHandler) {
		String tabHandlercurrent = "inlineButtonChecked";
		HTML5Element tab = (HTML5Element) tabHandler.getElement().cast();
		((HTML5Element)tab.getParentElement()).querySelector("."+tabHandlercurrent).getClassList().remove(tabHandlercurrent);
		tab.getClassList().add(tabHandlercurrent);
		
		HTML5Element contentParent = (HTML5Element) tabContent.getParentElement();
		contentParent.querySelector(".tabsContent .tabContent.tabContentCurrent").getClassList().remove("tabContentCurrent");
		contentParent.querySelector(".tabsContent .tabContent[data-tab=\""+type.toString()+"\"]").getClassList().add("tabContentCurrent");
        
		currentTab = type;
	}
	
	private void setTabVisible(TABS type, InlineLabel tabHandler){
		HTML5Element tab = (HTML5Element) tabHandler.getElement().cast();
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
		listener.performCopyAction(body);
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
	
	
	@UiHandler("forceOpenAsXML")
	void onForceOpenAsXML(ClickEvent e){
		e.preventDefault();
		forceOpenAsXML.addStyleName("hidden");
		final String body = response.getResponseText();
		setTabOpened(TABS.JSON, xmlTab);
		new XMLViewer(body, xmlPanel, response.getResponseXML());
		setTabVisible(TABS.JSON, xmlTab);
	}


	@Override
	public final native void setBackgroundResponseData(ResponseStatusData data) /*-{
		var cmp = this.@org.rest.client.ui.desktop.ResponseViewImpl::statusComponent;
		if(data === null) {
			cmp.requestHeaders = [];
			cmp.responseHeaders = [];
			cmp.redirectData = [];
		} else {
			cmp.requestHeaders = data.REQUEST_HEADERS;
			cmp.responseHeaders = data.RESPONSE_HEADERS;
			cmp.redirectData = data.REDIRECT_DATA;
		}
	}-*/;
	
	private final native void setResponseStatusHandlers(ResponseViewImpl context) /*-{
		var cmp = this.@org.rest.client.ui.desktop.ResponseViewImpl::statusComponent;
		if(!cmp) {
			console.error('There were no response status component. It should be.');
			return;
		}
		var linkHandler = $entry(function(e){
			var url = e.detail.link;
			if(!url) return;
			context.@org.rest.client.ui.desktop.ResponseViewImpl::fireUrlChangeEvent(Ljava/lang/String;)(url);
		});
		cmp.addEventListener('action-link', linkHandler);
		var listeners = context._detachListeners;
		if (!listeners) {
			listeners = new Map();
		}
		listeners.set('action-link', {
			element : cmp,
			fn : linkHandler,
			event : 'action-link'
		});
		context._detachListeners = listeners;
	}-*/;
	@Override
	protected void onDetach() {
		super.onDetach();
		nativeDetach(this);
	}
	/**
	 * Detach all function that has been attached to the DOM objects via JSNI.
	 * @param context
	 */
	private final native void nativeDetach(ResponseViewImpl context) /*-{
		var listeners = context._detachListeners;
		if (!listeners) {
			return;
		}
		listeners.forEach(function(value) {
			value.element.removeEventListener(value.event, value.fn);
		});
		context._detachListeners = null;
	}-*/;
}
