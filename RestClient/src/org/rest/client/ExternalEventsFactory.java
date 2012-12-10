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
package org.rest.client;

import java.util.Date;

import org.rest.client.event.AddEncodingEvent;
import org.rest.client.event.ApplicationReadyEvent;
import org.rest.client.event.ClearFormEvent;
import org.rest.client.event.ClearHistoryEvent;
import org.rest.client.event.CustomEvent;
import org.rest.client.event.HttpEncodingChangeEvent;
import org.rest.client.event.HttpMethodChangeEvent;
import org.rest.client.event.ProjectChangeEvent;
import org.rest.client.event.ProjectDeleteEvent;
import org.rest.client.event.RequestEndEvent;
import org.rest.client.event.RequestStartActionEvent;
import org.rest.client.event.URLFieldToggleEvent;
import org.rest.client.event.UrlValueChangeEvent;
import org.rest.client.storage.store.objects.ProjectObject;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.json.client.JSONBoolean;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.xhr2.client.Response;
import com.google.web.bindery.event.shared.EventBus;

/**
 * This class is needed to register application events handlers and fire it on
 * browsers document object so external plugins can take action when other
 * action occur.
 * 
 * <p>
 * To handle applications events you need to register an handler for each type
 * of event you need to handle. <br/>
 * For example:
 * <pre>
 * document.addEventListener('arc:EVENT_NAME', function(e){ //do something... });
 * </pre>
 * For list of all custom events check {@link CustomEvent} enum.
 * </p>
 * 
 * @author Paweł Psztyć
 * 
 */
public class ExternalEventsFactory {
	
	public final static String EXT_REQUEST_BEGIN = "requestBegin";
	public final static String EXT_GET_COLLECTED_REQUEST_DATA = "getRequestData";
	public final static String EXT_GET_EXTERNAL_REQUEST_DATA = "getExternalData";
	
	
	/**
	 * Register handlers for all custom events available for application.
	 * @param eventBus
	 */
	public static void init(EventBus eventBus) {
		
		//
		// Register application's actions handlers
		//
		
		ApplicationReadyEvent.register(eventBus, new ApplicationReadyEvent.Handler() {
			@Override
			public void onReady() {
				fireDocumentEvent(CustomEvent.APPLICATION_READY.getValue());
			}
		});
		AddEncodingEvent.register(eventBus, new AddEncodingEvent.Handler() {
			@Override
			public void onAddEncoding(String encoding) {
				fireDocumentEvent(CustomEvent.ADD_ENCODING.getValue(), encoding);
			}
		});
		UrlValueChangeEvent.register(eventBus, new UrlValueChangeEvent.Handler() {
			@Override
			public void onUrlChange(String url) {
				fireDocumentEvent(CustomEvent.URL_CHANGE.getValue(), url);
			}
		});
		RequestStartActionEvent.register(eventBus, new RequestStartActionEvent.Handler() {
			@Override
			public void onStart(Date time) {
				double startTime = (double) time.getTime();
				fireDocumentEvent(CustomEvent.REQUEST_START_ACTION.getValue(), startTime);
			}
		});
		
		RequestEndEvent.register(eventBus, new RequestEndEvent.Handler() {
			@Override
			public void onResponse(boolean success, Response response, long requestTime) {
				JSONObject obj = new JSONObject();
				obj.put("error", JSONBoolean.getInstance(!success));
				obj.put("requesttime", new JSONNumber(requestTime));
				fireDocumentEvent(CustomEvent.REQUEST_STOP.getValue(), obj.getJavaScriptObject());
			}
		});
		HttpEncodingChangeEvent.register(eventBus, new HttpEncodingChangeEvent.Handler() {
			@Override
			public void onChange(String method) {
				fireDocumentEvent(CustomEvent.HTTP_ENCODING_CHANGE.getValue(), method);
			}
		});
		
		
		
		//
		// Register application's UI state change handlers
		//
		
		ClearFormEvent.register(eventBus, new ClearFormEvent.Handler() {
			@Override
			public void onClearForm() {
				fireDocumentEvent(CustomEvent.CLEAR_ALL.getValue());
			}
		});
		URLFieldToggleEvent.register(eventBus, new URLFieldToggleEvent.Handler() {
			@Override
			public void onClearForm(boolean isNowSimpleView) {
				String value = "simple";
				if(!isNowSimpleView){
					value = "detailed";
				}
				fireDocumentEvent(CustomEvent.URL_FIELD_TOGGLE.getValue(), value);
			}
		});
		HttpMethodChangeEvent.register(eventBus, new HttpMethodChangeEvent.Handler() {
			@Override
			public void onMethodChange(String method) {
				fireDocumentEvent(CustomEvent.HTTP_METHOD_CHANGE.getValue(), method);
			}
		});
		ClearHistoryEvent.register(eventBus, new ClearHistoryEvent.Handler() {
			@Override
			public void onClearForm() {
				fireDocumentEvent(CustomEvent.CLEAR_HISTORY.getValue());
			}
		});
		
		ProjectChangeEvent.register(eventBus, new ProjectChangeEvent.Handler() {
			@Override
			public void onProjectChange(ProjectObject project) {
				fireDocumentEvent(CustomEvent.PROJECT_CHANGE.getValue(), project);
			}
		});
		ProjectDeleteEvent.register(eventBus, new ProjectDeleteEvent.Handler() {
			@Override
			public void onProjectDelete(int projectId) {
				fireDocumentEvent(CustomEvent.PROJECT_DELETE.getValue(), projectId+"");
			}
		});
	}
	
	private final static native void fireDocumentEvent(String eventName) /*-{
		var e = $doc.createEvent('Events');
		e.initEvent(eventName);
		$doc.dispatchEvent(e);
	}-*/;
	
	private final static native void fireDocumentEvent(String eventName,
			JavaScriptObject passedData) /*-{
		var e = $doc.createEvent('Events');
		e.initEvent(eventName);
		if(passedData){
			e.data = passedData;
		}
		$doc.dispatchEvent(e);
	}-*/;
	
	private final static native void fireDocumentEvent(String eventName,
			double passedData) /*-{
		var e = $doc.createEvent('Events');
		e.initEvent(eventName);
		if(passedData){
			e.data = passedData;
		}
		$doc.dispatchEvent(e);
	}-*/;
	
	private final static native void fireDocumentEvent(String eventName,
			String passedData) /*-{
		var e = $doc.createEvent('Events');
		e.initEvent(eventName);
		if(passedData){
			e.data = passedData;
		}
		$doc.dispatchEvent(e);
	}-*/;
	
	private final static native void fireDocumentEvent(String eventName,
			Object obj) /*-{
		var e = $doc.createEvent('Events');
		e.initEvent(eventName);
		e.data = obj;
		$doc.dispatchEvent(e);
	}-*/;
}