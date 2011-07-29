package com.restclient.client.html5;

import com.google.gwt.dom.client.Document;
import com.google.gwt.event.dom.client.ChangeEvent;
import com.google.gwt.event.dom.client.ChangeHandler;
import com.google.gwt.event.logical.shared.HasValueChangeHandlers;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.event.shared.HandlerRegistration;
import com.google.gwt.user.client.ui.FocusWidget;
import com.google.gwt.user.client.ui.HasValue;

public class HTML5Progress extends FocusWidget implements HasValue<Integer>,
		HasValueChangeHandlers<Integer> {

	private boolean valueChangeHandlerInitialized = false;

	public HTML5Progress() {
		super(Document.get().createElement("progress"));
		setStyleName("gwt-HTML5Progress");
	}

	public HandlerRegistration addChangeHandler(ChangeHandler handler) {
		return addDomHandler(handler, ChangeEvent.getType());
	}

	@Override
	public HandlerRegistration addValueChangeHandler(
			ValueChangeHandler<Integer> handler) {
		if (!valueChangeHandlerInitialized ) {
			valueChangeHandlerInitialized = true;
			addChangeHandler(new ChangeHandler() {
				public void onChange(ChangeEvent event) {
					ValueChangeEvent.fire(HTML5Progress.this, getValue());
				}
			});
		}
		return addHandler(handler, ValueChangeEvent.getType());
	}

	@Override
	public Integer getValue() {
		String value = getElement().getAttribute("value");
		if (value == null || value.equals("")) {
			return null;
		}
		return Integer.parseInt(value);
	}

	@Override
	public void setValue(Integer value) {
		getElement().setAttribute("value", String.valueOf(value));
	}

	@Override
	public void setValue(Integer value, boolean fireEvents) {
		Integer oldValue = getValue();
		getElement().setAttribute("value", String.valueOf(value));
		if (fireEvents) {
			ValueChangeEvent.fireIfNotEqual(this, oldValue, value);
		}
	}

	/**
	 * Sets max value attribute.
	 * 
	 * @param max
	 * @throws IllegalArgumentException
	 *             if value is null
	 */
	public void setMax(Integer max) throws IllegalArgumentException {
		if (max == null) {
			throw new IllegalArgumentException("MAX must to have value.");
		}
		getElement().setAttribute("max", String.valueOf(max));
	}

	/**
	 * Get max value attribute.
	 * 
	 * @return max attribute or null if not set
	 */
	public Integer getMax() {
		String max = getElement().getAttribute("max");
		if (max == null || max.equals("")) {
			return null;
		}
		return Integer.parseInt(max);
	}
}
