package org.rest.client.ui.desktop.widget;

import java.util.ArrayList;

import org.rest.client.chrome.worker.Worker;
import org.rest.client.chrome.worker.WorkerMessageHandler;
import org.rest.client.ui.html5.HTML5Element;
import org.rest.client.util.ElementWrapper;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.resources.client.CssResource;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.Element;
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
	
	
	public XMLViewer(String xml, HTMLPanel xmlPanel){
		initWidget(GWT.<Binder> create(Binder.class).createAndBindUi(this));
		xmlPanel.add(this);
		
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
		
//		addEditorSupport();
	}
	
	private final native void addNativeControls(Element element)/*-{
		element.addEventListener('click', function(e){
			if(!e.target) return;
			console.log(e.target);
			var parent = e.target.parentNode;
			var expanded = parent.dataset['expanded'];
			if(!expanded || expanded == "true"){
				parent.dataset['expanded'] = "false";
			} else {
				parent.dataset['expanded'] = "true";
			}
		}, true);
	}-*/;
	
	private void addEditorSupport(){
		HTML5Element root = (HTML5Element) result.getElement();
		ArrayList<HTML5Element> nodes = new ArrayList<HTML5Element>();
		root.querySelectorAll("div."+style.node(), nodes);
		int listCnt = nodes.size();
		for( int i=0; i< listCnt; i++ ){
			nodes.get(i).putData("id", i);
		}
		ArrayList<HTML5Element> arrows = new ArrayList<HTML5Element>();
		root.querySelectorAll("span."+style.arrowExpanded(), arrows);
		listCnt = arrows.size();
		
		for( int i=0; i < listCnt; i++ ){
			final HTML5Element currentElement = arrows.get(i);
			ElementWrapper wrapper = new ElementWrapper(currentElement);
			wrapper.addClickHandler(new ClickHandler() {
				@Override
				public void onClick(ClickEvent event) {
					boolean close = true;
					ArrayList<HTML5Element> markers = new ArrayList<HTML5Element>();
					HTML5Element parent = (HTML5Element)currentElement.getParentElement();
					parent.querySelectorAll("span."+style.arrowEmpty(),markers);
					
					HTML5Element marker = markers.get(markers.size()-1);
					
					if( parent.getClassList().contains(style.opened())){
						close = false;
						parent.getClassList().remove(style.opened());
						marker.setInnerText("");
					} else {
						parent.getClassList().add( style.opened() );
						marker.setInnerText("(...)");
					}
					
					String id = parent.getDataString("id");
					HTML5Element wrapper = (HTML5Element)parent.getParentElement();
					ArrayList<HTML5Element> nodes = new ArrayList<HTML5Element>();
					wrapper.querySelectorAll("div[data-id=\"" + id + "\"] > ." + style.node(), nodes);
					int cnt = nodes.size();
					for(int i = 0; i < cnt; i++){
						if( close ){
							nodes.get(i).getClassList().add("hidden");
						} else {
							nodes.get(i).getClassList().remove("hidden");
						}
					}
				}
			});
		}
	}
	
}