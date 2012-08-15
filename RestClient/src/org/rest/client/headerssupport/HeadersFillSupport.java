package org.rest.client.headerssupport;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.rest.client.resources.AppResources;
import org.rest.client.ui.desktop.HeaderSupportAuthorizationImpl;
import org.rest.client.ui.desktop.HeaderSupportDate;
import org.rest.client.ui.desktop.W3CHeaderErrorImpl;

import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.FocusEvent;
import com.google.gwt.event.dom.client.FocusHandler;
import com.google.gwt.event.shared.HandlerRegistration;
import com.google.gwt.user.client.ui.Anchor;
import com.google.gwt.user.client.ui.DecoratedPopupPanel;
import com.google.gwt.user.client.ui.TextBox;

public class HeadersFillSupport implements FocusHandler, ClickHandler {
	private static final HashMap<String, Class<? extends HeaderSupport>> supportedHandlers = new HashMap<String, Class<? extends HeaderSupport>>();
	private final static HashMap<TextBox, HandlerRegistration> REGISTERED = new HashMap<TextBox, HandlerRegistration>();
	
	static {
		//core support
		registerSupport(new String[]{"expires","if-modified-since","if-unmodified-since","last-modified","retry-after","if-range"}, HeaderSupportDate.class);
		registerSupport("authorization", HeaderSupportAuthorizationImpl.class);
	}
	
	private static HeaderSupport initalizeHelperClass(Class<? extends HeaderSupport> clazz){
		HeaderSupport helper = null;
		if(clazz.equals(HeaderSupportAuthorizationImpl.class)){
			helper = GWT.create(HeaderSupportAuthorizationImpl.class);
		} else if(clazz.equals(HeaderSupportDate.class)){
			helper = GWT.create(HeaderSupportDate.class);
		}
		return helper;
	}
	
	
	
	/**
	 * Register class to provide support to fill up header value. Class will be
	 * initialized via GWT.create method.
	 * 
	 * @param headerName
	 *            Header name register handler to.
	 * @param clazz
	 *            Class to initialize to provide support.
	 */
	public static void registerSupport(String headerName,
			Class<? extends HeaderSupport> clazz) {
		
		if (supportedHandlers.containsKey(headerName)) {
			supportedHandlers.remove(headerName);
		}
		supportedHandlers.put(headerName, clazz);
	}

	/**
	 * Register class to provide support to fill up header value. Class will be
	 * initialized via GWT.create method.
	 * 
	 * @param headerNames
	 *            Headers list names register handler to.
	 * @param clazz
	 *            Class to initialize to provide support.
	 */
	public static void registerSupport(String[] headerNames,
			Class<? extends HeaderSupport> clazz) {

		for (String headerName : headerNames) {
			if (supportedHandlers.containsKey(headerName)) {
				supportedHandlers.remove(headerName);
			}
			supportedHandlers.put(headerName, clazz);
		}
	}

	/**
	 * Headers not supported according to W3C see <a
	 * href="http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader-method"
	 * >http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader-method</a>
	 */
	public final static List<String> NOT_SUPPORTED_W3C;
	static {
		NOT_SUPPORTED_W3C = new ArrayList<String>();
//		NOT_SUPPORTED_W3C.add("accept-charset");
//		NOT_SUPPORTED_W3C.add("accept-encoding");
//		NOT_SUPPORTED_W3C.add("connection");
//		NOT_SUPPORTED_W3C.add("content-length");
//		NOT_SUPPORTED_W3C.add("cookie");
//		NOT_SUPPORTED_W3C.add("cookie2");
//		NOT_SUPPORTED_W3C.add("content-transfer-encoding");
//		NOT_SUPPORTED_W3C.add("date");
//		NOT_SUPPORTED_W3C.add("expect");
//		NOT_SUPPORTED_W3C.add("host");
//		NOT_SUPPORTED_W3C.add("keep-alive");
//		NOT_SUPPORTED_W3C.add("referer");
//		NOT_SUPPORTED_W3C.add("te");
//		NOT_SUPPORTED_W3C.add("trailer");
//		NOT_SUPPORTED_W3C.add("transfer-encoding");
//		NOT_SUPPORTED_W3C.add("upgrade");
//		NOT_SUPPORTED_W3C.add("user-agent");
//		NOT_SUPPORTED_W3C.add("via");
//		NOT_SUPPORTED_W3C.add("origin");
//		NOT_SUPPORTED_W3C.add("proxy");
//		NOT_SUPPORTED_W3C.add("sec");
	}

	/**
	 * Check if given header is allowed to set to XMLHttpRequest level 2.<br/>
	 * see <a
	 * href="http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader-method"
	 * >http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader-method</a>
	 * 
	 * @param header
	 * @return
	 */
	public final static boolean isSupported(String header) {
		if (header == null || header.trim().isEmpty()) {
			return false;
		}
		header = header.toLowerCase();
		if (supportedHandlers.containsKey(header)) {
			return true;
		}
		// for now even if header is not supported by w3c specification
		// it will pass to show error dialog
		if (NOT_SUPPORTED_W3C.contains(header)) {
			return true;
		}
		return false;
	}

	/**
	 * Returns true if header is not allowed to set via XMLHttpRequest by
	 * specification.
	 * 
	 * @param header
	 * @return
	 */
	public final static boolean isNotSupportedW3C(String header) {
		if (header == null) {
			return false;
		}
		header = header.toLowerCase();
		return NOT_SUPPORTED_W3C.contains(header);
	}
	
	
	
	final boolean w3cError;
	final String currentHeader;
	final TextBox textBox;
	
	public HeadersFillSupport(String header, TextBox box){
		currentHeader = header;
		textBox = box;
		if(!isSupported(header)){
			w3cError = false;
			return;
		}
		w3cError = NOT_SUPPORTED_W3C.contains(header.toLowerCase());
		if(w3cError){
			box.addStyleName(AppResources.INSTANCE.appCss().w3cError());
		}
		removeSupport(box);
		HandlerRegistration handler = box.addFocusHandler(this);
		REGISTERED.put(box, handler);
	}
	/**
	 * Remove support for given text box.
	 * @param textBox
	 */
	public static void removeSupport(TextBox textBox){
		if(REGISTERED.containsKey(textBox)){
			HandlerRegistration pastHandler = REGISTERED.get(textBox);
			pastHandler.removeHandler();
			REGISTERED.remove(textBox);
			String errorCssName = AppResources.INSTANCE.appCss().w3cError();
			if(textBox.getStyleName().contains(errorCssName)){
				textBox.removeStyleName(errorCssName);
			}
		}
	}

	@Override
	public void onFocus(FocusEvent event) {
		TextBox box = (TextBox) event.getSource();
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
		if(w3cError){
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
		if(currentHeader == null){
			return;
		}
		String header = currentHeader.toLowerCase();
		
		if(NOT_SUPPORTED_W3C.contains(header)){
			W3CHeaderErrorImpl dialog = GWT.create(W3CHeaderErrorImpl.class);
			dialog.openDialog();
			return;
		}
		
		if(!supportedHandlers.containsKey(header)){
			return;
		}
		
		HeaderSupport helper = initalizeHelperClass(supportedHandlers.get(header));
		if(helper == null){
			return;
		}
		
		
		final String currentText = textBox.getValue();
		helper.setValue(currentText);
		helper.openDialog();
		helper.setOnResultHandler(new Callback<String, String>() {
			
			@Override
			public void onSuccess(String result) {
				textBox.setValue(result, true);
			}
			
			@Override
			public void onFailure(String reason) {}
		});
	}
}
