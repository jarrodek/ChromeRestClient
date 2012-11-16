package org.rest.client.ui.desktop.widget;

import org.rest.client.dom.worker.Worker;
import org.rest.client.dom.worker.WorkerMessageHandler;

import com.google.gwt.core.client.GWT;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.Timer;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.Widget;

public class XMLViewer extends Composite {
	
	interface Binder extends UiBinder<Widget, XMLViewer> {}
	
	@UiField HTML result;
	
	public XMLViewer(final String xml, HTMLPanel xmlPanel){
		initWidget(GWT.<Binder> create(Binder.class).createAndBindUi(this));
		xmlPanel.add(this);
		
		new Timer() {
			@Override
			public void run() {
				Worker xmlWorker =  new Worker("/workers/xmlviewer.js");
				xmlWorker.onMessage(new WorkerMessageHandler() {
					@Override
					public void onMessage(String message) {
						result.setHTML(message);
						addNativeControls(result.getElement());
					}
				});
				
				
				JSONObject styleData = new JSONObject();
				styleData.put("prettyPrint", new JSONString("XML_parser_prettyPrint"));
				styleData.put("node", new JSONString("XML_parser_node"));
				styleData.put("punctuation", new JSONString("XML_parser_punctuation"));
				styleData.put("comment", new JSONString("XML_parser_comment"));
				styleData.put("tagname", new JSONString("XML_parser_tagname"));
				styleData.put("attname", new JSONString("XML_parser_attname"));
				styleData.put("attribute", new JSONString("XML_parser_attribute"));
				styleData.put("cdata", new JSONString("XML_parser_cdata"));
				styleData.put("inline", new JSONString("XML_parser_inline"));
				styleData.put("arrowExpanded", new JSONString("XML_parser_arrowExpanded"));
				styleData.put("arrowEmpty", new JSONString("XML_parser_arrowEmpty"));
				styleData.put("processing", new JSONString("XML_parser_processing"));
				styleData.put("opened", new JSONString("XML_parser_opened"));
				styleData.put("nodeMargin", new JSONString("XML_parser_nodeMargin"));
				styleData.put("collapseIndicator", new JSONString("XML_parser_collapseIndicator"));
				
				
				JSONObject post = new JSONObject();
				post.put("style", styleData);
				post.put("data", new JSONString(xml));
				
				xmlWorker.postMessage(post.getJavaScriptObject());
			}
		}.schedule(300);
	}
	
	private final native void addNativeControls(Element element)/*-{
		element.addEventListener('click', function(e){
			if(!e.target) return;
			if(!e.target.getAttribute("colapse-marker")) return;
			var parent = e.target.parentNode;
			var expanded = parent.dataset['expanded'];
			if(!expanded || expanded == "true"){
				parent.dataset['expanded'] = "false";
			} else {
				parent.dataset['expanded'] = "true";
			}
		}, true);
	}-*/;
}