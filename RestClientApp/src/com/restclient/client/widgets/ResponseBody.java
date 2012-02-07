package com.restclient.client.widgets;

import java.util.ArrayList;
import java.util.Iterator;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JavaScriptException;
import com.google.gwt.core.client.Scheduler;
import com.google.gwt.dom.client.Document;
import com.google.gwt.dom.client.PreElement;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.regexp.shared.MatchResult;
import com.google.gwt.regexp.shared.RegExp;
import com.google.gwt.safehtml.shared.SafeHtmlUtils;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.TabLayoutPanel;
import com.google.gwt.user.client.ui.Anchor;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.restclient.client.RestApp;
import com.restclient.client.html5.HTML5Element;
import com.restclient.client.request.RequestParameters;
import com.restclient.client.utils.CodeMirrorElement;
import com.restclient.client.utils.CodeMirrorHelper;

public class ResponseBody extends Composite {

	private static ResponseBodyUiBinder uiBinder = GWT
			.create(ResponseBodyUiBinder.class);
	@UiField Anchor parsedOpen;
	@UiField HTMLPanel xmlPanel;
	@UiField HTMLPanel jsonPanel;
	@UiField HTMLPanel parsedPanel;
	@UiField HTML plainBody;
	@UiField TabLayoutPanel bodyPanel;
	@UiField PreElement parsedBody;
	
	private boolean isError = false;
	private String body = "";
	private boolean useCodeMirror = false;
	private Document xml = null;
	private boolean showJsonPanel = false;
	static String codeMirrorParsed = "";
	private CodeMirrorHelper codeMirrorHelper = null;
	static final int WORK_CHUNK = 10;
	
	interface ResponseBodyUiBinder extends UiBinder<Widget, ResponseBody> {
	}

	public ResponseBody() {
		initWidget(uiBinder.createAndBindUi(this));
		codeMirrorHelper = new CodeMirrorHelper();
		for (int i = 0; i < bodyPanel.getWidgetCount(); i++) {
	        final Widget widget = bodyPanel.getWidget(i);
	        DOM.setStyleAttribute(widget.getElement(), "position", "relative");

	        Element parent = DOM.getParent(widget.getElement());
	        Element parent2 = DOM.getParent(parent);
	        Element parent3 = DOM.getParent(parent2);
	        DOM.setStyleAttribute(parent2, "position", "relative");
	        DOM.setStyleAttribute(parent3, "position", "relative");
	        DOM.setStyleAttribute(parent, "position", "relative");
	        DOM.setStyleAttribute(parent, "overflowX", "visible");
	        DOM.setStyleAttribute(parent, "overflowY", "visible");
	    }
	}
	
	public void clearData(){
		if(RestApp.isDebug()){
			Log.debug("Restore response panel state to initial");
		}
		parsedBody.setInnerText("loading...");
		codeMirrorParsed = "";
		codeMirrorHelper.clear();
		this.isError = false;
		this.body = "";
		this.useCodeMirror = false;
		this.xml = null;
		this.showJsonPanel = false;
		this.removeStyleName("error");
		plainBody.setHTML("");
		jsonPanel.clear();
		xmlPanel.clear();
		HTML5Element panel = (HTML5Element) parsedPanel.getElement();
		ArrayList<HTML5Element> nodes = new ArrayList<HTML5Element>();
		panel.querySelectorAll("div.CodeMirror", nodes);
		int listCnt = nodes.size();
		for( int i=0; i< listCnt; i++ ){
			nodes.get(i).removeFromParent();
		}
	}
	
	public void setBody(String body){
		this.body = body;
	}
	
	public void createResponse() {
		if( this.isError ){
			bodyPanel.getTabWidget(1).getParent().setVisible(false);
			bodyPanel.getTabWidget(2).getParent().setVisible(false);
			bodyPanel.getTabWidget(3).getParent().setVisible(false);
			Element info = DOM.createSpan();
			info.setInnerText( "Response does not contain any data." );
			info.addClassName("note italic");
			plainBody.getElement().appendChild(info);
			this.addStyleName("error");
			bodyPanel.selectTab(0);
			return;
		}
		String escaped = SafeHtmlUtils.htmlEscape( this.body );
		
		if( escaped.equals("") ){
			this.useCodeMirror = false;
			this.showJsonPanel = false;
			this.xml = null;
			Element info = DOM.createSpan();
			info.setInnerText( "Response does not contain any data." );
			info.addClassName("note italic");
			plainBody.getElement().appendChild(info);
			bodyPanel.selectTab(0);
		} else {
			this.plainBody.setHTML(escaped);
		}
		
		bodyPanel.getTabWidget(1).getParent().setVisible(this.useCodeMirror);
		bodyPanel.getTabWidget(2).getParent().setVisible(this.showJsonPanel);
		bodyPanel.getTabWidget(3).getParent().setVisible(xml!=null);
		
		if( this.useCodeMirror ){
			bodyPanel.selectTab(1);
			if(RestApp.isDebug()){
				Log.debug("Initialize code mirror...");
			}
			try{
			loadCodeMirror(body);
			} catch(Exception e){}
			if(RestApp.isDebug()){
				Log.debug("Parsing anchors in response body...");
			}
		}
		
		if( this.showJsonPanel ){
			bodyPanel.selectTab(2);
			new JSONViewer(body, jsonPanel);
		}
		
		if( xml != null ){
			bodyPanel.selectTab(3);
			new XMLViewer(xml, xmlPanel);
		}
		if(RestApp.isDebug()){
			Log.debug("Response panel has been filled wint new data");
		}
	}

	public void setParse(boolean parse) {
		this.useCodeMirror = parse;
		
	}

	public void setJSON(boolean showJson) {
		this.showJsonPanel  = showJson;
	}

	public void setXML(Document xml) {
		this.xml = xml;
	}

	public void setNoResponse() {
		this.isError = true;
	}
	
	
	private void setResponseLinks(){
		final String domainAndPath = getRequestDomainAndPath();
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
	
	
	private String getRequestDomainAndPath(){
		String url = RequestParameters.getUrl();
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
		return url;
	}
	
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
	
	/**
	 * Load code mirror library.
	 * @param text
	 * @throws JavaScriptException
	 */
	final native void loadCodeMirror(String text) throws JavaScriptException /*-{
		var context = this;
		var clb = $entry(function(a,b) {
			context.@com.restclient.client.widgets.ResponseBody::codeMirrorParseCallback(Ljava/lang/String;Ljava/lang/String;)(a,b);
		});
		var ready = $entry(function() {
			context.@com.restclient.client.widgets.ResponseBody::codeMirrorParsedCallback()();
		});
		try{
			$wnd.CodeMirror.runMode(text, "text/html", clb, ready);
		} catch(e){
			$wnd.alert("Unable to initialize CodeMirror :( " + e.message);
		}
	}-*/;
	
	@UiHandler("parsedOpen")
	public void onOpen(ClickEvent event){
		event.preventDefault();
		writeRawBody(this.body);
	}
	private final native void writeRawBody(String body)/*-{
		var wnd = $wnd.open();
		wnd.document.body.innerHTML = body;
	}-*/;
}
