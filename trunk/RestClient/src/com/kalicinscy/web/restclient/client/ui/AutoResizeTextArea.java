package com.kalicinscy.web.restclient.client.ui;

import com.google.gwt.dom.client.Style;
import com.google.gwt.dom.client.Style.Overflow;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.KeyDownHandler;
import com.google.gwt.event.dom.client.KeyUpEvent;
import com.google.gwt.event.dom.client.KeyUpHandler;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.user.client.ui.TextArea;

public class AutoResizeTextArea extends TextArea implements KeyDownHandler, KeyUpHandler, ValueChangeHandler<String> {
	private int minHeight = 21;
//	private int origHeight = 0;
	
	public AutoResizeTextArea(){
		super();
		this.addValueChangeHandler(this);
		this.addKeyDownHandler(this);
		this.addKeyUpHandler(this);
		Style style = this.getElement().getStyle();
		style.setOverflowY(Overflow.HIDDEN);
//		origHeight = this.getElement().getScrollHeight();
//		Node clone = this.getElement().cloneNode(true);
	}
	
	private void fitToText(){
//		int lenght = this.getValue().length();
//		int eWidth = this.getOffsetWidth();
		int scrollHeight = this.getElement().getScrollHeight();
		int h = Math.max(minHeight, scrollHeight);
		this.setHeight( h+"px" );
	}
	
	@Override
	public void onKeyUp(KeyUpEvent event) {
		fitToText();
	}

	@Override
	public void onKeyDown(KeyDownEvent event) {
		fitToText();
	}

	/**
	 * @param minHeight the minHeight to set
	 */
	public void setMinHeight(int minHeight) {
		this.minHeight = minHeight;
	}

	/**
	 * @return the minHeight
	 */
	public int getMinHeight() {
		return minHeight;
	}

	@Override
	public void onValueChange(ValueChangeEvent<String> event) {
		fitToText();
	}
}
