package com.kalicinscy.web.restclient.client.events;

import com.google.gwt.event.shared.EventHandler;

public interface PostDataChangedEventHandler extends EventHandler {
	void onDataChange(PostDataChangedEvent event);
}
