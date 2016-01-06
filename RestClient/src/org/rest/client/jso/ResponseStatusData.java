package org.rest.client.jso;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArray;

public final class ResponseStatusData extends JavaScriptObject {
	protected ResponseStatusData(){}
	
	public native void getError() /*-{ return this.ERROR; }-*/;
	public native JsArray<RedirectDataJso> getRedirectData() /*-{ return this.REDIRECT_DATA; }-*/;
	public native JsArray<HeaderJso> getRequestHeaders() /*-{ return this.REQUEST_HEADERS; }-*/;
	public native JsArray<HeaderJso> getResponseHeaders() /*-{ return this.RESPONSE_HEADERS; }-*/;
	public native String getUrl() /*-{ return this.URL; }-*/;
}
