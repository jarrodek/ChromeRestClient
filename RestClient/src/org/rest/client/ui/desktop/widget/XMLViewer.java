package org.rest.client.ui.desktop.widget;

import org.rest.client.dom.worker.Worker;
import org.rest.client.dom.worker.WorkerMessageHandler;

import com.google.gwt.core.client.GWT;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.resources.client.CssResource;
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
	
	interface ParserStyle extends CssResource {
		
		String prettyPrint();
		String comment();
		String punctuation();
		String tagname();
		String attname();
		String attribute();
		String cdata();
		String inline();
		String arrowExpanded();
		String arrowEmpty();
		String processing();
		String node();
		String opened();
		String nodeMargin();
		String collapseIndicator();
	}
	
	@UiField HTML result;
	@UiField ParserStyle style;
	
	
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
				styleData.put("prettyPrint", new JSONString(style.prettyPrint()));
				styleData.put("node", new JSONString(style.node()));
				styleData.put("punctuation", new JSONString(style.punctuation()));
				styleData.put("comment", new JSONString(style.comment()));
				styleData.put("tagname", new JSONString(style.tagname()));
				styleData.put("attname", new JSONString(style.attname()));
				styleData.put("attribute", new JSONString(style.attribute()));
				styleData.put("cdata", new JSONString(style.cdata()));
				styleData.put("inline", new JSONString(style.inline()));
				styleData.put("arrowExpanded", new JSONString(style.arrowExpanded()));
				styleData.put("arrowEmpty", new JSONString(style.arrowEmpty()));
				styleData.put("processing", new JSONString(style.processing()));
				styleData.put("opened", new JSONString(style.opened()));
				styleData.put("nodeMargin", new JSONString(style.nodeMargin()));
				styleData.put("collapseIndicator", new JSONString(style.collapseIndicator()));
				
				
				JSONObject post = new JSONObject();
				post.put("style", styleData);
				post.put("data", new JSONString(xml));
				
				xmlWorker.postMessage(post.toString());
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