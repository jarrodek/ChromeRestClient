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
import java.util.Iterator;
import java.util.List;

import org.rest.client.RestClient;
import org.rest.client.resources.AppCssResource;
import org.rest.client.resources.AppResources;
import org.rest.client.storage.store.objects.RequestObject;
import org.rest.client.storage.websql.HeaderRow;
import org.rest.client.storage.websql.StatusCodeRow;
import org.rest.client.ui.ResponseView;
import org.rest.client.ui.desktop.widget.JSONViewer;
import org.rest.client.ui.desktop.widget.ResponseHeaderLine;
import org.rest.client.ui.desktop.widget.StatusCodeInfo;
import org.rest.client.ui.desktop.widget.XMLViewer;
import org.rest.client.ui.html5.HTML5Element;
import org.rest.client.util.CodeMirrorElement;
import org.rest.client.util.CodeMirrorHelper;
import org.rest.client.util.JSONHeadersUtils;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JavaScriptException;
import com.google.gwt.core.client.Scheduler;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.dom.client.Document;
import com.google.gwt.dom.client.PreElement;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.MouseOutEvent;
import com.google.gwt.event.dom.client.MouseOutHandler;
import com.google.gwt.event.dom.client.MouseOverEvent;
import com.google.gwt.event.dom.client.MouseOverHandler;
import com.google.gwt.regexp.shared.MatchResult;
import com.google.gwt.regexp.shared.RegExp;
import com.google.gwt.resources.client.CssResource;
import com.google.gwt.safehtml.shared.SafeHtmlUtils;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.Anchor;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.Image;
import com.google.gwt.user.client.ui.InlineLabel;
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
	static String codeMirrorParsed = "";
	private CodeMirrorHelper codeMirrorHelper = null;
	static final int WORK_CHUNK = 10;
	
	AppCssResource appStyle = AppResources.INSTANCE.appCss();
	
	@UiField Image codeImage;
	@UiField InlineLabel loadingTime;
	@UiField InlineLabel codeContainer;
	@UiField HTMLPanel headersPanel;
	@UiField InlineLabel rawTab;
	@UiField InlineLabel xmlTab;
	@UiField InlineLabel jsonTab;
	@UiField InlineLabel parsedTab;
	@UiField DivElement tabContent;
	@UiField HTML plainBody;
	@UiField Anchor parsedOpen;
	@UiField PreElement parsedBody;
	@UiField HTMLPanel xmlPanel;
	@UiField HTMLPanel jsonPanel;
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
		handleTabsChange();
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
			codeContainer.getElement().addClassName(style.error());
		} else if( code >= 400 && code < 500 ){
			codeContainer.getElement().addClassName(style.warning());
		}
		String txt = "<strong>" + code + "</strong>";
		if (msg != null && !msg.equals("")) {
			txt += " " + msg;
		} else if (code == 0) {
			txt += " NO RESPONSE";
		}
		codeContainer.getElement().setInnerHTML(txt);
		codeImage.setVisible(true);
		codeImage.addClickHandler(statusCodeHintHandler);
		
		
		//
		// Set request time
		//
		loadingTime.getElement().setInnerText(String.valueOf(requestTime));
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
		
		String escaped = SafeHtmlUtils.htmlEscape(body);
		boolean useCodeMirror = false;
		
		if(xml != null){
			isXML = true;
		}
		if(!isXML){
			Header[] headers = response.getHeaders();
			//check if response has JSON header:
			if(isJSONHeader(headers)){
				isJSON = true;
			}
		}
		if(!isJSON && !isXML){
			//just HTML
			useCodeMirror = true;
		}
		
		
		if(escaped.equals("")){
			xml = null;
			isXML = false;
			Element info = DOM.createSpan();
			info.setInnerText( "Response does not contain any data." );
			info.addClassName("note italic");
			plainBody.getElement().appendChild(info);
			setTabOpened(TABS.RAW, rawTab);
			return;
		} else {
			plainBody.setHTML(escaped);
		}
		
		if(useCodeMirror){
			setTabOpened(TABS.PARSED, parsedTab);
			if(RestClient.isDebug()){
				Log.debug("Initialize code mirror...");
			}
			codeMirrorHelper = new CodeMirrorHelper();
			try{
				loadCodeMirror(body);
			} catch(Exception e){
				if(RestClient.isDebug()){
					Log.warn("Unable to load CodeMirror.",e );
				}
			}
			//show this tab
			setTabVisible(TABS.PARSED, parsedTab);
		}
		if(isJSON){
			setTabOpened(TABS.JSON, jsonTab);
			new JSONViewer(body, jsonPanel);
			setTabVisible(TABS.JSON, jsonTab);
		}
		if(isXML){
			setTabOpened(TABS.XML, xmlTab);
			new XMLViewer(xml, xmlPanel);
			setTabVisible(TABS.XML, xmlTab);
		}
		if(RestClient.isDebug()){
			Log.debug("Response panel has been filled wint new data");
		}
	}
	
	
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
	
	
	/**
	 * Load code mirror library.
	 * @param text
	 * @throws JavaScriptException
	 */
	final native void loadCodeMirror(String text) throws JavaScriptException /*-{
		var context = this;
		var clb = $entry(function(a,b) {
			context.@org.rest.client.ui.desktop.ResponseViewImpl::codeMirrorParseCallback(Ljava/lang/String;Ljava/lang/String;)(a,b);
		});
		var ready = $entry(function() {
			context.@org.rest.client.ui.desktop.ResponseViewImpl::codeMirrorParsedCallback()();
		});
		try{
			$wnd.CodeMirror.runMode(text, "text/html", clb, ready);
		} catch(e){
			$wnd.alert("Unable to initialize CodeMirror :( " + e.message);
		}
	}-*/;
	public void codeMirrorParseCallback(String str, String style){
		CodeMirrorElement element = new CodeMirrorElement(str, style);
		codeMirrorHelper.add(element);
	}
	
	/**
	 * First, after CodeMirror finish work via RepeatingCommand parse collected elements.
	 * Next call {@link #setResponseLinks()} to parse anchors.
	 */
	void codeMirrorParsedCallback(){
		Scheduler.RepeatingCommand rc = new Scheduler.RepeatingCommand() {
			@Override
			public boolean execute() {
				Iterator<CodeMirrorElement> it = codeMirrorHelper.iterator();
				int loopCount = 0;
				while(it.hasNext()){
					loopCount++;
					codeMirrorParsed += it.next().parse();
					if(loopCount >= WORK_CHUNK){
						return true;
					}
				}
				setResponseLinks();
				return false;
			}
		};
		Scheduler.get().scheduleIncremental(rc);
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
	
	
	private void setResponseLinks(){
		getRequestDomainAndPath(new Callback<String, Throwable>() {
			@Override
			public void onSuccess(final String domainAndPath) {
				String _domain = domainAndPath;
				int domainSlashPos = domainAndPath.indexOf("/", domainAndPath.indexOf("://")+3);
				if(domainSlashPos > 0){
					_domain = domainAndPath.substring(0,domainSlashPos);
				}
				final String domain = _domain;
				final RegExp r = RegExp.compile("<span class=\"cm-attribute\">(href|src)+</span>=<span class=\"cm-string\">[\\&quot;]*([^<\"\\&]+)[\\&quot;]*</span>", "gim");
				
				Scheduler.RepeatingCommand rc = new Scheduler.RepeatingCommand() {
					@Override
					public boolean execute() {
						int loopCount = 0;
						MatchResult matcher = null;
						while((matcher = r.exec(codeMirrorParsed)) != null){
							loopCount++;
							
							int cnt = matcher.getGroupCount();
							if(cnt != 3) continue;
							String wholeLine = matcher.getGroup(0);
							String attrName = matcher.getGroup(1);
							String url = matcher.getGroup(2);
							String fullHref = "";
							if(url.contains("://")){
								fullHref = url;
							} else if(url.startsWith("/")){
								fullHref = domain + url;
							} else {
								fullHref = domainAndPath + url;
							}
							
							String replacement = "<span class=\"cm-attribute\">";
							replacement += attrName + "</span>=<span class=\"cm-string\">";
							replacement += "\"<a target=\"_blank\" href=\""+fullHref+"\">"+url+"</a>\"</span>";
							
							codeMirrorParsed = codeMirrorParsed.replace(wholeLine, replacement);
							if(loopCount >= WORK_CHUNK){
								return true;
							}
						}
						parsedBody.setInnerHTML(codeMirrorParsed);
						//clean up
						codeMirrorParsed = null;
						codeMirrorHelper.clear();
						return false;
					}
				};
				Scheduler.get().scheduleIncremental(rc);
			}
			
			@Override
			public void onFailure(Throwable reason) {
				if(RestClient.isDebug()){
					Log.debug("Unable to set anchors in sesponse view.", reason);
				}
			}
		});
	}
	
	@Override
	public void clear() {
		
	}
	
	public enum TABS { 
		RAW("raw"), 
		XML("xml"), 
		JSON("json"), 
		PARSED("parsed");
		
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
				if(!tab.getClassList().contains(appStyle.inlineButtonChecked()))
					tab.getClassList().add(appStyle.inlineButtonHover());
			}
		});
		rawTab.addMouseOutHandler(new MouseOutHandler() {
			@Override
			public void onMouseOut(MouseOutEvent event) {
				HTML5Element tab = (HTML5Element) rawTab.getElement();
				if(!tab.getClassList().contains(appStyle.inlineButtonHover()))
					tab.getClassList().remove(appStyle.inlineButtonHover());
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
				if(!tab.getClassList().contains(appStyle.inlineButtonChecked()))
					tab.getClassList().add(appStyle.inlineButtonHover());
			}
		});
		parsedTab.addMouseOutHandler(new MouseOutHandler() {
			@Override
			public void onMouseOut(MouseOutEvent event) {
				HTML5Element tab = (HTML5Element) parsedTab.getElement();
				if(!tab.getClassList().contains(appStyle.inlineButtonHover()))
					tab.getClassList().remove(appStyle.inlineButtonHover());
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
				if(!tab.getClassList().contains(appStyle.inlineButtonChecked()))
					tab.getClassList().add(appStyle.inlineButtonHover());
			}
		});
		xmlTab.addMouseOutHandler(new MouseOutHandler() {
			@Override
			public void onMouseOut(MouseOutEvent event) {
				HTML5Element tab = (HTML5Element) xmlTab.getElement();
				if(tab.getClassList().contains(appStyle.inlineButtonHover()))
					tab.getClassList().remove(appStyle.inlineButtonHover());
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
//				if(!tab.getClassList().contains(appStyle.inlineButtonChecked()))
					tab.getClassList().add(appStyle.inlineButtonHover());
			}
		});
		jsonTab.addMouseOutHandler(new MouseOutHandler() {
			@Override
			public void onMouseOut(MouseOutEvent event) {
				HTML5Element tab = (HTML5Element) jsonTab.getElement();
				if(tab.getClassList().contains(appStyle.inlineButtonHover()))
					tab.getClassList().remove(appStyle.inlineButtonHover());
			}
		});
	}
	
	private void setTabOpened(TABS type, InlineLabel tabHandler) {
		String tabHandlercurrent = appStyle.inlineButtonChecked();
		HTML5Element tab = (HTML5Element) tabHandler.getElement();
		((HTML5Element)tab.getParentElement()).querySelector("."+tabHandlercurrent).getClassList().remove(tabHandlercurrent);
		tab.getClassList().add(tabHandlercurrent);
		
		HTML5Element contentParent = (HTML5Element) tabContent.getParentElement();
		contentParent.querySelector("." + appStyle.tabsContent() + " ." + appStyle.tabContent() + "." + appStyle.tabContentCurrent()).getClassList().remove(appStyle.tabContentCurrent());
		contentParent.querySelector("." + appStyle.tabsContent() + " ." + appStyle.tabContent() + "[data-tab=\""+type.toString()+"\"]").getClassList().add(appStyle.tabContentCurrent());
        
		currentTab = type;
	}
	
	private void setTabVisible(TABS type, InlineLabel tabHandler){
		HTML5Element tab = (HTML5Element) tabHandler.getElement();
		tab.getClassList().remove(appStyle.hidden());
		HTML5Element contentParent = (HTML5Element) tabContent.getParentElement();
		contentParent.querySelector("." + appStyle.tabsContent() + " ." + appStyle.tabContent() + "[data-tab=\""+type.toString()+"\"]").getClassList().remove(appStyle.hidden());
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
}
