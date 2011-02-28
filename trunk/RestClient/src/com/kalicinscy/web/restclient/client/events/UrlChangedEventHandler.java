package com.kalicinscy.web.restclient.client.events;

import com.google.gwt.event.shared.EventHandler;

public interface UrlChangedEventHandler extends EventHandler {
	
	void onUrlChanged(UrlChangedEvent event);
}
