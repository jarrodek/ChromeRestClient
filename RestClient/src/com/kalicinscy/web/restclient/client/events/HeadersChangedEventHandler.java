package com.kalicinscy.web.restclient.client.events;

import com.google.gwt.event.shared.EventHandler;

public interface HeadersChangedEventHandler extends EventHandler {
	void onHeaderChange(HeadersChangedEvent event);
}
