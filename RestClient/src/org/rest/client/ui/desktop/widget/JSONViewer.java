package org.rest.client.ui.desktop.widget;

import org.rest.client.RestClient;
import org.rest.client.chrome.worker.Worker;
import org.rest.client.chrome.worker.WorkerMessageHandler;
import org.rest.client.event.OverwriteUrlEvent;
import org.rest.client.resources.AppCssResource;
import org.rest.client.resources.AppResources;

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

public class JSONViewer extends Composite {
	
	interface Binder extends UiBinder<Widget, JSONViewer> {}
	interface ParserStyle extends CssResource {
		String prettyPrint();
		String numeric();
		String nullValue();
		String booleanValue();
		String punctuation();
		String stringValue();
		String node();
		String arrayCounter();
		String keyName();
		String rootElementToggleButton();
		String infoRow();
		String brace();
	}
	@UiField HTML result;
	@UiField ParserStyle style;
	AppCssResource appStyle = AppResources.INSTANCE.appCss();
	
	
	public JSONViewer(final String data, final HTMLPanel jsonPanel) {
		initWidget(GWT.<Binder> create(Binder.class).createAndBindUi(this));
		jsonPanel.add(JSONViewer.this);
		
		new Timer() {
			@Override
			public void run() {
				Worker jsonWorker =  new Worker("/workers/jsonviewer.js");
				jsonWorker.onMessage(new WorkerMessageHandler() {
					@Override
					public void onMessage(String message) {
						result.setHTML(message);
						addNativeControls(result.getElement());
					}
				});
				
				JSONObject styleData = new JSONObject();
				styleData.put("prettyPrint", new JSONString(style.prettyPrint()));
				styleData.put("numeric", new JSONString(style.numeric()));
				styleData.put("nullValue", new JSONString(style.nullValue()));
				styleData.put("booleanValue", new JSONString(style.booleanValue()));
				styleData.put("punctuation", new JSONString(style.punctuation()));
				styleData.put("stringValue", new JSONString(style.stringValue()));
				styleData.put("node", new JSONString(style.node()));
				styleData.put("arrayCounter", new JSONString(style.arrayCounter()));
				styleData.put("keyName", new JSONString(style.keyName()));
				styleData.put("rootElementToggleButton", new JSONString(style.rootElementToggleButton()));
				styleData.put("infoRow", new JSONString(style.infoRow()));
				styleData.put("brace", new JSONString(style.brace()));
				
				JSONObject post = new JSONObject();
				post.put("style", styleData);
				post.put("data", new JSONString(data));
				
				jsonWorker.postMessage(post.toString());
			}
		}.schedule(300);
	}
	
	static final void fireUrlChangeEvent(String url){
		RestClient.getClientFactory().getEventBus().fireEvent(new OverwriteUrlEvent(url));
	}
	
	
	private final native void addNativeControls(Element element)/*-{
		element.addEventListener('click', function(e){
			if(!e.target) return;
			
			if(e.target.nodeName == "A"){
				e.preventDefault();
				var url = e.target.getAttribute('href');
				@org.rest.client.ui.desktop.widget.JSONViewer::fireUrlChangeEvent(Ljava/lang/String;)(url);
				return;
			}
			
			
			var toggleId = e.target.dataset['toggle'];
			if(!toggleId) return;
			var parent = this.querySelector('div[data-element="'+toggleId+'"]');
			if(!parent) return;
			
			var expanded = parent.dataset['expanded'];
			if(!expanded || expanded == "true"){
				parent.dataset['expanded'] = "false";
			} else {
				parent.dataset['expanded'] = "true";
			}
		}, true);
	}-*/;
	
}
