package com.kalicinscy.web.restclient.client;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.FocusEvent;
import com.google.gwt.event.dom.client.FocusHandler;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.user.client.ui.Anchor;
import com.google.gwt.user.client.ui.DecoratedPopupPanel;
import com.google.gwt.user.client.ui.TextBox;

public class HeadersFillSupport implements ClickHandler, FocusHandler {
	final String currentHeader;
	TextBox textBox;
	
	public final static List<String> SUPPORTED;
	static{
		SUPPORTED = new ArrayList<String>();
		SUPPORTED.add("authorization");
	}
	
	public final static boolean isSupported(String header){
		if( header == null ){
			return false;
		}
		return SUPPORTED.contains(header.toLowerCase());
	}
	
	public HeadersFillSupport(String header, TextBox box){
		if( !isSupported(header) ){
			throw new IllegalArgumentException("Unsupported header.");
		}
		currentHeader = header;
		textBox = box;
	}
	
	
	public void addSupport(){
		textBox.addFocusHandler(this);
	}

	@Override
	public void onClick(ClickEvent event) {
		HeaderSupport _helper = null;
		String head = currentHeader.toLowerCase();
		if( head.equals("authorization") ){
			_helper = new HeaderSupportAuthorization();
		}
		
		if(_helper == null){
			return;
		}
		
		final HeaderSupport helper = _helper;
		
		final String currentText = textBox.getValue();
		
		helper.setValue( currentText );
		helper.openDialog();
		helper.addValueChangeHandler(new ValueChangeHandler<String>() {
			
			@Override
			public void onValueChange(ValueChangeEvent<String> event) {
				textBox.setText( event.getValue() );
				ValueChangeEvent.fireIfNotEqual(textBox, currentText, event.getValue());
			}
		});
	}

	@Override
	public void onFocus(FocusEvent event) {
		TextBox box = (TextBox)event.getSource();
		int left = box.getAbsoluteLeft();
		int top = box.getAbsoluteTop();
		top += box.getOffsetHeight();
		left += box.getOffsetWidth();
		final DecoratedPopupPanel popup = new DecoratedPopupPanel(true);
		popup.setAnimationEnabled(true);
		popup.setGlassEnabled(false);
		
		String label = "Construct";
		if( !box.getText().trim().equals("") ){
			label = "Edit value";
		}
		
		Anchor anchor = new Anchor(label);
		popup.setWidget( anchor );
		anchor.addClickHandler(this);
		left -= 100;
		popup.setPopupPosition(left, top);
		popup.show();
	}
}
