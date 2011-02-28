package com.kalicinscy.web.restclient.client.request;

import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.HandlerManager;
import com.google.gwt.event.shared.HandlerRegistration;
import com.google.gwt.event.shared.HasHandlers;
import com.kalicinscy.web.restclient.client.events.FormEncodingChangeEvent;
import com.kalicinscy.web.restclient.client.events.FormEncodingChangeHandler;
import com.kalicinscy.web.restclient.client.events.HeadersChangedEvent;
import com.kalicinscy.web.restclient.client.events.HeadersChangedEventHandler;
import com.kalicinscy.web.restclient.client.events.MethodChangedEvent;
import com.kalicinscy.web.restclient.client.events.MethodChangedHandler;
import com.kalicinscy.web.restclient.client.events.PostDataChangedEvent;
import com.kalicinscy.web.restclient.client.events.PostDataChangedEventHandler;
import com.kalicinscy.web.restclient.client.events.UrlChangedEvent;
import com.kalicinscy.web.restclient.client.events.UrlChangedEventHandler;

/**
 * Container for XMLHttpRequests parameters and for saving data to local
 * storage.
 * 
 * @author jarrod
 * 
 */
public class RequestParametersImpl implements HasHandlers {
	
	private HandlerManager handlerManager = new HandlerManager(this);

	@Override
	public void fireEvent(GwtEvent<?> event) {
		handlerManager.fireEvent(event);
	}

	public HandlerRegistration addUrlChangeHandler(ValueChangeHandler<String> handler){
		return null;
	}
	
	public HandlerRegistration addUrlChangedEventHandler(
			UrlChangedEventHandler handler) {
        return handlerManager.addHandler(UrlChangedEvent.TYPE, handler);
    }
	
	public HandlerRegistration addPostDataChangedEventHandler(
			PostDataChangedEventHandler handler) {
        return handlerManager.addHandler(PostDataChangedEvent.TYPE, handler);
    }
	
	public HandlerRegistration addHeadersChangedEventHandler(
			HeadersChangedEventHandler handler) {
        return handlerManager.addHandler(HeadersChangedEvent.TYPE, handler);
    }
	
	public HandlerManager getHandlers() {
		return handlerManager;
	}

	public HandlerRegistration addMethodChangedEventHandler(
			MethodChangedHandler handler) {
		return handlerManager.addHandler(MethodChangedEvent.TYPE, handler);
	}

	public HandlerRegistration addEncodingChangeHandler(
			FormEncodingChangeHandler handler) {
		return handlerManager.addHandler(FormEncodingChangeEvent.TYPE, handler);
	}

	
}
