package org.rest.client.ui.desktop.widget;

import org.rest.client.RestClient;
import org.rest.client.dom.worker.WebWorkerError;
import org.rest.client.dom.worker.Worker;
import org.rest.client.dom.worker.WorkerMessageHandler;
import org.rest.client.event.OverwriteUrlEvent;
import org.rest.client.request.URLParser;
import org.rest.client.storage.store.objects.RequestObject;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.dom.client.Element;
import com.google.gwt.user.client.Timer;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.Widget;

public class JSONViewer extends Composite {
	
	interface Binder extends UiBinder<Widget, JSONViewer> {}
	@UiField HTML result;
	
	
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

					@Override
					public void onError(WebWorkerError err) {
						if(RestClient.isDebug()){
							Log.error("Error in web worker", err);
						}
					}
				});
				JSONObject styleData = new JSONObject();
				styleData.put("prettyPrint", new JSONString("JSON_parser_prettyPrint"));
				styleData.put("numeric", new JSONString("JSON_parser_numeric"));
				styleData.put("nullValue", new JSONString("JSON_parser_nullValue"));
				styleData.put("booleanValue", new JSONString("JSON_parser_booleanValue"));
				styleData.put("punctuation", new JSONString("JSON_parser_punctuation"));
				styleData.put("stringValue", new JSONString("JSON_parser_stringValue"));
				styleData.put("node", new JSONString("JSON_parser_node"));
				styleData.put("arrayCounter", new JSONString("JSON_parser_arrayCounter"));
				styleData.put("keyName", new JSONString("JSON_parser_keyName"));
				styleData.put("rootElementToggleButton", new JSONString("JSON_parser_rootElementToggleButton"));
				styleData.put("infoRow", new JSONString("JSON_parser_infoRow"));
				styleData.put("brace", new JSONString("JSON_parser_brace"));
				styleData.put("arrayKeyNumber", new JSONString("JSON_parser_arrayKeyNumber"));
				
				JSONObject post = new JSONObject();
				post.put("style", styleData);
				post.put("data", new JSONString(data));
				jsonWorker.postMessage(post.getJavaScriptObject());
			}
		}.schedule(300);
	}
	
	static final void fireUrlChangeEvent(final String url){
		if(url.startsWith("/")){
			RestClient.collectRequestData(new Callback<RequestObject, Throwable>() {
				@Override
				public void onSuccess(RequestObject result) {
					String rootUrl = result.getURL();
					URLParser urlData = new URLParser().parse(rootUrl);
					String protocol = urlData.getProtocol();
					String authority = urlData.getAuthority();
					String newUrl = protocol + "://" + authority + url;
					RestClient.getClientFactory().getEventBus().fireEvent(new OverwriteUrlEvent(newUrl));
				}
				@Override
				public void onFailure(Throwable reason) {
					RestClient.getClientFactory().getEventBus().fireEvent(new OverwriteUrlEvent(url));
				}
			});
		} else {
			RestClient.getClientFactory().getEventBus().fireEvent(new OverwriteUrlEvent(url));
		}
	}
	
	
	private final native void addNativeControls(Element element)/*-{
		element.addEventListener('click', function(e){
			if(!e.target) return;
			
			if(e.target.nodeName == "A"){
				e.preventDefault();
				var url = e.target.getAttribute('href');
				@org.rest.client.ui.desktop.widget.JSONViewer::fireUrlChangeEvent(Ljava/lang/String;)(url);
				$wnd.scrollTo(0,0);
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
