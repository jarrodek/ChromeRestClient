package com.kalicinscy.web.restclient.client;

import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.event.shared.HandlerRegistration;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.HTML;

public class W3CSetHeadersError implements HeaderSupport {

	@Override
	public void setValue(String value) {
		
	}

	@Override
	public void openDialog() {
		DialogBox dialog = new DialogBox();
		dialog.setAnimationEnabled(true);
		dialog.setAutoHideEnabled(true);
		dialog.setGlassEnabled(true);
		dialog.setModal(true);
		dialog.setHTML("Errot set header");
		HTML htmlNewHtml = new HTML("<h2 class=\"error\">This header cannot be set</h2>\r\n<p>According to W3C specification this header cannot be set.\r\n<br/>You can find the list of headers that cannot be set via XMLHttpRequest<br/>on W3C website <a href=\"http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader-method\" target=\"_blank\">www.w3.org/TR/XMLHttpRequest</a>\r\n</p>", true);
		dialog.setWidget(htmlNewHtml);
		htmlNewHtml.setSize("100%", "100%");
		dialog.center();
		dialog.show();
	}

	@Override
	public HandlerRegistration addValueChangeHandler(
			ValueChangeHandler<String> handler) {
		return null;
	}

}
