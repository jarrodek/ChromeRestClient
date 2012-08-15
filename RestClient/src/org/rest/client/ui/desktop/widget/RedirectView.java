package org.rest.client.ui.desktop.widget;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.rest.client.RestClient;
import org.rest.client.request.RedirectData;
import org.rest.client.storage.websql.HeaderRow;
import org.rest.client.ui.ResponseView.ResponsePresenter;
import org.rest.client.util.Utils;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.dom.client.SpanElement;
import com.google.gwt.dom.client.Style.Display;
import com.google.gwt.resources.client.CssResource;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.Widget;
import com.google.gwt.xhr2.client.Header;
/**
 * Representing single header line.
 * @author Paweł Psztyć
 *
 */
public class RedirectView extends Composite {
	interface Binder extends UiBinder<Widget, RedirectView> {}
	
	interface WidgetStyle extends CssResource {
		
	}
	
	@UiField WidgetStyle style;
	@UiField SpanElement redirectUrlLabel;
	@UiField SpanElement redirectStatusCodeLabel;
	@UiField SpanElement redirectStatusLineLabel;
	@UiField DivElement cacheLine;
	@UiField HTMLPanel headersPanel;
	@UiField StatusCodeImage codeImage;

	private int responseCode = 0;
	/**
	 * 
	 * @param listener 
	 * @param header
	 */
	public RedirectView(final RedirectData data, final ResponsePresenter listener) {
		initWidget(GWT.<Binder> create(Binder.class).createAndBindUi(this));
		
		
		redirectUrlLabel.setInnerHTML(Utils.autoLinkUrls(data.getRedirectUrl()));
		responseCode = data.getStatusCode();
		redirectStatusCodeLabel.setInnerText(responseCode+"");
		
		codeImage.setCode(responseCode);
		
		String line = data.getStatusLine();
		if(line != null){
			redirectStatusLineLabel.setInnerText(line);
		} else {
			redirectStatusLineLabel.getStyle().setDisplay(Display.NONE);
		}
		boolean isFromCache = data.isFromCache();
		if(isFromCache){
			cacheLine.setInnerText("This redirection comes from cache.");
		} else {
			cacheLine.setInnerText("Redirection information has not been cached.");
		}
		
		ArrayList<Header> headers = data.getResponseHeaders();
		final HashMap<String, ResponseHeaderLine> map = new HashMap<String, ResponseHeaderLine>();
		ArrayList<String> list = new ArrayList<String>();
		for(Header header : headers){
			String headerName = header.getName(); 
			ResponseHeaderLine rhl = new ResponseHeaderLine(header);
			map.put(headerName, rhl);
			list.add(headerName);
			headersPanel.add(rhl);
		}
		listener.getResponseHeadersInfo(list, new Callback<List<HeaderRow>, Throwable>() {
			@Override
			public void onSuccess(List<HeaderRow> result) {
				for(HeaderRow row : result){
					String name = row.getName();
					if(map.containsKey(name)){
						ResponseHeaderLine line = map.get(name);
						line.updateDesc(row.getDesc());
						line.updateExample(row.getExample());
						line.updateName(name);
					}
				}
			}
			@Override
			public void onFailure(Throwable reason) {
				if(RestClient.isDebug()){
					Log.debug("Unable to get response headers help.",reason);
				}
			}
		});
	}
}