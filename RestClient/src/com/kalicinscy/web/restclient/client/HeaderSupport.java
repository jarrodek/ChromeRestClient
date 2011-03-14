package com.kalicinscy.web.restclient.client;

import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.event.shared.HandlerRegistration;

public interface HeaderSupport {
	/**
	 * Sets current value to parse on load.
	 * @param value
	 */
	public void setValue(String value);
	/**
	 * Display dialog box.
	 * 
	 */
	public void openDialog();
	/**
	 * Add hendler to handle vaue change
	 * @return 
	 */
	public HandlerRegistration addValueChangeHandler(ValueChangeHandler<String> handler);
}
