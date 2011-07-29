package com.restclient.client.widgets;

import java.util.ArrayList;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.Document;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.safehtml.shared.SafeHtmlUtils;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.TabLayoutPanel;
import com.google.gwt.user.client.ui.TextArea;
import com.google.gwt.user.client.ui.Anchor;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.restclient.client.html5.HTML5Element;

public class ResponseBody extends Composite {

	private static ResponseBodyUiBinder uiBinder = GWT
			.create(ResponseBodyUiBinder.class);
	@UiField TextArea bodyArea;
	@UiField Anchor parsedOpen;
	@UiField HTMLPanel xmlPanel;
	@UiField HTMLPanel jsonPanel;
	@UiField HTMLPanel parsedPanel;
	@UiField HTML plainBody;
	@UiField TabLayoutPanel bodyPanel;

	
	private boolean isError = false;
	private String body = "";
	private boolean useCodeMirror = false;
	private Document xml = null;
	private boolean showJsonPanel = false;
	
	interface ResponseBodyUiBinder extends UiBinder<Widget, ResponseBody> {
	}

	public ResponseBody() {
		initWidget(uiBinder.createAndBindUi(this));
		
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
		this.isError = false;
		this.body = "";
		this.useCodeMirror = false;
		this.xml = null;
		this.showJsonPanel = false;
		this.removeStyleName("error");
		plainBody.setHTML("");
		bodyArea.setValue("");
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
			bodyArea.setValue( body );
			bodyPanel.selectTab(1);
			loadCodeMirror(bodyArea.getElement());
		}
		
		if( this.showJsonPanel ){
			bodyPanel.selectTab(2);
			new JSONViewer(body, jsonPanel);
		}
		
		if( xml != null ){
			bodyPanel.selectTab(3);
			new XMLViewer(xml, xmlPanel);
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
	
	final native void loadCodeMirror(final com.google.gwt.dom.client.Element element)/*-{
		$wnd.CodeMirror.fromTextArea(element, {
			mode: "text/html",
			lineNumbers: true,
			readOnly: true
		});
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
