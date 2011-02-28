package com.kalicinscy.web.restclient.client.events;

import com.google.gwt.event.shared.EventHandler;

public interface MethodChangedHandler extends EventHandler {
	void onMethodChange(MethodChangedEvent event);
}
