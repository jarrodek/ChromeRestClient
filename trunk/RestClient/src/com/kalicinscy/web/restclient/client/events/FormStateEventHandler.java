package com.kalicinscy.web.restclient.client.events;

import com.google.gwt.event.shared.EventHandler;

public interface FormStateEventHandler extends EventHandler {
	/**
	 * Action when "send" button has been pressed
	 */
	void onSend();
	
	/**
	 * Action for "clear" button clicked.
	 */
	void onClear();
}
