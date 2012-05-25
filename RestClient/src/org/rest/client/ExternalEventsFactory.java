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

import org.rest.client.event.AddEncodingEvent;
import org.rest.client.event.ApplicationReadyEvent;
import org.rest.client.event.ClearFormEvent;
import org.rest.client.event.CustomEvent;
import org.rest.client.event.HttpMethodChangeEvent;
import org.rest.client.event.RequestStartActionEvent;
import org.rest.client.event.RequestStopEvent;
import org.rest.client.event.URLFieldToggleEvent;
import org.rest.client.event.UrlValueChangeEvent;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.JavaScriptObject;
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
				Log.debug("Url change event!: " +url);
				fireDocumentEvent(CustomEvent.URL_CHANGE.getValue(), url);
			}
		});
		RequestStartActionEvent.register(eventBus, new RequestStartActionEvent.Handler() {
			@Override
			public void onStart(long time) {
				double startTime = (double) time;
				Log.debug("Request start event!: " +time);
				fireDocumentEvent(CustomEvent.REQUEST_START_ACTION.getValue(), startTime);
			}
		});
		RequestStopEvent.register(eventBus, new RequestStopEvent.Handler() {
			@Override
			public void onStop(long time) {
				double endTime = (double) time;
				fireDocumentEvent(CustomEvent.REQUEST_STOP.getValue(), endTime);
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
}
