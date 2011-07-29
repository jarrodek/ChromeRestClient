package com.restclient.client;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.FocusEvent;
import com.google.gwt.event.dom.client.FocusHandler;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.HandlerRegistration;
import com.google.gwt.user.client.ui.Anchor;
import com.google.gwt.user.client.ui.DecoratedPopupPanel;
import com.google.gwt.user.client.ui.TextBox;
import com.restclient.client.event.HeaderSupportSubmitEvent;
import com.restclient.client.headersupport.HeaderSupportAuthorization;
import com.restclient.client.headersupport.HeaderSupportDate;
import com.restclient.client.headersupport.W3CSetHeadersError;

/**
 * 
 * Headers that not going to be set:
 * 
 * <pre>
 * Accept-Charset
 * Accept-Encoding
 * Connection
 * Content-Length
 * Cookie
 * Cookie2
 * Content-Transfer-Encoding
 * Date
 * Expect
 * Host
 * Keep-Alive
 * Referer
 * TE
 * Trailer
 * Transfer-Encoding
 * Upgrade
 * User-Agent
 * Via
 * </pre>
 * 
 * according to <a
 * href="http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader-method">
 * http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader-method</a>
 * 
 * @author jarrod
 * 
 */
public class HeadersFillSupport implements ClickHandler, FocusHandler {
	final String currentHeader;
	TextBox textBox;
	final boolean isW3CError;
	private EventBus eventBus;
	public final static HashMap<TextBox, HandlerRegistration> REGISTERED = new HashMap<TextBox, HandlerRegistration>();
		
	public final static List<String> SUPPORTED;
	public final static List<String> DATE_TIME_HEADERS;
	/**
	 * Not supported according to W3C
	 * see <a href="http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader-method"
	 * >http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader-method</a> 
	 */
	public final static List<String> NOT_SUPPORTED_W3C;
	static{
		SUPPORTED = new ArrayList<String>();
		SUPPORTED.add("authorization");
		
		DATE_TIME_HEADERS = new ArrayList<String>();
		DATE_TIME_HEADERS.add( "expires" );
		DATE_TIME_HEADERS.add("if-modified-since");
		DATE_TIME_HEADERS.add("if-unmodified-since");
		DATE_TIME_HEADERS.add("last-modified");
		DATE_TIME_HEADERS.add("retry-after");
		DATE_TIME_HEADERS.add("if-range");
		
		NOT_SUPPORTED_W3C = new ArrayList<String>();
		NOT_SUPPORTED_W3C.add("accept-charset");
		NOT_SUPPORTED_W3C.add("accept-encoding");
		NOT_SUPPORTED_W3C.add("connection");
		NOT_SUPPORTED_W3C.add("content-length");
		NOT_SUPPORTED_W3C.add("cookie");
		NOT_SUPPORTED_W3C.add("cookie2");
		NOT_SUPPORTED_W3C.add("content-transfer-encoding");
		NOT_SUPPORTED_W3C.add("date");
		NOT_SUPPORTED_W3C.add("expect");
		NOT_SUPPORTED_W3C.add("host");
		NOT_SUPPORTED_W3C.add("keep-alive");
		NOT_SUPPORTED_W3C.add("referer");
		NOT_SUPPORTED_W3C.add("te");
		NOT_SUPPORTED_W3C.add("trailer");
		NOT_SUPPORTED_W3C.add("transfer-encoding");
		NOT_SUPPORTED_W3C.add("upgrade");
		NOT_SUPPORTED_W3C.add("user-agent");
		NOT_SUPPORTED_W3C.add("via");
	}
	
	/**
	 * Check if given header is allowed to set to XMLHttpRequest level 2.<br/>
	 * see <a href="http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader-method"
	 * >http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader-method</a> 
	 * @param header
	 * @return
	 */
	public final static boolean isSupported(String header){
		if( header == null ){
			return false;
		}
		header = header.toLowerCase();
		//for here even if not supported by w3c spec will pass to show error dialog dialog
		return (SUPPORTED.contains(header) || NOT_SUPPORTED_W3C.contains(header) || DATE_TIME_HEADERS.contains( header ) );
	}
	
	public HeadersFillSupport(String header, TextBox box){
		if( !isSupported(header) ){
			throw new IllegalArgumentException("Unsupported header.");
		}
		currentHeader = header;
		textBox = box;
		isW3CError = NOT_SUPPORTED_W3C.contains( this.currentHeader.toLowerCase() );
	}
	
	public static void removeSupport(TextBox textBox){
		if( REGISTERED.containsKey( textBox ) ){
			HandlerRegistration pastHandler = REGISTERED.get( textBox );
			pastHandler.removeHandler();
			REGISTERED.remove(textBox);
			if( textBox.getStyleName().contains("w3c-error") ){
				textBox.removeStyleName( "w3c-error" );
			}
		}
	}
	
	public void addSupport(EventBus eventBus){
		this.eventBus = eventBus;
		if( isW3CError ){
			textBox.addStyleName("w3c-error");
		}
		removeSupport(textBox);
		HandlerRegistration handler = textBox.addFocusHandler(this);
		REGISTERED.put(textBox, handler);
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
		left -= 100;
		String label = "Construct";
		if( !box.getText().trim().equals("") ){
			label = "Edit value";
		}
		if( isW3CError ){
			label = "This header can't be set. More info...";
			popup.addStyleName("w3cErrorPopup");
			left -= 130;
		}
		Anchor anchor = new Anchor(label);
		popup.setWidget( anchor );
		anchor.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				popup.hide();
			}
		});
		anchor.addClickHandler(this);
		popup.setPopupPosition(left, top);
		popup.show();
	}

	@Override
	public void onClick(ClickEvent event) {
		HeaderSupport helper = null;
		String head = currentHeader.toLowerCase();
		if( head.equals("authorization") ){
			helper = new HeaderSupportAuthorization( eventBus );
		} else if( NOT_SUPPORTED_W3C.contains( this.currentHeader.toLowerCase() ) ){
			helper = new W3CSetHeadersError();
		} else if( DATE_TIME_HEADERS.contains( currentHeader.toLowerCase() ) ){
			helper = new HeaderSupportDate( this.eventBus );
		}
		
		if(helper == null){
			return;
		}
		final String currentText = textBox.getValue();
		helper.setValue( currentText );
		helper.openDialog();
		final HeaderSupport dialogCompare = helper;
		HeaderSupportSubmitEvent.register(eventBus, new HeaderSupportSubmitEvent.Handler() {
			@Override
			public void onSubmit(String value, Object source) {
				if( source.equals(dialogCompare) )
					textBox.setValue(value, true);
			}
		});
		
	}
}
