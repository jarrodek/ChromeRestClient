package com.kalicinscy.web.restclient.client.events;

import com.google.gwt.event.shared.EventHandler;

public interface SaveAndRestoreFormHandler extends EventHandler {
	
	/**
	 * Action for handle Ctrl + S user action
	 * (save request form state to storage).
	 */
	void onSaveAction();
	/**
	 * Action for handle Ctrl + O user action
	 * (open saved state from storage)
	 */
	void onRestoreAction();
}
